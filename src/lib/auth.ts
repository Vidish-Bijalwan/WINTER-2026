// Simple JSON-based authentication system
// Stores users in localStorage and manages sessions

interface User {
    id: string;
    username: string;
    password: string; // In production, this should be hashed
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
}

interface Session {
    userId: string;
    username: string;
    role: 'admin' | 'user';
    expiresAt: number;
}

const USERS_KEY = 'tda_users';
const SESSION_KEY = 'tda_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Initialize default users
const DEFAULT_USERS: User[] = [
    {
        id: '1',
        username: 'admin',
        password: 'tda2024', // In production, use bcrypt or similar
        email: 'admin@toposhape.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        username: 'demo',
        password: 'demo123',
        email: 'demo@toposhape.com',
        role: 'user',
        createdAt: new Date().toISOString(),
    },
];

// Initialize users if not exists
function initializeUsers() {
    const existing = localStorage.getItem(USERS_KEY);
    if (!existing) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
}

// Get all users
function getUsers(): User[] {
    initializeUsers();
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : DEFAULT_USERS;
}

// Login function
export function login(username: string, password: string): { success: boolean; error?: string } {
    const users = getUsers();
    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
        return { success: false, error: 'Invalid username or password' };
    }

    const session: Session = {
        userId: user.id,
        username: user.username,
        role: user.role,
        expiresAt: Date.now() + SESSION_DURATION,
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); // For per-tab sessions

    return { success: true };
}

// Logout function
export function logout() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
}

// Check if user is authenticated
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

// Get current session
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

// Add new user (admin only)
export function addUser(user: Omit<User, 'id' | 'createdAt'>): { success: boolean; error?: string } {
    const currentSession = getCurrentSession();

    if (!currentSession || currentSession.role !== 'admin') {
        return { success: false, error: 'Unauthorized. Admin access required.' };
    }

    const users = getUsers();

    // Check if username already exists
    if (users.some((u) => u.username === user.username)) {
        return { success: false, error: 'Username already exists' };
    }

    const newUser: User = {
        ...user,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true };
}

// Get current user info
export function getCurrentUser(): Omit<User, 'password'> | null {
    const session = getCurrentSession();

    if (!session) return null;

    const users = getUsers();
    const user = users.find((u) => u.id === session.userId);

    if (!user) {
        logout();
        return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
