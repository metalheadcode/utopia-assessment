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
        const { email, displayName, supervisor, phoneNumber, department } = await request.json();

        if (!email || !displayName) {
            return NextResponse.json(
                { error: "Email and display name are required" },
                { status: 400 }
            );
        }

        // Create user in Firebase Auth
        const userRecord = await admin.auth().createUser({
            email: email,
            displayName: displayName,
            disabled: false,
            emailVerified: false, // They'll verify when they use magic link
        });

        // Set custom claims for worker role
        await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: 'worker',
            updatedAt: Date.now()
        });

        // Create user profile in Firestore using the Admin SDK
        const db = admin.firestore();
        await db.collection('userProfiles').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email: email,
            displayName: displayName,
            role: 'worker',
            isActive: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            // Worker-specific fields
            supervisor: supervisor,
            technicianId: `TECH-${userRecord.uid.slice(-6).toUpperCase()}`,
            department: department || 'Field Service',
            phoneNumber: phoneNumber
        });

        return NextResponse.json({
            success: true,
            message: `Worker account created successfully for ${displayName}`,
            workerUid: userRecord.uid,
            technicianId: `TECH-${userRecord.uid.slice(-6).toUpperCase()}`
        });

    } catch (error: unknown) {
        console.error('Error creating worker:', error);
        
        // Handle specific Firebase errors
        if (error && typeof error === 'object' && 'code' in error) {
            if (error.code === 'auth/email-already-exists') {
                return NextResponse.json(
                    { error: 'An account with this email already exists' },
                    { status: 400 }
                );
            }
            
            if (error.code === 'auth/invalid-email') {
                return NextResponse.json(
                    { error: 'Invalid email address' },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Failed to create worker account' },
            { status: 500 }
        );
    }
}