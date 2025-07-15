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
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
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

        // Check if user already exists
        let existingUser = null;
        try {
            existingUser = await admin.auth().getUserByEmail(email);
            
            // If user exists, check if they're already an admin
            const userProfile = await db.collection('userProfiles').doc(existingUser.uid).get();
            if (userProfile.exists && userProfile.data()?.role === 'admin') {
                return NextResponse.json(
                    { error: "User is already an admin" },
                    { status: 400 }
                );
            }
        } catch (error) {
            // User doesn't exist, which is perfect for invitations
            console.log('User does not exist - this is fine for invitations');
        }

        // Create invitation record
        const invitationId = db.collection('adminInvitations').doc().id;
        const invitationData = {
            id: invitationId,
            email: email.toLowerCase(),
            invitedBy: decodedToken.uid,
            invitedByEmail: decodedToken.email,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt: admin.firestore.FieldValue.serverTimestamp(), // Will set to 7 days from now
        };

        // Calculate expiry date (7 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        invitationData.expiresAt = admin.firestore.Timestamp.fromDate(expiryDate);

        await db.collection('adminInvitations').doc(invitationId).set(invitationData);

        // Send invitation email via Resend
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: email,
                subject: 'Admin Invitation - Sejook Namatey Dashboard',
                clientName: email.split('@')[0],
                invitationId: invitationId,
                inviterName: decodedToken.name || decodedToken.email,
                type: 'admin_invitation',
                loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login?invitation=${invitationId}`
            })
        });

        if (!emailResponse.ok) {
            console.error('Failed to send invitation email');
            // Don't fail the whole operation, just log it
        }

        // Log the invitation
        await db.collection('auditLogs').add({
            type: 'admin_invitation_sent',
            targetEmail: email,
            invitationId: invitationId,
            performedBy: decodedToken.uid,
            performedByEmail: decodedToken.email,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return NextResponse.json({
            success: true,
            message: "Admin invitation sent successfully",
            invitationId: invitationId,
            email: email
        });

    } catch (error) {
        console.error('Error sending admin invitation:', error);
        return NextResponse.json(
            { error: 'Failed to send admin invitation' },
            { status: 500 }
        );
    }
}