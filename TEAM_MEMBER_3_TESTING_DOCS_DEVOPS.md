# Team Member 3: Testing, Documentation & DevOps

## 👤 Your Role
You are responsible for **Testing Infrastructure**, **Technical Documentation**, and **DevOps/Deployment**. Your work ensures code quality, provides comprehensive documentation (including required DFDs and Database Schema diagrams), and streamlines the deployment process.

---

## 🎯 Your Objectives

### Phase 1: Testing Infrastructure (Week 1-2)
- Set up comprehensive testing framework
- Write unit tests for critical components
- Implement integration tests for API endpoints
- Set up continuous integration (CI)

### Phase 2: Technical Documentation (Week 3)
- Create Data Flow Diagrams (DFDs) - **MANDATORY**
- Create Database Schema Diagrams - **MANDATORY**
- Write API documentation
- Create architecture documentation

### Phase 3: DevOps & Deployment (Week 4)
- Set up Docker containerization
- Configure deployment pipelines
- Implement monitoring and logging
- Create deployment guides

---

## 📋 Detailed Tasks

### Task 1: Testing Framework Setup
**What you'll do:**
Set up Vitest for frontend testing and pytest for backend testing

**Files to create:**
- `vitest.config.ts` (may already exist - enhance it)
- `src/tests/setup.ts`
- `backend/tests/conftest.py`
- `backend/tests/pytest.ini`

**Antigravity Prompt:**
```
Set up comprehensive testing infrastructure for TopoForge:

FRONTEND TESTING:

1. Update vitest.config.ts:
   - Configure test environment for React components
   - Set up coverage thresholds (80% minimum)
   - Configure path aliases (@/ for src/)
   - Add test reporters (default, html, json)
   - Set up global test utilities

2. Create src/tests/setup.ts:
   - Import @testing-library/jest-dom for custom matchers
   - Set up global test mocks (window.matchMedia, IntersectionObserver)
   - Configure cleanup after each test
   - Mock WebSocket and SSE for real-time features

3. Create src/tests/utils/test-utils.tsx:
   - Custom render function wrapping components with:
     * Theme provider
     * Router provider
     * React Query provider
   - Mock data generators for consistent test data
   - Helper functions for common test scenarios

BACKEND TESTING:

4. Create backend/tests/conftest.py:
   - pytest fixtures for:
     * Test database connection (in-memory MongoDB)
     * Test client for FastAPI app
     * Sample test data (users, anomaly logs)
     * Authentication tokens for protected endpoints
   - Cleanup fixtures to reset database after each test

5. Create backend/pytest.ini:
   - Configure test discovery patterns
   - Set minimum coverage to 75%
   - Configure test markers (unit, integration, slow)
   - Ignore patterns for coverage

6. Add testing dependencies:
   
   Frontend (package.json):
   - @testing-library/react: "^14.1.2"
   - @testing-library/jest-dom: "^6.1.5"
   - @testing-library/user-event: "^14.5.1"
   - @vitest/ui: "^1.2.0"
   - jsdom: "^23.2.0"
   - vitest: "^1.2.0"
   
   Backend (requirements.txt):
   - pytest==7.4.3
   - pytest-asyncio==0.23.3
   - pytest-cov==4.1.0
   - httpx==0.26.0 (for FastAPI testing)
   - mongomock==4.1.2 (for testing without real DB)

Include npm scripts in package.json:
- "test": "vitest"
- "test:ui": "vitest --ui"
- "test:coverage": "vitest --coverage"

Include pytest commands in backend/Makefile or document in README.
```

---

### Task 2: Unit Tests for Frontend Components
**What you'll do:**
Write comprehensive unit tests for React components

**Files to create:**
- `src/tests/components/NetworkGraph3D.test.tsx`
- `src/tests/components/AnomalyFeed.test.tsx`
- `src/tests/components/DashboardLayout.test.tsx`
- `src/tests/hooks/useNetworkInteraction.test.ts`

**Antigravity Prompt:**
```
Write unit tests for TopoForge frontend components:

1. Create src/tests/components/NetworkGraph3D.test.tsx:
   - Test rendering with mock data
   - Test zoom controls (zoom in, zoom out, reset)
   - Test node selection (click should show details)
   - Test filter functionality
   - Test export functionality (mock html2canvas)
   - Test camera position changes
   - Use @testing-library/react and user-event

2. Create src/tests/components/AnomalyFeed.test.tsx:
   - Test rendering empty state
   - Test rendering with anomaly data
   - Test filtering by severity
   - Test filtering by source
   - Test pagination (load more)
   - Test item expansion on click
   - Test auto-scroll behavior
   - Mock API calls with MSW (Mock Service Worker)

3. Create src/tests/components/DashboardLayout.test.tsx:
   - Test responsive layout (desktop vs mobile)
   - Test panel rearrangement (drag and drop)
   - Test layout persistence to localStorage
   - Test all panels render correctly

4. Create src/tests/hooks/useNetworkInteraction.test.ts:
   - Test camera state management
   - Test node selection state
   - Test search functionality
   - Test filter application
   - Use @testing-library/react-hooks or renderHook

5. Create src/tests/utils/persistenceCalculations.test.ts:
   - Test calculatePersistence with known inputs
   - Test filterByThreshold edge cases
   - Test sortByPersistence ordering
   - Test getBettiNumbers calculation

For each test file:
- Use describe blocks to group related tests
- Use test.each for repetitive tests with different data
- Mock external dependencies (API calls, localStorage)
- Aim for >80% code coverage
- Include edge cases and error scenarios

Add MSW for API mocking:
- Create src/tests/mocks/handlers.ts with API route handlers
- Create src/tests/mocks/server.ts to set up mock server

Dependencies to add:
- msw: "^2.0.0"
```

---

### Task 3: Integration Tests for Backend APIs
**What you'll do:**
Write integration tests for all API endpoints

**Files to create:**
- `backend/tests/test_api_anomalies.py`
- `backend/tests/test_api_auth.py`
- `backend/tests/test_api_users.py`
- `backend/tests/test_database_models.py`

**Antigravity Prompt:**
```
Write integration tests for TopoForge backend APIs:

1. Create backend/tests/test_api_anomalies.py:
   Test POST /api/anomalies:
   - Test creating valid anomaly log
   - Test validation errors (missing fields, invalid types)
   - Test authentication required
   
   Test GET /api/anomalies:
   - Test pagination parameters
   - Test filtering by date range
   - Test filtering by source
   - Test empty results
   
   Test GET /api/anomalies/{id}:
   - Test retrieving existing anomaly
   - Test 404 for non-existent ID
   
   Test GET /api/anomalies/stats:
   - Test statistics calculation
   - Test with various time ranges
   
   Test DELETE /api/anomalies/{id}:
   - Test successful deletion (admin only)
   - Test 403 for non-admin user

2. Create backend/tests/test_api_auth.py:
   Test POST /api/auth/register:
   - Test successful registration
   - Test duplicate email/username validation
   - Test password strength requirements
   
   Test POST /api/auth/login:
   - Test successful login (returns JWT)
   - Test invalid credentials
   - Test account lockout after X failed attempts
   
   Test GET /api/auth/me:
   - Test with valid token
   - Test with expired token
   - Test without token (401)
   
   Test POST /api/auth/refresh:
   - Test token refresh flow

3. Create backend/tests/test_api_users.py:
   Test GET /api/users:
   - Test admin can retrieve all users
   - Test non-admin gets 403
   
   Test PUT /api/users/{id}:
   - Test user can update own profile
   - Test user cannot update other profiles
   - Test validation on update

4. Create backend/tests/test_database_models.py:
   Test AnomalyLogModel:
   - Test create_log() with valid data
   - Test get_logs_by_timeframe()
   - Test get_anomalies_only() filtering
   
   Test UserModel:
   - Test create_user() with password hashing
   - Test authenticate() with correct/incorrect passwords
   - Test update_profile()

5. Create backend/tests/fixtures.py:
   - sample_user_data() - Dict with user information
   - sample_anomaly_data() - Dict with anomaly log
   - authenticated_client() - Test client with JWT token
   - admin_client() - Test client with admin token

For all tests:
- Use pytest fixtures from conftest.py
- Use async test functions (pytest-asyncio)
- Mock MongoDB with mongomock
- Test both success and failure scenarios
- Assert correct HTTP status codes
- Assert response body structure and content
- Clean up test data after each test

Aim for >75% coverage of backend code.
```

---

### Task 4: Data Flow Diagrams (DFDs) - MANDATORY
**What you'll do:**
Create comprehensive Data Flow Diagrams showing how data moves through the system

**Files to create:**
- `docs/architecture/DFD_LEVEL_0.md` (Context Diagram)
- `docs/architecture/DFD_LEVEL_1.md` (System Overview)
- `docs/architecture/DFD_LEVEL_2.md` (Detailed Processes)

**Antigravity Prompt:**
```
Create comprehensive Data Flow Diagrams (DFDs) for TopoForge anomaly detection platform:

1. Create docs/architecture/DFD_LEVEL_0.md (Context Diagram):
   - Show TopoForge as single process
   - External entities:
     * Data Sources (Wikipedia, Twitter, GitHub)
     * End Users (Analysts, Administrators)
     * MongoDB Atlas (Data Store)
   - Data flows:
     * Event streams INTO TopoForge
     * Anomaly alerts OUT to Users
     * Data storage TO/FROM MongoDB
   
   Use Mermaid flowchart syntax:
   ```mermaid
   graph TB
     DataSources[Data Sources<br/>Wikipedia, Twitter, GitHub]
     Users[End Users<br/>Analysts, Admins]
     MongoDB[(MongoDB Atlas)]
     TopoForge[TopoForge<br/>Anomaly Detection System]
     
     DataSources -->|Event Streams| TopoForge
     TopoForge -->|Anomaly Alerts| Users
     TopoForge <-->|Read/Write Data| MongoDB
     Users -->|Configure, Query| TopoForge
   &#96;&#96;&#96;
   
   Include legend explaining symbols (circles=external entities, rectangles=processes, cylinders=data stores)

2. Create docs/architecture/DFD_LEVEL_1.md (System Overview):
   - Break TopoForge into major subsystems:
     * Data Ingestion
     * TDA Processing
     * Anomaly Detection
     * Storage Layer
     * API Layer
     * Frontend UI
   
   - Show data flows between subsystems:
     * Raw events → Data Ingestion → Normalized events
     * Normalized events → TDA Processing → Topological features
     * Topological features → Anomaly Detection → Anomaly flags
     * Anomaly flags → Storage Layer → MongoDB
     * MongoDB → API Layer → Frontend UI
     * User actions → API Layer → Database updates
   
   Use detailed Mermaid diagram with all processes and data flows labeled
   
   Include data flow descriptions table:
   | Flow ID | From | To | Data Description |
   |---------|------|-----|------------------|
   | DF-1 | Data Sources | Data Ingestion | Raw event streams (JSON) |
   | DF-2 | Data Ingestion | TDA Processing | Normalized event objects |
   | ... | ... | ... | ... |

3. Create docs/architecture/DFD_LEVEL_2.md (Detailed Processes):
   - Expand each Level 1 process into sub-processes
   
   For Data Ingestion:
   - SSE Connection
   - Event Parsing
   - Validation
   - Buffering
   
   For TDA Processing:
   - Point Cloud Generation
   - Simplicial Complex Construction
   - Homology Computation
   - Persistence Calculation
   
   For Anomaly Detection:
   - Baseline Modeling
   - Anomaly Scoring
   - Threshold Checking
   - Alert Generation
   
   For API Layer:
   - Authentication Middleware
   - Request Routing
   - Business Logic
   - Response Formatting
   
   Show detailed data flows with data structure specifications

4. Add to each DFD document:
   - Document metadata (version, date, author)
   - Revision history table
   - Process descriptions (what each process does)
   - Data dictionary (define each data element)
   - Assumptions and constraints

Follow standard DFD notation:
- Circles/Ellipses for processes
- Rectangles for external entities
- Cylinders for data stores
- Arrows for data flows
- Number processes (1.0, 2.0, etc.)

Make diagrams visually clear and professionally formatted.
```

---

### Task 5: Database Schema Diagrams - MANDATORY
**What you'll do:**
Create visual database schema diagrams showing all collections, fields, and relationships

**Files to create/update:**
- `docs/database/DATABASE_SCHEMA.md` (comprehensive schema documentation)

**Antigravity Prompt:**
```
Create comprehensive Database Schema documentation for TopoForge MongoDB:

1. Update/Create docs/database/DATABASE_SCHEMA.md with:

## Entity-Relationship Diagram

Use Mermaid ER diagram syntax:

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ ALERT_CONFIGS : configures
    USERS {
        ObjectId _id PK
        string username UK
        string email UK
        string hashed_password
        string role
        datetime created_at
        datetime last_login
    }
    
    ANOMALY_LOGS {
        ObjectId _id PK
        datetime timestamp
        string source_type
        object event_data
        float betti_h0
        float betti_h1
        float betti_h2
        float anomaly_score
        boolean is_anomaly
        object metadata
    }
    
    SESSIONS {
        ObjectId _id PK
        ObjectId user_id FK
        string token
        datetime expires_at
        datetime created_at
    }
    
    ALERT_CONFIGS ||--|{ USERS : belongs_to
    ALERT_CONFIGS {
        ObjectId _id PK
        ObjectId user_id FK
        float threshold
        array notification_channels
        boolean is_active
        datetime created_at
    }
&#96;&#96;&#96;

## Collection Details

### Users Collection
- **Purpose**: Store user accounts and authentication information
- **Indexes**:
  - email (unique)
  - username (unique)
  - created_at (descending)
- **Example Document**:
  ```json
  {
    "_id": ObjectId("..."),
    "username": "analyst_01",
    "email": "analyst@example.com",
    "hashed_password": "$2b$12$...",
    "role": "viewer",
    "created_at": ISODate("2026-01-08T00:00:00Z"),
    "last_login": ISODate("2026-01-08T11:30:00Z")
  }
  ```

### Anomaly_Logs Collection
- **Purpose**: Store detected anomalies and topological analysis results
- **Indexes**:
  - (timestamp, source_type) - compound index
  - is_anomaly
  - anomaly_score (descending)
- **Retention**: 90 days (automatic deletion)
- **Example Document**:
  ```json
  {
    "_id": ObjectId("..."),
    "timestamp": ISODate("2026-01-08T11:30:45Z"),
    "source_type": "wikipedia",
    "event_data": {
      "title": "Page Title",
      "user": "editor_name",
      "change_size": 150
    },
    "betti_h0": 5,
    "betti_h1": 2,
    "betti_h2": 0,
    "anomaly_score": 0.85,
    "is_anomaly": true,
    "metadata": {
      "cluster_id": "cluster_123",
      "detection_latency_ms": 45
    }
  }
  ```

### Sessions Collection
- **Purpose**: Maintain active user sessions for authentication
- **Indexes**:
  - user_id
  - token (unique)
  - expires_at (TTL index - auto-delete expired sessions)
- **Retention**: Automatic deletion when expires_at reached
- **Example Document**:
  ```json
  {
    "_id": ObjectId("..."),
    "user_id": ObjectId("..."),
    "token": "eyJhbGc...",
    "expires_at": ISODate("2026-01-15T11:30:00Z"),
    "created_at": ISODate("2026-01-08T11:30:00Z")
  }
  ```

### Alert_Configs Collection  
- **Purpose**: Store user alert preferences and thresholds
- **Indexes**:
  - user_id
  - is_active
- **Example Document**:
  ```json
  {
    "_id": ObjectId("..."),
    "user_id": ObjectId("..."),
    "threshold": 0.75,
    "notification_channels": ["email", "desktop"],
    "is_active": true,
    "created_at": ISODate("2026-01-08T11:30:00Z")
  }
  ```

## Relationships

| From Collection | To Collection | Relationship Type | Foreign Key |
|----------------|---------------|-------------------|-------------|
| Sessions | Users | Many-to-One | user_id |
| Alert_Configs | Users | Many-to-One | user_id |

## Field Types Reference

| MongoDB Type | Python Type | TypeScript Type | Description |
|--------------|-------------|-----------------|-------------|
| ObjectId | ObjectId | string | Unique identifier |
| string | str | string | Text data |
| int | int | number | Integer numbers |
| float | float | number | Decimal numbers |
| boolean | bool | boolean | True/False |
| datetime | datetime | Date | Timestamps |
| array | list | Array | Lists of values |
| object | dict | Record | Nested documents |

## Data Validation Rules

Document Mongoose-style validation for each collection:

Users:
- email: required, unique, regex pattern for valid email
- username: required, unique, min 3 chars, max 30 chars
- password: min 8 chars, requires uppercase, lowercase, number
- role: enum ['admin', 'viewer']

Anomaly_Logs:
- timestamp: required, indexed
- source_type: required, enum ['wikipedia', 'twitter', 'github']
- betti_h0: required, >= 0
- betti_h1: required, >= 0
- betti_h2: required, >= 0
- anomaly_score: required, 0.0 to 1.0
- is_anomaly: required, boolean

## Migration Scripts

Include section on database migrations:
- How to create initial collections
- How to seed with sample data
- How to upgrade schema versions

## Backup & Recovery

Document backup strategy:
- MongoDB Atlas automatic daily backups
- Retention period: 7 days
- Point-in-time recovery available
- Manual backup command: mongodump

Make all diagrams clear, professional, and accurately represent the actual implementation.
```

---

### Task 6: API Documentation
**What you'll do:**
Create comprehensive API documentation for all endpoints

**Files to create:**
- `docs/api/API_REFERENCE.md`
- `docs/api/AUTHENTICATION.md`
- `docs/api/EXAMPLES.md`

**Antigravity Prompt:**
```
Create comprehensive API documentation for TopoForge backend:

1. Create docs/api/API_REFERENCE.md:

Use OpenAPI/Swagger-style documentation format.

## Base URL
- Development: `http://localhost:8000`
- Production: `https://api.topoforge.com` (placeholder)

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string (3-30 chars)",
  "email": "string (valid email)",
  "password": "string (min 8 chars)"
}
```

**Response:** 201 Created
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "viewer",
  "created_at": "ISO datetime"
}
```

**Error Responses:**
- 400: Validation error (duplicate email/username, weak password)
- 500: Server error

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"analyst","email":"test@example.com","password":"SecurePass123"}'
```

---

[Repeat for all endpoints: /api/auth/login, /api/auth/logout, /api/auth/me, /api/anomalies, etc.]

For each endpoint document:
- HTTP method and path
- Description
- Authentication required (yes/no)
- Request parameters (path, query, body)
- Request body schema (JSON)
- Response codes and bodies
- Error responses
- cURL example
- Rate limits (if applicable)

2. Create docs/api/AUTHENTICATION.md:

## Authentication Flow

1. User registers: POST /api/auth/register
2. User logs in: POST /api/auth/login → receives JWT token
3. Include token in subsequent requests
4. Token expires after 24 hours
5. Refresh token: POST /api/auth/refresh

## JWT Token Structure
```json
{
  "user_id": "ObjectId",
  "username": "string",
  "role": "admin|viewer",
  "exp": timestamp,
  "iat": timestamp
}
```

## Role-Based Access Control

| Endpoint | Viewer | Admin |
|----------|--------|-------|
| GET /api/anomalies | ✓ | ✓ |
| POST /api/anomalies | ✗ | ✓ |
| DELETE /api/anomalies/{id} | ✗ | ✓ |
| GET /api/users | ✗ | ✓ |
| PUT /api/users/{id} | Own profile only | ✓ |

## Security Best Practices
- Store JWT in httpOnly cookies (not localStorage)
- Use HTTPS in production
- Rotate secrets regularly
- Implement rate limiting
- Validate all inputs

3. Create docs/api/EXAMPLES.md:

Common usage examples with cURL, Python, and JavaScript.

Example: Fetching anomalies with filtering
Example: Creating a new user
Example: Updating alert preferences
Example: Exporting data to CSV
Example: WebSocket connection for real-time updates

Include full working code snippets for each.

Format documentation professionally with clear headers, code blocks, and tables.
```

---

### Task 7: CI/CD Pipeline Setup
**What you'll do:**
Configure GitHub Actions for continuous integration and deployment

**Files to create:**
- `.github/workflows/frontend-ci.yml`
- `.github/workflows/backend-ci.yml`
- `.github/workflows/deploy.yml`

**Antigravity Prompt:**
```
Set up CI/CD pipelines using GitHub Actions for TopoForge:

1. Create .github/workflows/frontend-ci.yml:
   
Name: Frontend CI

Triggers:
- Push to main branch
- Pull requests to main
- Paths: src/, package.json

Jobs:
- Setup (Node 20)
- Install dependencies
- Lint (ESLint)
- Type check (TypeScript)
- Run tests (Vitest)
- Generate coverage report
- Upload coverage to Codecov (optional)
- Build production bundle
- Upload build artifacts

Include caching for node_modules to speed up builds.

Set required checks for PRs (must pass before merge):
- All tests passed
- Coverage >= 80%
- No TypeScript errors
- No ESLint errors

2. Create .github/workflows/backend-ci.yml:

Name: Backend CI

Triggers:
- Push to main branch
- Pull requests to main
- Paths: backend/, requirements.txt

Jobs:
- Setup (Python 3.10)
- Install dependencies (pip install -r requirements.txt)
- Lint (flake8, black --check)
- Type check (mypy)
- Run tests (pytest)
- Generate coverage report (pytest-cov)
- Upload coverage artifact

Include caching for pip dependencies.

Required checks:
- All tests passed
- Coverage >= 75%
- No lint errors

3. Create .github/workflows/deploy.yml:

Name: Deploy to Production

Triggers:
- Manual workflow dispatch
- Push to main branch with tag (v*)

Jobs:
- Build Docker images (frontend, backend)
- Push to Docker Hub / GitHub Container Registry
- Deploy to cloud (Vercel, Railway, or AWS)

Include environment variables from GitHub Secrets:
- MONGODB_URI
- JWT_SECRET
- DOCKER_USERNAME
- DOCKER_PASSWORD

Gate deployment on:
- All CI checks passed
- Manual approval (for production)

4. Create .github/workflows/dependency-update.yml:

Name: Dependency Updates

Triggers:
- Schedule (weekly on Monday)

Jobs:
- Check for outdated npm packages
- Check for outdated pip packages
- Create PR with updates (if any)
- Run CI on update PR

5. Add status badges to README.md:

```markdown
![Frontend CI](https://github.com/Vidish-Bijalwan/WINTER-2026/workflows/Frontend%20CI/badge.svg)
![Backend CI](https://github.com/Vidish-Bijalwan/WINTER-2026/workflows/Backend%20CI/badge.svg)
![Coverage](https://codecov.io/gh/Vidish-Bijalwan/WINTER-2026/branch/main/graph/badge.svg)
```

Include comprehensive logging and error reporting in all workflows.
Use matrix strategy to test multiple Node/Python versions if needed.
```

---

### Task 8: Docker Containerization
**What you'll do:**
Create Docker configurations for easy deployment

**Files to create/update:**
- `Dockerfile` (update if exists)
- `docker-compose.yml` (update if exists)
- `backend/Dockerfile`
- `.dockerignore`
- `docs/DEPLOYMENT.md`

**Antigravity Prompt:**
```
Create Docker containerization for TopoForge:

1. Create backend/Dockerfile:
   - Base image: python:3.10-slim
   - Set working directory to /app
   - Copy requirements.txt and install dependencies
   - Copy backend source code
   - Expose port 8000
   - CMD to run FastAPI with uvicorn
   - Use multi-stage build to reduce image size
   - Non-root user for security

2. Update root Dockerfile (for frontend):
   - Base image: node:20-alpine
   - Set working directory to /app
   - Copy package*.json and install dependencies
   - Copy source code
   - Build production bundle
   - Use nginx:alpine for serving
   - Copy built files to nginx html directory
   - Expose port 80
   - Multi-stage build (build stage + serve stage)

3. Update docker-compose.yml:
   
Include services:
- frontend (build from root Dockerfile)
- backend (build from backend/Dockerfile)
- mongodb (official mongo:7 image)

Configuration:
- Networks: frontend, backend, database
- Volumes: mongodb data persistence
- Environment variables from .env file
- Port mappings:
  * Frontend: 5173:80
  * Backend: 8000:8000
  * MongoDB: 27017:27017 (internal only)
- Healthchecks for all services
- Restart policies: unless-stopped
- Resource limits (memory, CPU)

4. Update .dockerignore:
   - node_modules/
   - backend/venv/
   - **/.git/
   - **/__pycache__/
   - **/*.pyc
   - .env
   - .env.local
   - dist/
   - coverage/
   - *.log

5. Create docs/DEPLOYMENT.md:

## Local Development with Docker

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Production Deployment

### Prerequisites
- Docker Engine 20+
- Docker Compose 2+
- 2GB RAM minimum
- MongoDB Atlas account (for production database)

### Environment Variables

Create `.env` file:
```
## Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/topoforge
DATABASE_NAME=topoforge_prod

# Authentication
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRY_HOURS=24

# API Configuration
API_BASE_URL=https://api.topoforge.com
CORS_ORIGINS=https://topoforge.com

# Frontend
VITE_API_URL=https://api.topoforge.com
```

### Deployment Platforms

#### Vercel (Frontend)
1. Connect GitHub repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables in dashboard

#### Railway (Backend)
1. New project from GitHub
2. Add MongoDB Atlas connection string
3. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Auto-deploys on push to main

#### AWS / DigitalOcean (Docker)
1. Provision Ubuntu 22.04 server
2. Install Docker and Docker Compose
3. Clone repository
4. Set environment variables
5. Run `docker-compose -f docker-compose.prod.yml up -d`

### Monitoring
- Set up logging (Logstash, CloudWatch)
- Configure alerts (error rates, response times)
- Monitor resource usage

### Backup Strategy
- Automated MongoDB backups (Atlas)
- Daily snapshots of application data
- Disaster recovery plan

Format as comprehensive deployment guide with troubleshooting section.
```

---

### Task 9: Performance Monitoring & Logging
**What you'll do:**
Set up monitoring, logging, and performance tracking

**Files to create:**
- `backend/middleware/logging_middleware.py`
- `backend/utils/logger.py`
- `src/utils/performance.ts`
- `docs/MONITORING.md`

**Antigravity Prompt:**
```
Implement monitoring and logging for TopoForge:

1. Create backend/utils/logger.py:
   - Configure Python logging with:
     * JSON formatting for structured logs
     * Log rotation (10MB per file, keep 5 backups)
     * Different log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
     * Console handler (dev) and file handler (prod)
     * Include timestamp, level, module, function, line number
   - Create logger factory function: get_logger(name)

2. Create backend/middleware/logging_middleware.py:
   - FastAPI middleware to log all requests:
     * Request method, path, query params
     * Request duration (ms)
     * Response status code
     * Client IP address
     * User ID (if authenticated)
   - Log slow requests (>1000ms) as WARNING
   - Log errors (5xx) as ERROR
   - Don't log sensitive data (passwords, tokens)

3. Create backend/utils/metrics.py:
   - Track application metrics:
     * Request count by endpoint
     * Average response time
     * Error rate
     * Active connections
     * Database query count
   - Export metrics in Prometheus format
   - Endpoint: GET /metrics

4. Create src/utils/performance.ts:
   - Frontend performance monitoring:
     * Track page load time using Performance API
     * Track component render time
     * Track API call durations
     * Track JavaScript errors
   - Send metrics to backend periodically
   - Use Web Vitals:
     * LCP (Largest Contentful Paint)
     * FID (First Input Delay)
     * CLS (Cumulative Layout Shift)

5. Create src/utils/errorReporting.ts:
   - Global error boundary
   - Catch and log JavaScript errors
   - Send error reports to backend
   - Include:
     * Error message and stack trace
     * User agent
     * URL and route
     * User ID (if logged in)
     * Timestamp
   - Don't send errors in development

6. Create docs/MONITORING.md:

## Logging

### Log Levels
- DEBUG: Detailed diagnostic information
- INFO: General informational messages
- WARNING: Warning messages for unusual events
- ERROR: Error messages for failures
- CRITICAL: Critical issues requiring immediate attention

### Log Locations
- Development: Console
- Production: `/var/log/topoforge/app.log`

### Log Format (JSON)
```json
{
  "timestamp": "2026-01-08T11:30:45.123Z",
  "level": "INFO",
  "module": "api.routes.anomalies",
  "function": "get_anomalies",
  "line": 45,
  "message": "Fetched 150 anomaly logs",
  "request_id": "abc123",
  "user_id": "user_456"
}
```

## Metrics

### Backend Metrics (Prometheus)
- `http_requests_total` - Counter of HTTP requests
- `http_request_duration_seconds` - Histogram of request durations
- `http_requests_in_progress` - Gauge of concurrent requests
- `database_queries_total` - Counter of database queries
- `anomalies_detected_total` - Counter of anomalies detected

Access at: `http://localhost:8000/metrics`

### Frontend Metrics
- Page load time
- API response times
- JavaScript error rate
- Core Web Vitals scores

Sent to: POST /api/metrics/frontend

## Error Tracking

### Error Types
1. **5xx Server Errors** - Logged as ERROR
2. **4xx Client Errors** - Logged as WARNING
3. **Database Errors** - Logged as CRITICAL
4. **External API Failures** - Logged as WARNING

### Error Notifications
- Critical errors: Instant email/Slack notification
- High error rate: Alert when >5% in 5 minutes

## Dashboards

Recommended tools:
- Grafana for visualizing Prometheus metrics
- ELK Stack (Elasticsearch, Logstash, Kibana) for log analysis
- Sentry for error tracking

## Alerting Rules
- Response time >2s for 5min → Warning
- Error rate >5% for 5min → Critical
- Database connection lost → Critical
- Disk usage >90% → Warning

Include setup instructions for each monitoring tool.

Dependencies to add:
Backend:
- prometheus-fastapi-instrumentator: "^6.1.0"

Frontend:
- web-vitals: "^3.5.1"
```

---

## 🔁 Git Workflow (Step-by-Step)

### First Time Setup

```bash
# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Clone repository
git clone https://github.com/Vidish-Bijalwan/WINTER-2026.git
cd WINTER-2026
```

---

### For Each Task

**Step 1: Create Feature Branch**
```bash
git checkout main
git pull origin main

git checkout -b testing/unit-tests-frontend
# Or: testing/integration-tests
# Or: docs/database-schema
# Or: devops/docker-setup
```

**Step 2: Make Changes with Antigravity**
- Open Antigravity IDE
- Use the prompts provided
- Review generated code

**Step 3: Test Your Changes**
```bash
# For tests
npm run test              # Frontend tests
cd backend && pytest      # Backend tests

# For documentation
# Just review the markdown files in VS Code

# For CI/CD
# Push to a test branch and verify workflows run
```

**Step 4: Commit Changes**
```bash
git status
git add .

git commit -m "test: Add unit tests for frontend components

- Created tests for NetworkGraph3D component
- Added tests for AnomalyFeed with MSW mocking
- Set up test utilities and custom render
- Achieved 85% code coverage
- All tests passing"
```

**Step 5: Push and Create PR**
```bash
git push origin testing/unit-tests-frontend
```

Visit GitHub and create PR with:
- Clear title
- Description of what was tested
- Coverage report (if applicable)
- Screenshots of diagrams (if documentation)

---

## 📝 Checklist Before PR

For Testing:
- [ ] All tests pass (`npm test`, `pytest`)
- [ ] Coverage meets minimum thresholds (80% frontend, 75% backend)
- [ ] No skipped tests without explanation
- [ ] Tests cover edge cases and error scenarios
- [ ] Mock data is realistic

For Documentation:
- [ ] All diagrams render correctly in markdown preview
- [ ] No broken links
- [ ] Code examples are tested and work
- [ ] Grammar and spelling checked
- [ ] Follows project documentation style

For DevOps:
- [ ] Docker images build successfully
- [ ] Services start without errors
- [ ] CI workflows run and pass
- [ ] No secrets committed
- [ ] Environment variables documented

---

## 🎓 Learning Resources

### Testing
- **Vitest Docs**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/docs/react-testing-library/intro
- **Pytest Docs**: https://docs.pytest.org/

### Documentation
- **Mermaid Diagrams**: https://mermaid.js.org/
- **DFD Tutorial**: https://www.visual-paradigm.com/guide/data-flow-diagram/
- **Technical Writing**: https://developers.google.com/tech-writing

### DevOps
- **Docker Tutorial**: https://docker-curriculum.com/
- **GitHub Actions**: https://docs.github.com/en/actions
- **CI/CD Best Practices**: https://www.atlassian.com/continuous-delivery/principles

---

## 🆘 Common Issues & Solutions

### Issue 1: Tests failing due to missing mocks
**Solution:**
```tsx
// Mock window.matchMedia
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});
```

### Issue 2: Docker build fails  
**Solution:**
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Issue 3: GitHub Actions workflow not triggering
**Solution:**
- Check `.github/workflows/` path is correct
- Verify YAML syntax (use online validator)
- Check branch triggers match your branch name
- Look at Actions tab in GitHub for error messages

### Issue 4: Coverage threshold not met
**Solution:**
- Identify uncovered lines: `npm run test:coverage`
- Write tests specifically for uncovered code
- Focus on high-impact functions first
- Use coverage report to guide testing

---

## 📊 Success Metrics

Your work is successful when:
- ✅ Test coverage: Frontend ≥80%, Backend ≥75%
- ✅ All CI checks pass on every PR
- ✅ DFD diagrams at all 3 levels completed
- ✅ Database schema diagram with all collections
- ✅ Complete API documentation with examples
- ✅ Docker Compose brings up all services without errors
- ✅ CI/CD pipelines running automatically
- ✅ Monitoring and logging implemented
- ✅ At least 30+ commits with your name
- ✅ 8-12 merged pull requests

---

## ✅ Final Deliverables Checklist

By the end of your work, you should have:

- [ ] Vitest configured with 80%+ frontend coverage
- [ ] Pytest configured with 75%+ backend coverage
- [ ] Unit tests for 5+ major components
- [ ] Integration tests for all API endpoints
- [ ] DFD Level 0 (Context Diagram)
- [ ] DFD Level 1 (System Overview)
- [ ] DFD Level 2 (Detailed Processes)
- [ ] Database Schema with ER diagram
- [ ] API Reference documentation
- [ ] Authentication flow documentation
- [ ] Deployment guide with Docker
- [ ] CI/CD pipelines in GitHub Actions
- [ ] Docker Compose configuration
- [ ] Logging and monitoring setup
- [ ] Performance tracking implemented
- [ ] All documentation in docs/ directory
- [ ] Status badges in README

---

## 🕒 Estimated Timeline

| Week | Tasks | Deliverables |
|------|-------|--------------|
| **Week 1** | Tasks 1-3 | Testing framework, unit/integration tests |
| **Week 2** | Tasks 4-6 | DFDs, database schema, API docs |
| **Week 3** | Tasks 7-8 | CI/CD pipelines, Docker setup |
| **Week 4** | Task 9 | Monitoring, final polish, documentation review |

---

**Good luck! Quality matters! 📊**

You are the guardian of code quality. Your tests catch bugs before users see them. Your documentation helps developers understand the system. Your DevOps work makes deployment smooth. Take pride in every test case, every diagram, every pipeline!
