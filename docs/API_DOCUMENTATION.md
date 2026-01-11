# API Documentation

## Overview
TopoShape Insights provides a RESTful API for authentication, data management, and TDA analysis.

**Base URL**: `https://api.toposhape.io` (production) or `http://localhost:8000` (development)

**API Version**: v1

---

## Authentication

All API endpoints except `/auth/*` require JWT authentication.

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "message": "User created successfully",
  "user_id": "60d5ec49f1b2c8b1f8e4e1a1"
}
```

---

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGci0i...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "60d5ec49f1b2c8b1f8e4e1a1",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

---

### Refresh Token
```http
POST /api/auth/refresh
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGci0i...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

---

## TDA Analysis

### Compute Persistence Diagram
```http
POST /api/tda/persistence
Authorization: Bearer {token}
Content-Type: application/json

{
  "events": [
    {
      "user": "User123",
      "title": "Page Edit",
      "timestamp": "2026-01-11T00:00:00Z",
      "delta": 156
    }
  ],
  "window_ms": 60000,
  "dimensions": [0, 1, 2]
}
```

**Response** (200 OK):
```json
{
  "diagram": [
    {
      "id": "feature-1",
      "birth": 0,
      "death": 1.234,
      "dimension": 0
    },
    {
      "id": "feature-2",
      "birth": 0.5,
      "death": 2.5,
      "dimension": 1
    }
  ],
  "betti_numbers": {
    "h0": 5,
    "h1": 2,
    "h2": 0
  },
  "computation_time_ms": 156
}
```

---

### Detect Anomalies
```http
POST /api/tda/detect-anomalies
Authorization: Bearer {token}
Content-Type: application/json

{
  "events": [...],
  "baseline": [...], 
  "edit_rate": 5.2
}
```

**Response** (200 OK):
```json
{
  "anomalies": [
    {
      "timestamp": "2026-01-11T00:05:00Z",
      "total_score": 4.52,
      "wasserstein_score": 3.1,
      "landscape_score": 2.8,
      "statistical_score": 1.2,
      "confidence": 0.85,
      "is_anomaly": true,
      "features": {
        "significant_points": [
          {"id": "f1", "birth": 0, "death": 10, "dimension": 1}
        ]
      }
    }
  ]
}
```

---

## User Management

### Get User Profile
```http
GET /api/users/me
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "id": "60d5ec49f1b2c8b1f8e4e1a1",
  "email": "user@example.com",
  "full_name": "John Doe",
  "created_at": "2026-01-01T00:00:00Z",
  "preferences": {
    "theme": "dark",
    "notifications_enabled": true
  }
}
```

---

### Update User Profile
```http
PUT /api/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "full_name": "Jane Doe",
  "preferences": {
    "theme": "light"
  }
}
```

**Response** (200 OK):
```json
{
  "message": "Profile updated successfully",
  "user": {...}
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Human-readable error description",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `INVALID_REQUEST` | 400 | Malformed request body |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

- **Authenticated users**: 100 requests per minute
- **Anonymous requests**: 20 requests per minute

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641945600
```

---

## Webhook Integration

### Register Webhook
```http
POST /api/webhooks
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://example.com/webhook",
  "events": ["anomaly.detected", "analysis.complete"],
  "secret": "webhook_secret_key"
}
```

**Webhook Payload** (POST to your URL):
```json
{
  "event": "anomaly.detected",
  "timestamp": "2026-01-11T00:05:00Z",
  "data": {
    "anomaly_score": 4.52,
    "confidence": 0.85,
    "details": {...}
  },
  "signature": "sha256=..."
}
```

---

## Client Libraries

### Python
```python
from toposhape import TopoShapeClient

client = TopoShapeClient(api_key="your_api_key")

# Compute persistence
diagram = client.tda.compute_persistence(events, window_ms=60000)

# Detect anomalies
anomalies = client.tda.detect_anomalies(events, baseline)
```

### TypeScript/JavaScript
```typescript
import { TopoShape API } from '@toposhape/sdk';

const client = new TopoShapeAPI({ apiKey: 'your_api_key' });

// Compute persistence
const diagram = await client.tda.computePersistence(events, 60000);

// Detect anomalies
const anomalies = await client.tda.detectAnomalies(events, baseline);
```

---

## OpenAPI Specification

Full OpenAPI 3.0 spec available at:
```
GET /api/openapi.json
```

Interactive documentation:
```
GET /api/docs
```

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-11  
**Contact**: api@toposhape.io
