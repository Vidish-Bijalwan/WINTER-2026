/**
 * Authentication system using backend API with JWT tokens
 * Modern authentication with MongoDB Atlas backend
 */

import { authApi, ApiError } from './api';

interface User {
    id: string;
    username: string;
    email: string;
    full_name?: string;
    organization?: string;
    role: 'admin' | 'viewer';
}

interface Session {
    user: User;
    token: string;
    expiresAt: number;
}

const SESSION_KEY = 'tda_session';
const TOKEN_KEY = 'auth_token';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Login with username/email and password
 */
export async function login(
    username: string,
    password: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await authApi.login({ username, password });

        // Store token
        localStorage.setItem(TOKEN_KEY, response.access_token);

        // Create session
        const session: Session = {
            user: {
                ...response.user,
                role: response.user.role as 'admin' | 'viewer',
            },
            token: response.access_token,
            expiresAt: Date.now() + SESSION_DURATION,
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

        return { success: true };
    } catch (error) {
        if (error instanceof ApiError) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'Login failed. Please try again.' };
    }
}

/**
 * Bypass login for development
 */
export async function bypassLogin(): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await authApi.bypassLogin();

        // Store token
        localStorage.setItem(TOKEN_KEY, response.access_token);

        // Create session
        const session: Session = {
            user: {
                ...response.user,
                role: response.user.role as 'admin' | 'viewer',
            },
            token: response.access_token,
            expiresAt: Date.now() + SESSION_DURATION,
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

        return { success: true };
    } catch (error) {
        if (error instanceof ApiError) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'Bypass login failed.' };
    }
}

/**
 * Register new user
 */
export async function register(data: {
    username: string;
    email: string;
    password: string;
    full_name?: string;
    organization?: string;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await authApi.register(data);

        // Store token
        localStorage.setItem(TOKEN_KEY, response.access_token);

        // Create session
        const session: Session = {
            user: {
                ...response.user,
                role: response.user.role as 'admin' | 'viewer',
            },
            token: response.access_token,
            expiresAt: Date.now() + SESSION_DURATION,
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

        return { success: true };
    } catch (error) {
        if (error instanceof ApiError) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'Registration failed. Please try again.' };
    }
}

/**
 * Logout user
 */
export function logout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    const sessionData = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);

    if (!sessionData) return false;

    try {
        const session: Session = JSON.parse(sessionData);

        // Check if session is expired
        if (session.expiresAt < Date.now()) {
            logout();
            return false;
        }

        // Check if token exists
        if (!session.token) {
            logout();
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

/**
 * Get current session
 */
export function getCurrentSession(): Session | null {
    const sessionData = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);

    if (!sessionData) return null;

    try {
        const session: Session = JSON.parse(sessionData);

        // Check if session is expired
        if (session.expiresAt < Date.now()) {
            logout();
            return null;
        }

        return session;
    } catch {
        return null;
    }
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
    const session = getCurrentSession();
    return session ? session.user : null;
}

/**
 * Get auth token
 */
export function getAuthToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    return token;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
    valid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
} {
    const errors: string[] = [];
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    // Calculate strength
    if (errors.length === 0) {
        if (password.length >= 12) {
            strength = 'strong';
        } else {
            strength = 'medium';
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        strength,
    };
}
