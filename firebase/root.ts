import { initializeApp } from "firebase/app";

import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const clientCredentials = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(clientCredentials);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const postsCollection = collection(db, "posts");
const commentsCollection = collection(db, "comments");
const usersCollection = collection(db, "users");
const userProfilesCollection = collection(db, "userProfiles");
const delegationsCollection = collection(db, "delegations");
const adminActionsCollection = collection(db, "adminActions");
const ordersCollection = collection(db, "orders");

export {
    app,
    auth,
    db,
    storage,
    postsCollection,
    commentsCollection,
    usersCollection,
    userProfilesCollection,
    delegationsCollection,
    adminActionsCollection,
    ordersCollection,
};