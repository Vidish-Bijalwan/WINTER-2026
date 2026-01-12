/**
 * Client-side authentication system using localStorage
 * No backend required - works on GitHub Pages
 */

interface User {
    id: string;
    username: string;
    email: string;
    full_name?: string;
    organization?: string;
    role: 'admin' | 'viewer';
    password: string; // Stored hashed in localStorage
}

interface Session {
    user: Omit<User, 'password'>;
    token: string;
    expiresAt: number;
}

const SESSION_KEY = 'tda_session';
const USERS_KEY = 'tda_users';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Simple hash function (not cryptographically secure, but fine for client-side demo)
function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// Get all users from localStorage
function getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Login with username/email and password
 */
export async function login(
    username: string,
    password: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const users = getUsers();
        const hashedPassword = simpleHash(password);

        // Find user by username or email
        const user = users.find(u =>
            (u.username === username || u.email === username) &&
            u.password === hashedPassword
        );

        if (!user) {
            return { success: false, error: 'Invalid credentials' };
        }

        // Create session
        const session: Session = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                organization: user.organization,
                role: user.role,
            },
            token: simpleHash(user.id + Date.now().toString()),
            expiresAt: Date.now() + SESSION_DURATION,
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Login failed. Please try again.' };
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
        const users = getUsers();

        // Check if email already exists
        if (users.some(u => u.email === data.email)) {
            return { success: false, error: 'Email already registered' };
        }

        // Check if username already exists
        if (users.some(u => u.username === data.username)) {
            return { success: false, error: 'Username already taken' };
        }

        // Create new user
        const newUser: User = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            username: data.username,
            email: data.email,
            full_name: data.full_name,
            organization: data.organization,
            role: 'viewer',
            password: simpleHash(data.password),
        };

        users.push(newUser);
        saveUsers(users);

        // Auto-login after registration
        const session: Session = {
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                full_name: newUser.full_name,
                organization: newUser.organization,
                role: newUser.role,
            },
            token: simpleHash(newUser.id + Date.now().toString()),
            expiresAt: Date.now() + SESSION_DURATION,
        };

        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Registration failed. Please try again.' };
    }
}

/**
 * Logout user
 */
export function logout() {
    localStorage.removeItem(SESSION_KEY);
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
export function getCurrentUser(): Omit<User, 'password'> | null {
    const session = getCurrentSession();
    return session ? session.user : null;
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
