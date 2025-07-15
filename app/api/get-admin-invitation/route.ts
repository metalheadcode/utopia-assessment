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
        const invitationId = searchParams.get('id');

        if (!invitationId) {
            return NextResponse.json(
                { error: "Invitation ID is required" },
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

        // Check if invitation is expired
        const now = new Date();
        let expiryDate: Date | null = null;
        
        // Handle Firestore Timestamp conversion
        if (invitation?.expiresAt) {
            if (typeof invitation.expiresAt.toDate === 'function') {
                // It's a Firestore Timestamp
                expiryDate = invitation.expiresAt.toDate();
            } else if (invitation.expiresAt._seconds) {
                // It's a serialized Timestamp object
                expiryDate = new Date(invitation.expiresAt._seconds * 1000);
            } else if (invitation.expiresAt instanceof Date) {
                // It's already a Date
                expiryDate = invitation.expiresAt;
            }
        }
        
        if (expiryDate && expiryDate < now) {
            // Update invitation status to expired
            await db.collection('adminInvitations').doc(invitationId).update({
                status: 'expired'
            });
            invitation!.status = 'expired';
        }

        return NextResponse.json({
            success: true,
            invitation: invitation
        });

    } catch (error) {
        console.error('Error fetching admin invitation:', error);
        return NextResponse.json(
            { error: 'Failed to fetch admin invitation' },
            { status: 500 }
        );
    }
}