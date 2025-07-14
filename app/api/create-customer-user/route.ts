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
        const { email, displayName, phone, address } = await request.json();

        if (!email || !displayName) {
            return NextResponse.json(
                { error: "Email and display name are required" },
                { status: 400 }
            );
        }

        // Step 1: Create Firebase Auth user
        let userRecord;
        try {
            userRecord = await admin.auth().createUser({
                email,
                displayName,
                emailVerified: false,
            });
        } catch (authError: unknown) {
            const error = authError as { code?: string };
            if (error.code === 'auth/email-already-exists') {
                // User already exists, get the existing user
                userRecord = await admin.auth().getUserByEmail(email);
            } else {
                throw authError;
            }
        }

        // Step 2: Set custom claims to "client" role
        await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: 'client',
            updatedAt: Date.now()
        });

        // Step 3: Create user profile in Firestore
        const db = admin.firestore();
        await db.collection('userProfiles').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            displayName,
            phoneNumber: phone || null,
            role: 'client',
            isActive: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Step 4: Create customer record in customers collection
        const customerData = {
            name: displayName,
            email,
            phone: phone || null,
            address: address || null,
            uid: userRecord.uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const customerDocRef = await db.collection('customers').add(customerData);

        return NextResponse.json({
            success: true,
            message: "Customer user created successfully",
            uid: userRecord.uid,
            customerId: customerDocRef.id,
        });

    } catch (error) {
        console.error('Error creating customer user:', error);
        return NextResponse.json(
            { error: 'Failed to create customer user' },
            { status: 500 }
        );
    }
}