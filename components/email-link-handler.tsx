"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function EmailLinkHandler() {
    const { isEmailLink, signInWithEmailLink } = useAuth();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const handleEmailLink = async () => {
            // Check if the current URL is an email link
            if (isEmailLink(window.location.href)) {
                setIsProcessing(true);

                try {
                    // Get the email from localStorage
                    const email = window.localStorage.getItem('emailForSignIn');

                    if (!email) {
                        toast.error("Email not found. Please try logging in again.");
                        router.push('/login');
                        return;
                    }

                    // Sign in with the email link
                    await signInWithEmailLink(email, window.location.href);

                    toast.success("Successfully signed in!");
                    router.push('/dashboard');
                } catch (error) {
                    console.error('Error signing in with email link:', error);
                    toast.error("Failed to sign in. Please try again.");
                    router.push('/login');
                } finally {
                    setIsProcessing(false);
                }
            }
        };

        handleEmailLink();
    }, [isEmailLink, signInWithEmailLink, router]);

    if (isProcessing) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Signing you in...</p>
                </div>
            </div>
        );
    }

    return null;
} 