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

        // Get all user profiles from Firestore
        const userProfilesSnapshot = await db.collection('userProfiles')
            .orderBy('createdAt', 'desc')
            .limit(100) // Limit to prevent too much data
            .get();

        const users = userProfilesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                email: data.email,
                displayName: data.displayName,
                role: data.role,
                isActive: data.isActive ?? true,
                createdAt: data.createdAt,
                lastLoginAt: data.lastLoginAt,
                phoneNumber: data.phoneNumber
            };
        });

        // Get additional Firebase Auth data for each user
        const enrichedUsers = await Promise.all(
            users.map(async (user) => {
                try {
                    const authUser = await admin.auth().getUser(user.uid);
                    return {
                        ...user,
                        emailVerified: authUser.emailVerified,
                        lastSignInTime: authUser.metadata.lastSignInTime,
                        creationTime: authUser.metadata.creationTime
                    };
                } catch (error) {
                    console.warn(`Could not fetch auth data for user ${user.uid}:`, error);
                    return user;
                }
            })
        );

        return NextResponse.json({
            success: true,
            users: enrichedUsers,
            total: enrichedUsers.length
        });

    } catch (error) {
        console.error('Error listing users:', error);
        return NextResponse.json(
            { error: 'Failed to list users' },
            { status: 500 }
        );
    }
}