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
        const { email, uid } = await request.json();

        if (!email || !uid) {
            return NextResponse.json(
                { error: "Email and UID are required" },
                { status: 400 }
            );
        }

        const db = admin.firestore();

        // Get pending admin role
        const pendingRoleDoc = await db.collection('pendingAdminRoles').doc(email.toLowerCase()).get();

        if (!pendingRoleDoc.exists) {
            return NextResponse.json(
                { error: "No pending admin role found for this email" },
                { status: 404 }
            );
        }

        const pendingRole = pendingRoleDoc.data();

        // Update status to completed and add the new uid
        await db.collection('pendingAdminRoles').doc(email.toLowerCase()).update({
            status: 'completed',
            completedAt: admin.firestore.FieldValue.serverTimestamp(),
            assignedUid: uid
        });

        // Log the completion
        await db.collection('auditLogs').add({
            type: 'admin_invitation_completed',
            email: email.toLowerCase(),
            uid: uid,
            invitationId: pendingRole?.invitationId,
            invitedBy: pendingRole?.invitedBy,
            invitedByEmail: pendingRole?.invitedByEmail,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return NextResponse.json({
            success: true,
            message: "Admin role assignment completed successfully"
        });

    } catch (error) {
        console.error('Error completing pending admin role:', error);
        return NextResponse.json(
            { error: 'Failed to complete pending admin role' },
            { status: 500 }
        );
    }
}