"use client"

import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthRedirectProps {
    children: React.ReactNode;
    redirectTo?: string;
    requireAuth?: boolean;
}

export function AuthRedirect({
    children,
    redirectTo = "/dashboard",
    requireAuth = false
}: AuthRedirectProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (requireAuth && !user) {
                // User needs to be authenticated but isn't
                router.push('/login');
            } else if (!requireAuth && user) {
                // User is authenticated but shouldn't be on this page (e.g., login page)
                router.push(redirectTo);
            }
        }
    }, [user, loading, router, requireAuth, redirectTo]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    // If user needs auth but isn't authenticated, don't render children
    if (requireAuth && !user) {
        return null;
    }

    // If user is authenticated but shouldn't be on this page, don't render children
    if (!requireAuth && user) {
        return null;
    }

    return <>{children}</>;
} 