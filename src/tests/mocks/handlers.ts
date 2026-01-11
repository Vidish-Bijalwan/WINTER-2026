import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:8000/api';

export const handlers = [
    // Authentication endpoints
    http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
        const body = await request.json() as any;
        return HttpResponse.json({
            id: 'user_123',
            username: body.username,
            email: body.email,
            role: 'viewer',
            created_at: new Date().toISOString(),
        }, { status: 201 });
    }),

    http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
        const body = await request.json() as any;
        if (body.email === 'test@example.com' && body.password === 'password123') {
            return HttpResponse.json({
                access_token: 'mock_jwt_token',
                token_type: 'bearer',
                user: {
                    id: 'user_123',
                    username: 'testuser',
                    email: 'test@example.com',
                    role: 'viewer',
                },
            });
        }
        return HttpResponse.json(
            { detail: 'Invalid credentials' },
            { status: 401 }
        );
    }),

    http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return HttpResponse.json({
                id: 'user_123',
                username: 'testuser',
                email: 'test@example.com',
                role: 'viewer',
                created_at: '2026-01-01T00:00:00Z',
            });
        }
        return HttpResponse.json(
            { detail: 'Not authenticated' },
            { status: 401 }
        );
    }),

    // Anomaly endpoints
    http.get(`${API_BASE_URL}/anomalies`, ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const source = url.searchParams.get('source');

        const mockAnomalies = Array.from({ length: limit }, (_, i) => ({
            _id: `anomaly_${page}_${i}`,
            timestamp: new Date(Date.now() - i * 3600000).toISOString(),
            source_type: source || 'wikipedia',
            event_data: {
                title: `Event ${i}`,
                user: `user_${i}`,
                change_size: Math.floor(Math.random() * 500),
            },
            betti_h0: Math.floor(Math.random() * 10),
            betti_h1: Math.floor(Math.random() * 5),
            betti_h2: Math.floor(Math.random() * 3),
            anomaly_score: Math.random(),
            is_anomaly: Math.random() > 0.7,
            metadata: {
                cluster_id: `cluster_${i}`,
                detection_latency_ms: Math.floor(Math.random() * 100),
            },
        }));

        return HttpResponse.json({
            total: 150,
            page,
            limit,
            data: mockAnomalies,
        });
    }),

    http.get(`${API_BASE_URL}/anomalies/:id`, ({ params }) => {
        const { id } = params;
        return HttpResponse.json({
            _id: id,
            timestamp: new Date().toISOString(),
            source_type: 'wikipedia',
            event_data: {
                title: 'Test Event',
                user: 'test_user',
                change_size: 250,
            },
            betti_h0: 5,
            betti_h1: 2,
            betti_h2: 0,
            anomaly_score: 0.85,
            is_anomaly: true,
            metadata: {
                cluster_id: 'cluster_123',
                detection_latency_ms: 45,
            },
        });
    }),

    http.post(`${API_BASE_URL}/anomalies`, async ({ request }) => {
        const body = await request.json() as any;
        return HttpResponse.json({
            _id: 'new_anomaly_123',
            ...body,
            timestamp: body.timestamp || new Date().toISOString(),
        }, { status: 201 });
    }),

    http.delete(`${API_BASE_URL}/anomalies/:id`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return HttpResponse.json(
                { detail: 'Not authenticated' },
                { status: 401 }
            );
        }
        return HttpResponse.json({ message: 'Deleted successfully' });
    }),

    http.get(`${API_BASE_URL}/anomalies/stats`, () => {
        return HttpResponse.json({
            total_anomalies: 1250,
            anomalies_today: 45,
            average_score: 0.72,
            by_source: {
                wikipedia: 500,
                twitter: 400,
                github: 350,
            },
            trend_24h: 'increasing',
        });
    }),

    // User endpoints
    http.get(`${API_BASE_URL}/users`, ({ request }) => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return HttpResponse.json(
                { detail: 'Not authenticated' },
                { status: 401 }
            );
        }
        return HttpResponse.json([
            {
                id: 'user_1',
                username: 'admin',
                email: 'admin@example.com',
                role: 'admin',
            },
            {
                id: 'user_2',
                username: 'viewer',
                email: 'viewer@example.com',
                role: 'viewer',
            },
        ]);
    }),

    http.put(`${API_BASE_URL}/users/:id`, async ({ request, params }) => {
        const { id } = params;
        const body = await request.json() as any;
        return HttpResponse.json({
            id,
            ...body,
            updated_at: new Date().toISOString(),
        });
    }),
];
