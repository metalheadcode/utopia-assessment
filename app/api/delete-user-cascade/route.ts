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
        const { uid, reason } = await request.json();

        if (!uid) {
            return NextResponse.json(
                { error: "User UID is required" },
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

        // Prevent self-deletion
        if (decodedToken.uid === uid) {
            return NextResponse.json(
                { error: "Cannot delete your own account" },
                { status: 400 }
            );
        }

        const db = admin.firestore();
        
        // Get user profile for deletion logging
        const userProfile = await db.collection('userProfiles').doc(uid).get();
        if (!userProfile.exists) {
            return NextResponse.json(
                { error: "User profile not found" },
                { status: 404 }
            );
        }

        const userData = userProfile.data();
        const userRole = userData?.role;
        const userEmail = userData?.email;

        // Analyze what will be deleted
        const deletionAnalysis = {
            userProfile: true,
            customerRecords: 0,
            orders: 0,
            assignedJobs: 0,
            delegations: 0,
            auditLogs: 0,
            invitations: 0
        };

        // Check for customer records
        const customerQuery = await db.collection('customers')
            .where('uid', '==', uid)
            .get();
        deletionAnalysis.customerRecords = customerQuery.size;

        // Check for orders (submitted by user)
        const ordersQuery = await db.collection('orders')
            .where('submittedBy', '==', uid)
            .get();
        deletionAnalysis.orders = ordersQuery.size;

        // Check for assigned jobs (if user is worker)
        const assignedJobsQuery = await db.collection('orders')
            .where('assignedTechnician', '==', uid)
            .get();
        deletionAnalysis.assignedJobs = assignedJobsQuery.size;

        // Check for delegations (if user is admin)
        const delegationsQuery = await db.collection('delegations')
            .where('adminUid', '==', uid)
            .get();
        deletionAnalysis.delegations = delegationsQuery.size;

        // Check for audit logs
        const auditLogsQuery = await db.collection('auditLogs')
            .where('performedBy', '==', uid)
            .get();
        deletionAnalysis.auditLogs = auditLogsQuery.size;

        // Check for invitations
        const invitationsQuery = await db.collection('adminInvitations')
            .where('invitedBy', '==', uid)
            .get();
        deletionAnalysis.invitations = invitationsQuery.size;

        // Begin cascading deletion
        const batch = db.batch();
        const deletionResults = {
            userProfile: false,
            firebaseAuth: false,
            customerRecords: 0,
            orders: 0,
            assignedJobs: 0,
            delegations: 0,
            auditLogs: 0,
            invitations: 0
        };

        // Delete user profile
        batch.delete(userProfile.ref);
        deletionResults.userProfile = true;

        // Delete customer records
        customerQuery.docs.forEach(doc => {
            batch.delete(doc.ref);
            deletionResults.customerRecords++;
        });

        // Handle orders submitted by user
        ordersQuery.docs.forEach(doc => {
            const orderData = doc.data();
            
            // If order is completed, keep it but anonymize
            if (orderData.status === 'COMPLETED') {
                batch.update(doc.ref, {
                    submittedBy: 'DELETED_USER',
                    submittedByEmail: 'deleted@system.local',
                    deletedAt: admin.firestore.FieldValue.serverTimestamp(),
                    originalSubmittedBy: uid,
                    originalSubmittedByEmail: userEmail
                });
            } else {
                // Delete pending/in-progress orders
                batch.delete(doc.ref);
                deletionResults.orders++;
            }
        });

        // Handle assigned jobs (if user is worker)
        assignedJobsQuery.docs.forEach(doc => {
            const jobData = doc.data();
            
            // If job is completed, keep it but anonymize
            if (jobData.status === 'COMPLETED') {
                batch.update(doc.ref, {
                    assignedTechnician: 'DELETED_WORKER',
                    deletedAt: admin.firestore.FieldValue.serverTimestamp(),
                    originalAssignedTechnician: uid
                });
            } else {
                // For pending/in-progress jobs, unassign them
                batch.update(doc.ref, {
                    assignedTechnician: null,
                    status: 'PENDING',
                    unassignedAt: admin.firestore.FieldValue.serverTimestamp(),
                    unassignedReason: 'Worker account deleted',
                    originalAssignedTechnician: uid
                });
                deletionResults.assignedJobs++;
            }
        });

        // Delete delegations
        delegationsQuery.docs.forEach(doc => {
            batch.delete(doc.ref);
            deletionResults.delegations++;
        });

        // Anonymize audit logs (don't delete for compliance)
        auditLogsQuery.docs.forEach(doc => {
            batch.update(doc.ref, {
                performedBy: 'DELETED_USER',
                performedByEmail: 'deleted@system.local',
                deletedAt: admin.firestore.FieldValue.serverTimestamp(),
                originalPerformedBy: uid,
                originalPerformedByEmail: userEmail
            });
            deletionResults.auditLogs++;
        });

        // Delete invitations
        invitationsQuery.docs.forEach(doc => {
            batch.delete(doc.ref);
            deletionResults.invitations++;
        });

        // Add deletion audit log
        const deletionLogRef = db.collection('auditLogs').doc();
        batch.set(deletionLogRef, {
            type: 'user_deletion_cascade',
            targetUserId: uid,
            targetUserEmail: userEmail,
            targetUserRole: userRole,
            performedBy: decodedToken.uid,
            performedByEmail: decodedToken.email,
            reason: reason || 'User account deletion',
            deletionAnalysis: deletionAnalysis,
            deletionResults: deletionResults,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        // Commit all deletions
        await batch.commit();

        // Delete from Firebase Auth (must be done after Firestore)
        try {
            await admin.auth().deleteUser(uid);
            deletionResults.firebaseAuth = true;
        } catch (error) {
            console.error('Failed to delete user from Firebase Auth:', error);
            // Continue - Firestore data is already deleted
        }

        return NextResponse.json({
            success: true,
            message: `User ${userEmail} and all related data deleted successfully`,
            deletionAnalysis,
            deletionResults,
            uid: uid,
            userEmail: userEmail,
            userRole: userRole
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}