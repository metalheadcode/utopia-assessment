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
        const { uid, role } = await request.json();

        // Set custom claims using Firebase Admin SDK
        await admin.auth().setCustomUserClaims(uid, {
            role: role,
            updatedAt: Date.now()
        });

        return NextResponse.json({
            success: true,
            message: `User role updated to ${role}`
        });

    } catch (error) {
        console.error('Error setting custom claims:', error);
        return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
        );
    }
}