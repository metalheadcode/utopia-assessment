

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const firebaseAdminConfig = {
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
    }),
};

// Initialize Firebase Admin
export function getFirebaseAdminApp() {
    if (getApps().length <= 0) {
        return initializeApp(firebaseAdminConfig);
    } else {
        return getApps()[0];
    }
}

export const admin = getAuth(getFirebaseAdminApp());