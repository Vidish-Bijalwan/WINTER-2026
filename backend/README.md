# TopoShape Insights - Backend API

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

> FastAPI-based backend service for TopoShape Insights anomaly detection platform.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)

---

## Overview

The TopoShape backend provides a RESTful API for:
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Anomaly Logging**: Store and retrieve anomaly detection results
- **Data Source Management**: Configure and manage data ingestion sources
- **Real-time Processing**: TDA computation and anomaly scoring

---

## Architecture

```mermaid
graph TB
    subgraph "API Layer"
        Main[main.py<br/>FastAPI App]
        Routes[API Routes]
    end
    
    subgraph "Routes"
        AuthR[auth.py<br/>Authentication]
        UserR[users.py<br/>User Management]
        AnomalyR[anomalies.py<br/>Anomaly Logs]
        SourceR[sources.py<br/>Data Sources]
    end
    
    subgraph "Middleware"
        AuthMW[auth_middleware.py<br/>JWT Validation]
        RateMW[rate_limiter.py<br/>Rate Limiting]
    end
    
    subgraph "Core Services"
        TDA[tda.py<br/>TDA Engine]
        Processor[processor.py<br/>Data Processing]
        Security[security.py<br/>Encryption]
    end
    
    subgraph "Database Layer"
        Models[models.py<br/>Data Models]
        Schemas[schemas.py<br/>Pydantic Schemas]
        Connection[connection.py<br/>MongoDB Client]
    end
    
    Main --> Routes
    Routes --> AuthR
    Routes --> UserR
    Routes --> AnomalyR
    Routes --> SourceR
    
    AuthR --> AuthMW
    UserR --> AuthMW
    AnomalyR --> AuthMW
    
    AuthR --> Models
    UserR --> Models
    AnomalyR --> Models
    SourceR --> Models
    
    Models --> Connection
    TDA --> Processor
```

---

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "analyst_john",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "organization": "Research Lab"
}
```

**Response:** `201 Created`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "analyst_john",
  "email": "john@example.com",
  "role": "viewer"
}
```

---

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "analyst_john",
    "email": "john@example.com",
    "role": "viewer"
  }
}
```

---

### User Endpoints

#### GET `/api/users/me`
Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "analyst_john",
  "email": "john@example.com",
  "full_name": "John Doe",
  "organization": "Research Lab",
  "role": "viewer",
  "created_at": "2024-01-15T10:30:00Z",
  "last_login": "2026-01-12T08:14:35Z"
}
```

---

### Anomaly Endpoints

#### GET `/api/anomalies`
Retrieve all anomaly logs with optional filtering.

**Query Parameters:**
- `source_type` (optional): Filter by source type
- `is_anomaly` (optional): Filter by anomaly status
- `start_date` (optional): Filter by start date (ISO 8601)
- `end_date` (optional): Filter by end date (ISO 8601)

**Response:** `200 OK`
```json
[
  {
    "id": "65a1b2c3d4e5f6789abcdef0",
    "timestamp": "2026-01-12T13:42:15Z",
    "source_type": "wikipedia",
    "event_data": {
      "user": "SuspiciousBot123",
      "page": "Important_Article",
      "edit_delta": 5000
    },
    "betti_h0": 245,
    "betti_h1": 18,
    "betti_h2": 3,
    "anomaly_score": 7.8,
    "is_anomaly": true,
    "metadata": {
      "wasserstein_distance": 4.2,
      "landscape_norm": 3.1,
      "confidence": 0.92
    }
  }
]
```

---

#### POST `/api/anomalies`
Create a new anomaly log entry.

**Request Body:**
```json
{
  "source_type": "wikipedia",
  "event_data": {
    "user": "SuspiciousBot123",
    "page": "Important_Article"
  },
  "betti_h0": 245,
  "betti_h1": 18,
  "betti_h2": 3,
  "anomaly_score": 7.8,
  "is_anomaly": true,
  "metadata": {
    "confidence": 0.92
  }
}
```

**Response:** `201 Created`

---

### Data Source Endpoints

#### GET `/api/sources`
List all configured data sources.

**Response:** `200 OK`
```json
[
  {
    "id": "65a1b2c3d4e5f6789abcdef1",
    "name": "Wikipedia Recent Changes",
    "type": "wikipedia",
    "url": "https://stream.wikimedia.org/v2/stream/recentchange",
    "description": "Real-time stream of all edits",
    "active": true
  }
]
```

---

#### POST `/api/sources`
Add a new data source.

**Request Body:**
```json
{
  "name": "Twitter Stream",
  "type": "twitter",
  "url": "https://api.twitter.com/2/tweets/stream",
  "description": "Real-time tweet stream",
  "active": true
}
```

**Response:** `201 Created`

---

#### DELETE `/api/sources/{id}`
Remove a data source.

**Response:** `200 OK`
```json
{
  "status": "deleted"
}
```

---

## Database

The backend uses MongoDB Atlas with the following collections:

- **users**: User accounts and authentication
- **sessions**: Active user sessions (with TTL)
- **anomalies**: Detected anomaly logs
- **data_sources**: Configured data ingestion sources
- **alert_configs**: User notification preferences

For detailed schema information, see [DATABASE_SCHEMA.md](../docs/DATABASE_SCHEMA.md).

---

## Installation

### Prerequisites
- Python 3.10+
- MongoDB Atlas account (or local MongoDB)

### Steps

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

---

## Configuration

Create a `.env` file in the `backend/` directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/
DATABASE_NAME=toposhape_insights

# JWT
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=7

# API
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173,https://your-domain.com

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## Development

### Running the Server

**Development mode with auto-reload:**
```bash
python main.py
```

The API will be available at `http://localhost:8000`

**Interactive API docs:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

### Project Structure

```
backend/
├── api/
│   ├── routes/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── users.py         # User management
│   │   ├── anomalies.py     # Anomaly logging
│   │   └── sources.py       # Data source management
│   └── openapi.py           # OpenAPI schema customization
├── auth/
│   ├── jwt_handler.py       # JWT token generation/validation
│   └── password_utils.py    # Password hashing utilities
├── core/
│   ├── tda.py              # TDA computation engine
│   ├── processor.py        # Data processing pipeline
│   ├── security.py         # Security utilities
│   └── ml.py               # Machine learning models
├── database/
│   ├── connection.py       # MongoDB connection
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   └── indexes.py          # Database indexes
├── middleware/
│   ├── auth_middleware.py  # JWT authentication middleware
│   └── rate_limiter.py     # Rate limiting middleware
├── scripts/
│   ├── seed_admin.py       # Create admin user
│   └── seed_sources.py     # Populate data sources
├── tests/
│   └── ...                 # Unit tests
├── main.py                 # Application entry point
└── requirements.txt        # Python dependencies
```

---

### Running Tests

```bash
pytest tests/
```

**With coverage:**
```bash
pytest --cov=. tests/
```

---

### Database Setup

**Create admin user:**
```bash
python scripts/seed_admin.py
```

**Seed data sources:**
```bash
python scripts/seed_sources.py
```

---

## Technology Stack

- **Framework**: FastAPI 0.100+
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT (python-jose)
- **Password Hashing**: Bcrypt
- **Data Validation**: Pydantic v2
- **Rate Limiting**: SlowAPI
- **CORS**: FastAPI CORS Middleware

---

## API Rate Limits

| Endpoint | Rate Limit |
|----------|------------|
| `/api/auth/login` | 5 requests/minute |
| `/api/auth/register` | 3 requests/minute |
| All other endpoints | 100 requests/minute |

---

## Error Responses

All error responses follow this format:

```json
{
  "detail": "Error message description"
}
```

**Common Status Codes:**
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Security Features

- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Password Hashing**: Bcrypt with salt rounds
- ✅ **Rate Limiting**: Prevent brute-force attacks
- ✅ **CORS Protection**: Configurable origin whitelist
- ✅ **Input Validation**: Pydantic schema validation
- ✅ **Session Management**: TTL-based session expiry

---

## Contributing

Please see the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the MIT License - see [LICENSE](../LICENSE) for details.
