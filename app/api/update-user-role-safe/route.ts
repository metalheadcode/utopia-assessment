import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        }),
    });
}

export async function POST(request: NextRequest) {
    try {
        const { uid, newRole, options = {} } = await request.json();

        if (!uid || !newRole) {
            return NextResponse.json(
                { error: "User UID and new role are required" },
                { status: 400 }
            );
        }

        if (!['admin', 'worker', 'client'].includes(newRole)) {
            return NextResponse.json(
                { error: "Invalid role. Must be admin, worker, or client" },
                { status: 400 }
            );
        }

        // Verify requesting user is admin
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json(
                { error: "Authorization required" },
                { status: 401 }
            );
        }

        const token = authHeader.replace('Bearer ', '');
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        if (decodedToken.role !== 'admin') {
            return NextResponse.json(
                { error: "Admin privileges required" },
                { status: 403 }
            );
        }

        const db = admin.firestore();
        
        // Get current user profile
        const userProfile = await db.collection('userProfiles').doc(uid).get();
        if (!userProfile.exists) {
            return NextResponse.json(
                { error: "User profile not found" },
                { status: 404 }
            );
        }

        const userData = userProfile.data();
        const currentRole = userData?.role;

        if (currentRole === newRole) {
            return NextResponse.json(
                { error: "User already has this role" },
                { status: 400 }
            );
        }

        // Perform safety checks
        let safetyChecks = { passed: true, errors: [] as string[] };

        // Check for active jobs if changing from worker
        if (currentRole === 'worker' && newRole !== 'worker') {
            const activeJobsQuery = await db.collection('orders')
                .where('assignedTechnician', '==', uid)
                .where('status', 'in', ['PENDING', 'IN PROGRESS'])
                .get();

            if (activeJobsQuery.size > 0 && !options.forceChange) {
                safetyChecks.passed = false;
                safetyChecks.errors.push(
                    `Cannot change role: User has ${activeJobsQuery.size} active jobs. Complete jobs or use force option.`
                );
            }
        }

        // Check for customer records if changing from client
        if (currentRole === 'client' && newRole !== 'client') {
            const customerQuery = await db.collection('customers')
                .where('uid', '==', uid)
                .limit(1)
                .get();

            if (!customerQuery.empty && !options.migrateCustomerData) {
                safetyChecks.passed = false;
                safetyChecks.errors.push(
                    'Cannot change role: User has customer records. Enable data migration option.'
                );
            }
        }

        if (!safetyChecks.passed) {
            return NextResponse.json({
                success: false,
                error: "Safety checks failed",
                details: safetyChecks.errors
            }, { status: 400 });
        }

        // Begin role change transaction
        const batch = db.batch();

        // Update Firebase Auth custom claims
        await admin.auth().setCustomUserClaims(uid, {
            role: newRole,
            updatedAt: Date.now(),
            previousRole: currentRole,
            changedBy: decodedToken.uid
        });

        // Update user profile
        const profileUpdateData: any = {
            role: newRole,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            roleHistory: admin.firestore.FieldValue.arrayUnion({
                fromRole: currentRole,
                toRole: newRole,
                changedAt: admin.firestore.FieldValue.serverTimestamp(),
                changedBy: decodedToken.uid,
                reason: options.reason || 'Role change via admin panel'
            })
        };

        // Add role-specific data
        if (newRole === 'worker') {
            profileUpdateData.additionalData = {
                ...(userData?.additionalData || {}),
                technicianId: `TECH-${uid.slice(-6).toUpperCase()}`,
                department: 'Field Service',
                supervisor: options.supervisor || null
            };
        } else if (newRole === 'admin') {
            profileUpdateData.additionalData = {
                ...(userData?.additionalData || {}),
                managedWorkers: [],
                adminSince: admin.firestore.FieldValue.serverTimestamp()
            };
        }

        batch.update(userProfile.ref, profileUpdateData);

        // Handle customer data migration if needed
        if (options.migrateCustomerData && currentRole === 'client') {
            const customerQuery = await db.collection('customers')
                .where('uid', '==', uid)
                .limit(1)
                .get();

            if (!customerQuery.empty) {
                const customerDoc = customerQuery.docs[0];
                batch.update(customerDoc.ref, {
                    roleChanged: true,
                    previousRole: currentRole,
                    newRole: newRole,
                    migratedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            }
        }

        // Commit the transaction
        await batch.commit();

        // Log the role change
        await db.collection('auditLogs').add({
            type: 'role_change',
            targetUserId: uid,
            targetUserEmail: userData?.email,
            fromRole: currentRole,
            toRole: newRole,
            performedBy: decodedToken.uid,
            performedByEmail: decodedToken.email,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            options: options,
            safetyChecks: safetyChecks
        });

        return NextResponse.json({
            success: true,
            message: `User role successfully changed from ${currentRole} to ${newRole}`,
            previousRole: currentRole,
            newRole: newRole,
            uid: uid
        });

    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
        );
    }
}