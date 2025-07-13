"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/root";
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
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    userRole: "admin" | "worker" | "client" | null;
    userClaims: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    loading: boolean;
    refreshUserClaims: () => Promise<void>;
    getUserRole: () => Promise<string | null>;
    getUserClaims: () => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    createAdminRole: (uid: string) => Promise<void>;
    createWorkerRole: (uid: string) => Promise<void>;
    createClientRole: (uid: string) => Promise<void>;
    sendLoginLink: (email: string) => Promise<void>;
    isEmailLink: (url: string) => boolean;
    signInWithEmailLink: (email: string, url: string) => Promise<UserCredential>;
    linkEmailToUser: (email: string, url: string) => Promise<UserCredential>;
    reauthenticateWithEmailLink: (email: string, url: string) => Promise<UserCredential>;
    logout: () => Promise<void>;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<"admin" | "worker" | "client" | null>(null);
    const [userClaims, setUserClaims] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [loading, setLoading] = useState(true);

    const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        handleCodeInApp: true,
    };


    /////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// AUTH START HERE ////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
    // Force refresh the ID token to get updated claims
    const refreshUserClaims = async () => {
        try {
            if (!auth.currentUser) return;

            // Force refresh the token (important after setting new claims)
            await auth.currentUser.getIdToken(true); // true = force refresh

            // Get updated claims
            const idTokenResult = await auth.currentUser.getIdTokenResult();
            const claims = idTokenResult.claims;

            setUserRole(claims.role as "admin" | "worker" | "client" || null);
            setUserClaims(claims);
        } catch (error) {
            console.error('Error refreshing user claims:', error);
        }
    };

    const getUserRole = async (): Promise<string | null> => {
        try {
            if (!auth.currentUser) return null;

            const idTokenResult = await auth.currentUser.getIdTokenResult();
            return idTokenResult.claims.role as string || null;
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    };

    const getUserClaims = async () => {
        try {
            if (!auth.currentUser) return null;

            const idTokenResult = await auth.currentUser.getIdTokenResult();
            return idTokenResult.claims;
        } catch (error) {
            console.error('Error getting user claims:', error);
            return null;
        }
    };

    const createAdminRole = async (uid: string) => {
        try {
            const response = await fetch('/api/set-user-role', {
                method: 'POST',
                body: JSON.stringify({ uid, role: 'admin' })
            });
            if (!response.ok) {
                throw new Error('Failed to create admin role');
            }
        } catch (error) {
            console.error('Error creating client role:', error);
            throw error;
        }
    }

    const createWorkerRole = async (uid: string) => {
        try {
            const response = await fetch('/api/set-user-role', {
                method: 'POST',
                body: JSON.stringify({ uid, role: 'worker' })
            });
            if (!response.ok) {
                throw new Error('Failed to create worker role');
            }
        } catch (error) {
            console.error('Error creating worker role:', error);
            throw error;
        }
    }

    const createClientRole = async (uid: string) => {
        try {
            const response = await fetch('/api/set-user-role', {
                method: 'POST',
                body: JSON.stringify({ uid, role: 'client' })
            });
            if (!response.ok) {
                throw new Error('Failed to create client role');
            }
        } catch (error) {
            console.error('Error creating client role:', error);
            throw error;
        }
    }

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
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };
    /////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// AUTH END HERE //////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);

            if (user) {
                // Load user claims when user signs in
                try {
                    const idTokenResult = await user.getIdTokenResult();
                    setUserRole(idTokenResult.claims.role as "admin" | "worker" | "client" || null);
                    setUserClaims(idTokenResult.claims);
                } catch (error) {
                    console.error('Error loading user claims:', error);
                }
            } else {
                setUserRole(null);
                setUserClaims(null);
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value: AuthContextType = {
        user,
        userRole,
        userClaims,
        loading,
        refreshUserClaims,
        getUserRole,
        getUserClaims,
        createAdminRole,
        createWorkerRole,
        createClientRole,
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