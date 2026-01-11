/**
 * Centralized API service for backend communication
 * Handles all HTTP requests, token management, and error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginCredentials {
    username: string; // Can be email or username
    password: string;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    full_name?: string;
    organization?: string;
}

interface AuthResponse {
    access_token: string;
    token_type: string;
    user: {
        id: string;
        username: string;
        email: string;
        full_name?: string;
        organization?: string;
        role: string;
    };
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Make HTTP request with proper error handling
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get token from localStorage
    const token = localStorage.getItem('auth_token');

    // Setup headers
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            if (!response.ok) {
                throw new ApiError('Server error', response.status);
            }
            return {} as T;
        }

        const data = await response.json();

        // Handle error responses
        if (!response.ok) {
            throw new ApiError(
                data.detail || data.message || 'Request failed',
                response.status,
                data
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Network or other errors
        throw new ApiError(
            error instanceof Error ? error.message : 'Network error'
        );
    }
}

/**
 * Authentication API endpoints
 */
export const authApi = {
    /**
     * Login with email or username
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        // FastAPI OAuth2PasswordRequestForm expects form data
        const formData = new URLSearchParams();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new ApiError(
                error.detail || 'Login failed',
                response.status,
                error
            );
        }

        return response.json();
    },

    /**
     * Bypass login for development
     */
    async bypassLogin(): Promise<AuthResponse> {
        return request<AuthResponse>('/api/auth/bypass-login', {
            method: 'POST',
        });
    },

    /**
     * Register new user
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        return request<AuthResponse>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Get current user profile
     */
    async getProfile() {
        return request<any>('/api/auth/me');
    },

    async forgotPassword(email: string) {
        return request<{ message: string; success: boolean; dev_token?: string; dev_reset_url?: string }>('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    async resetPassword(token: string, newPassword: string) {
        return request<{ message: string; success: boolean }>('/api/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, new_password: newPassword }),
        });
    },
};

/**
 * Anomaly detection API endpoints
 */
export const anomalyApi = {
    /**
     * Get anomaly logs
     */
    async getLogs(params?: { start_date?: string; end_date?: string }) {
        const queryString = params
            ? '?' + new URLSearchParams(params as any).toString()
            : '';
        return request(`/api/anomalies/logs${queryString}`);
    },

    /**
     * Get only anomalies
     */
    async getAnomalies() {
        return request('/api/anomalies/anomalies-only');
    },
};

export default {
    authApi,
    anomalyApi,
};
