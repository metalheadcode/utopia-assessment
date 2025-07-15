"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/root";
import { UserProfile, WorkerDelegation, DelegationPermission } from "@/types/global.d.types";
import { UserService, DelegationService } from "@/lib/user-service";
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
    userProfile: UserProfile | null;
    availableDelegations: WorkerDelegation[];
    currentImpersonation: WorkerDelegation | null;
    loading: boolean;
    refreshUserClaims: () => Promise<void>;
    refreshUserProfile: () => Promise<void>;
    getUserRole: () => Promise<string | null>;
    getUserClaims: () => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    createAdminRole: (uid: string, email: string, displayName: string) => Promise<void>;
    createWorkerRole: (uid: string, email: string, displayName: string, supervisor?: string) => Promise<void>;
    createClientRole: (uid: string, email: string, displayName: string) => Promise<void>;
    sendLoginLink: (email: string) => Promise<void>;
    isEmailLink: (url: string) => boolean;
    signInWithEmailLink: (email: string, url: string) => Promise<UserCredential>;
    linkEmailToUser: (email: string, url: string) => Promise<UserCredential>;
    reauthenticateWithEmailLink: (email: string, url: string) => Promise<UserCredential>;
    startImpersonation: (delegation: WorkerDelegation) => void;
    stopImpersonation: () => void;
    canPerformAction: (action: string) => boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<"admin" | "worker" | "client" | null>(null);
    const [userClaims, setUserClaims] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [availableDelegations, setAvailableDelegations] = useState<WorkerDelegation[]>([]);
    const [currentImpersonation, setCurrentImpersonation] = useState<WorkerDelegation | null>(null);
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

    // Refresh user profile from Firestore
    const refreshUserProfile = async () => {
        try {
            if (!auth.currentUser) return;

            let profile = await UserService.getUserProfile(auth.currentUser.uid);

            // If profile doesn't exist, create one based on auth claims
            if (!profile && auth.currentUser.email) {
                const idTokenResult = await auth.currentUser.getIdTokenResult();
                const role = idTokenResult.claims.role as "admin" | "worker" | "client";

                if (role) {
                    await fetch('/api/create-user-profile', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            uid: auth.currentUser.uid,
                            email: auth.currentUser.email,
                            displayName: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
                            role
                        })
                    });

                    // Fetch the newly created profile
                    profile = await UserService.getUserProfile(auth.currentUser.uid);
                }
            }

            setUserProfile(profile);

            // If user is admin, load available delegations
            if (profile?.role === 'admin') {
                const delegations = await DelegationService.getAdminDelegations(auth.currentUser.uid);
                setAvailableDelegations(delegations);
            }
        } catch (error) {
            console.error('Error refreshing user profile:', error);
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

    const createAdminRole = async (uid: string, email: string, displayName: string) => {
        try {
            // Set Firebase Auth custom claims
            const roleResponse = await fetch('/api/set-user-role', {
                method: 'POST',
                body: JSON.stringify({ uid, role: 'admin' })
            });
            if (!roleResponse.ok) {
                throw new Error('Failed to create admin role');
            }

            // Create user profile in Firestore
            const profileResponse = await fetch('/api/create-user-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid,
                    email,
                    displayName,
                    role: 'admin',
                    additionalData: {
                        managedWorkers: []
                    }
                })
            });
            if (!profileResponse.ok) {
                throw new Error('Failed to create admin profile');
            }
        } catch (error) {
            console.error('Error creating admin role:', error);
            throw error;
        }
    }

    const createWorkerRole = async (uid: string, email: string, displayName: string, supervisor?: string) => {
        try {
            // Set Firebase Auth custom claims
            const roleResponse = await fetch('/api/set-user-role', {
                method: 'POST',
                body: JSON.stringify({ uid, role: 'worker' })
            });
            if (!roleResponse.ok) {
                throw new Error('Failed to create worker role');
            }

            // Create user profile in Firestore
            const profileResponse = await fetch('/api/create-user-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid,
                    email,
                    displayName,
                    role: 'worker',
                    additionalData: {
                        supervisor,
                        technicianId: `TECH-${uid.slice(-6).toUpperCase()}`,
                        department: 'Field Service'
                    }
                })
            });
            if (!profileResponse.ok) {
                throw new Error('Failed to create worker profile');
            }
        } catch (error) {
            console.error('Error creating worker role:', error);
            throw error;
        }
    }

    const createClientRole = async (uid: string, email: string, displayName: string) => {
        try {
            // Set Firebase Auth custom claims
            const roleResponse = await fetch('/api/set-user-role', {
                method: 'POST',
                body: JSON.stringify({ uid, role: 'client' })
            });
            if (!roleResponse.ok) {
                throw new Error('Failed to create client role');
            }

            // Create user profile in Firestore
            const profileResponse = await fetch('/api/create-user-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid,
                    email,
                    displayName,
                    role: 'client'
                })
            });
            if (!profileResponse.ok) {
                throw new Error('Failed to create client profile');
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

    // Impersonation functions
    const startImpersonation = (delegation: WorkerDelegation) => {
        setCurrentImpersonation(delegation);
    };

    const stopImpersonation = () => {
        setCurrentImpersonation(null);
    };

    const canPerformAction = (action: string): boolean => {
        // If not impersonating, check user's own role
        if (!currentImpersonation) {
            return userRole === 'admin' || (userRole === 'worker' && ['take_jobs', 'complete_jobs'].includes(action));
        }

        // If impersonating, check delegation permissions
        return currentImpersonation.permissions.includes(action as DelegationPermission);
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setCurrentImpersonation(null); // Clear impersonation on logout
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
                    let role = idTokenResult.claims.role as "admin" | "worker" | "client" || null;
                    
                    // If user has no role (new user), check for pending admin invitations first
                    if (!role && user.email) {
                        console.log('New user detected, checking for admin invitations:', user.email);
                        
                        try {
                            // Check for pending admin role
                            const pendingAdminResponse = await fetch(`/api/check-pending-admin-role?email=${encodeURIComponent(user.email)}`);
                            const pendingAdminData = await pendingAdminResponse.json();
                            
                            if (pendingAdminResponse.ok && pendingAdminData.hasPendingRole) {
                                console.log('Found pending admin role for:', user.email);
                                
                                // Assign admin role
                                await createAdminRole(
                                    user.uid, 
                                    user.email, 
                                    user.displayName || user.email.split('@')[0]
                                );
                                
                                // Mark pending role as completed
                                await fetch('/api/complete-pending-admin-role', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email: user.email, uid: user.uid })
                                });
                                
                                // Force refresh token to get updated claims
                                await user.getIdToken(true);
                                const updatedTokenResult = await user.getIdTokenResult();
                                role = updatedTokenResult.claims.role as "admin" | "worker" | "client" || null;
                                
                                console.log('Admin role assigned successfully to invited user:', user.email);
                            } else {
                                // No pending admin role, assign default client role
                                await createClientRole(
                                    user.uid, 
                                    user.email, 
                                    user.displayName || user.email.split('@')[0]
                                );
                                
                                // Force refresh token to get updated claims
                                await user.getIdToken(true);
                                const updatedTokenResult = await user.getIdTokenResult();
                                role = updatedTokenResult.claims.role as "admin" | "worker" | "client" || null;
                                
                                console.log('Client role assigned successfully to:', user.email);
                            }
                        } catch (error) {
                            console.error('Error processing new user role assignment:', error);
                            // Continue with null role to prevent blocking
                        }
                    }
                    
                    setUserRole(role);
                    setUserClaims(idTokenResult.claims);

                    // Load user profile
                    await refreshUserProfile();
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            } else {
                setUserRole(null);
                setUserClaims(null);
                setUserProfile(null);
                setAvailableDelegations([]);
                setCurrentImpersonation(null);
            }

            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value: AuthContextType = {
        user,
        userRole,
        userClaims,
        userProfile,
        availableDelegations,
        currentImpersonation,
        loading,
        refreshUserClaims,
        refreshUserProfile,
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
        startImpersonation,
        stopImpersonation,
        canPerformAction,
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