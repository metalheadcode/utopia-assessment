"use client"

import { createContext, useContext, useEffect, useState } from "react";
import {
    auth
} from "@/firebase"
import {
    signOut,
    User,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink as firebaseSignInWithEmailLink,
    EmailAuthProvider,
    linkWithCredential,
    reauthenticateWithCredential,
    UserCredential
} from "firebase/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    sendLoginLink: (email: string) => Promise<void>;
    isEmailLink: (url: string) => boolean;
    signInWithEmailLink: (email: string, url: string) => Promise<UserCredential>;
    linkEmailToUser: (email: string, url: string) => Promise<UserCredential>;
    reauthenticateWithEmailLink: (email: string, url: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const actionCodeSettings = {
        url: `https://utopia-assessment.vercel.app/dashboard`,
        handleCodeInApp: true,
    };

    const sendLoginLink = async (email: string) => {
        try {
            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            // Save the email to localStorage so we can use it when the user clicks the link
            window.localStorage.setItem('emailForSignIn', email);
        } catch (error) {
            console.error('Error sending sign in link:', error);
            throw error;
        }
    };

    const isEmailLink = (url: string): boolean => {
        return isSignInWithEmailLink(auth, url);
    };

    const signInWithEmailLink = async (email: string, url: string): Promise<UserCredential> => {
        try {
            const result = await firebaseSignInWithEmailLink(auth, email, url);
            // Clear the email from localStorage
            window.localStorage.removeItem('emailForSignIn');
            return result;
        } catch (error) {
            console.error('Error signing in with email link:', error);
            throw error;
        }
    };

    const linkEmailToUser = async (email: string, url: string): Promise<UserCredential> => {
        try {
            if (!auth.currentUser) {
                throw new Error('No user is currently signed in');
            }

            const credential = EmailAuthProvider.credentialWithLink(email, url);
            const result = await linkWithCredential(auth.currentUser, credential);
            return result;
        } catch (error) {
            console.error('Error linking email to user:', error);
            throw error;
        }
    };

    const reauthenticateWithEmailLink = async (email: string, url: string): Promise<UserCredential> => {
        try {
            if (!auth.currentUser) {
                throw new Error('No user is currently signed in');
            }

            const credential = EmailAuthProvider.credentialWithLink(email, url);
            const result = await reauthenticateWithCredential(auth.currentUser, credential);
            return result;
        } catch (error) {
            console.error('Error reauthenticating with email link:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value: AuthContextType = {
        user,
        loading,
        sendLoginLink,
        isEmailLink,
        signInWithEmailLink,
        linkEmailToUser,
        reauthenticateWithEmailLink,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};