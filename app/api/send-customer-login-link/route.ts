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
        const { email, customerName } = await request.json();

        if (!email || !customerName) {
            return NextResponse.json(
                { error: "Email and customer name are required" },
                { status: 400 }
            );
        }

        // Generate email sign-in link with email in query string for better UX
        const actionCodeSettings = {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?email=${encodeURIComponent(email)}`,
            handleCodeInApp: true,
        };

        const signInLink = await admin.auth().generateSignInWithEmailLink(email, actionCodeSettings);

        // Send email using your existing email service
        // For now, we'll use a simple approach - you can integrate with Resend later
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: email,
                subject: 'Access Your Service Order Status - SejookNamatey',
                clientName: customerName,
                type: 'customer_login_link',
                signInLink: signInLink
            })
        });

        if (!emailResponse.ok) {
            console.warn('Failed to send email notification, but login link was created');
        }

        return NextResponse.json({
            success: true,
            message: "Login link sent successfully",
            signInLink: signInLink // You might want to remove this in production
        });

    } catch (error) {
        console.error('Error sending customer login link:', error);
        return NextResponse.json(
            { error: 'Failed to send login link' },
            { status: 500 }
        );
    }
}