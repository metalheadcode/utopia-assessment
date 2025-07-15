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
        const { invitationId, email } = await request.json();

        if (!invitationId || !email) {
            return NextResponse.json(
                { error: "Invitation ID and email are required" },
                { status: 400 }
            );
        }

        const db = admin.firestore();

        // Get invitation document
        const invitationDoc = await db.collection('adminInvitations').doc(invitationId).get();

        if (!invitationDoc.exists) {
            return NextResponse.json(
                { error: "Invitation not found" },
                { status: 404 }
            );
        }

        const invitation = invitationDoc.data();

        // Verify invitation email matches
        if (invitation?.email.toLowerCase() !== email.toLowerCase()) {
            return NextResponse.json(
                { error: "Email does not match invitation" },
                { status: 400 }
            );
        }

        // Check if invitation is expired
        const now = new Date();
        const expiryDate = invitation?.expiresAt.toDate();

        if (expiryDate && expiryDate < now) {
            return NextResponse.json(
                { error: "Invitation has expired" },
                { status: 400 }
            );
        }

        // Check if already accepted
        if (invitation?.status === 'accepted') {
            return NextResponse.json(
                { error: "Invitation has already been accepted" },
                { status: 400 }
            );
        }

        // Update invitation status to accepted
        await db.collection('adminInvitations').doc(invitationId).update({
            status: 'accepted',
            acceptedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Create a pending admin role assignment for when the user signs in
        // This will be checked during the authentication flow
        await db.collection('pendingAdminRoles').doc(email.toLowerCase()).set({
            email: email.toLowerCase(),
            invitationId: invitationId,
            invitedBy: invitation?.invitedBy || '',
            invitedByEmail: invitation?.invitedByEmail || '',
            acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'pending_signup'
        });

        // Log the invitation acceptance
        await db.collection('auditLogs').add({
            type: 'admin_invitation_accepted',
            email: email.toLowerCase(),
            invitationId: invitationId,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return NextResponse.json({
            success: true,
            message: "Admin invitation accepted successfully"
        });

    } catch (error) {
        console.error('Error accepting admin invitation:', error);
        return NextResponse.json(
            { error: 'Failed to accept admin invitation' },
            { status: 500 }
        );
    }
}