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

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const db = admin.firestore();

        // Check for pending admin role
        const pendingRoleDoc = await db.collection('pendingAdminRoles').doc(email.toLowerCase()).get();

        if (!pendingRoleDoc.exists) {
            return NextResponse.json({
                hasPendingRole: false,
                message: "No pending admin role found for this email"
            });
        }

        const pendingRole = pendingRoleDoc.data();

        // Check if pending role is still valid (not expired)
        if (pendingRole?.status === 'pending_signup') {
            return NextResponse.json({
                hasPendingRole: true,
                pendingRole: pendingRole,
                message: "Pending admin role found"
            });
        }

        return NextResponse.json({
            hasPendingRole: false,
            message: "Pending admin role exists but is not valid"
        });

    } catch (error) {
        console.error('Error checking pending admin role:', error);
        return NextResponse.json(
            { error: 'Failed to check pending admin role' },
            { status: 500 }
        );
    }
}