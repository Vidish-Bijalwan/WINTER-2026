import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    useEffect(() => {
        // Check authentication status
        setIsAuth(isAuthenticated());
    }, []);

    // Show loading state while checking auth
    if (isAuth === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
