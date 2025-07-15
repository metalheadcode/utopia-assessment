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
        const { uid } = await request.json();

        if (!uid) {
            return NextResponse.json(
                { error: "User UID is required" },
                { status: 400 }
            );
        }

        const db = admin.firestore();

        // Check user's current role and profile
        const userProfile = await db.collection('userProfiles').doc(uid).get();
        if (!userProfile.exists) {
            return NextResponse.json(
                { error: "User profile not found" },
                { status: 404 }
            );
        }

        const userData = userProfile.data();
        const currentRole = userData?.role;

        // Initialize dependency checks
        const dependencies = {
            currentRole,
            hasCustomerRecord: false,
            customerId: null as string | null,
            customerOrders: 0,
            hasActiveJobs: false,
            pendingJobs: 0,
            inProgressJobs: 0,
            completedJobs: 0,
            totalAssignedJobs: 0,
            blockingFactors: [] as string[],
            canChangeRole: true
        };

        // Check for customer record
        const customerQuery = await db.collection('customers')
            .where('uid', '==', uid)
            .limit(1)
            .get();

        if (!customerQuery.empty) {
            const customerDoc = customerQuery.docs[0];
            dependencies.hasCustomerRecord = true;
            dependencies.customerId = customerDoc.id;

            // Count customer orders
            const customerOrdersQuery = await db.collection('orders')
                .where('customerEmail', '==', userData?.email)
                .get();
            dependencies.customerOrders = customerOrdersQuery.size;

            if (dependencies.customerOrders > 0) {
                dependencies.blockingFactors.push(`Has ${dependencies.customerOrders} orders as customer`);
            }
        }

        // Check for assigned jobs (if user is or was a worker)
        const assignedJobsQuery = await db.collection('orders')
            .where('assignedTechnician', '==', uid)
            .get();

        dependencies.totalAssignedJobs = assignedJobsQuery.size;

        if (assignedJobsQuery.size > 0) {
            const jobsByStatus = {
                PENDING: 0,
                'IN PROGRESS': 0,
                COMPLETED: 0
            };

            assignedJobsQuery.docs.forEach(doc => {
                const status = doc.data().status;
                if (status in jobsByStatus) {
                    jobsByStatus[status as keyof typeof jobsByStatus]++;
                }
            });

            dependencies.pendingJobs = jobsByStatus.PENDING;
            dependencies.inProgressJobs = jobsByStatus['IN PROGRESS'];
            dependencies.completedJobs = jobsByStatus.COMPLETED;

            // Check if user has active jobs
            const activeJobs = dependencies.pendingJobs + dependencies.inProgressJobs;
            if (activeJobs > 0) {
                dependencies.hasActiveJobs = true;
                dependencies.blockingFactors.push(
                    `Has ${activeJobs} active jobs (${dependencies.pendingJobs} pending, ${dependencies.inProgressJobs} in progress)`
                );
            }
        }

        // Determine if role change is safe
        if (currentRole === 'worker' && dependencies.hasActiveJobs) {
            dependencies.canChangeRole = false;
            dependencies.blockingFactors.push('Worker role cannot be changed while having active jobs');
        }

        // Check admin permissions
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json(
                { error: "Authorization required" },
                { status: 401 }
            );
        }

        // Verify requesting user is admin
        const token = authHeader.replace('Bearer ', '');
        const decodedToken = await admin.auth().verifyIdToken(token);

        if (decodedToken.role !== 'admin') {
            return NextResponse.json(
                { error: "Admin privileges required" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            dependencies
        });

    } catch (error) {
        console.error('Error checking user dependencies:', error);
        return NextResponse.json(
            { error: 'Failed to check user dependencies' },
            { status: 500 }
        );
    }
}