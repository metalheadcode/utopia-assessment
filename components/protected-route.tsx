"use client"

import { AuthRedirect } from "./auth-redirect";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    return (
        <AuthRedirect requireAuth={true}>
            {children}
        </AuthRedirect>
    );
} 