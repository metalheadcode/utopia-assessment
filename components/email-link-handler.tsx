"use client"

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function EmailLinkHandler() {
    const { isEmailLink, signInWithEmailLink } = useAuth();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const hasTriedProcessing = useRef(false);

    useEffect(() => {
        const handleEmailLink = async () => {
            // Prevent multiple executions
            if (hasTriedProcessing.current || isProcessing) {
                return;
            }

            // Check if the current URL is an email link
            if (isEmailLink(window.location.href)) {
                hasTriedProcessing.current = true;
                setIsProcessing(true);

                try {
                    // Try to get email from multiple sources (best UX first)
                    let email = null;

                    // 1. First try to get email from URL query string (best UX - no user input needed)
                    const urlParams = new URLSearchParams(window.location.search);
                    email = urlParams.get('email');

                    // 2. If not in URL, try localStorage (for manual login flow)
                    if (!email) {
                        email = window.localStorage.getItem('emailForSignIn');
                    }

                    // 3. Last resort: prompt user (worst UX but necessary fallback)
                    if (!email) {
                        email = prompt("Please enter your email address to complete the sign-in:");
                        
                        if (!email) {
                            toast.error("Email is required to complete sign-in.");
                            router.push('/login');
                            return;
                        }

                        // Validate email format
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(email)) {
                            toast.error("Please enter a valid email address.");
                            router.push('/login');
                            return;
                        }
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
    }, [isEmailLink, signInWithEmailLink, router, isProcessing]);

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