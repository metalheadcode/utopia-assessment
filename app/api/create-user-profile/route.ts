import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@/types/global.d.types";
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
        const { uid, email, displayName, role, additionalData } = await request.json();

        if (!uid || !email || !displayName || !role) {
            return NextResponse.json(
                { error: "Missing required fields: uid, email, displayName, role" },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles: UserRole[] = ["admin", "worker", "client"];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: "Invalid role. Must be one of: admin, worker, client" },
                { status: 400 }
            );
        }

        // Create user profile using Admin SDK (bypasses security rules)
        const db = admin.firestore();
        await db.collection('userProfiles').doc(uid).set({
            uid,
            email,
            displayName,
            role,
            isActive: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            ...additionalData
        });

        return NextResponse.json({ 
            success: true, 
            message: "User profile created successfully" 
        });

    } catch (error) {
        console.error("Error creating user profile:", error);
        return NextResponse.json(
            { error: "Failed to create user profile" },
            { status: 500 }
        );
    }
}