# TopoForge Backend - Developer Documentation

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

Complete backend documentation for the **TopoForge Intelligence Engine** - a real-time anomaly detection platform using Topological Data Analysis (TDA).

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Core Components](#core-components)
- [API Documentation](#api-documentation)
- [Database](#database)
- [Development Guide](#development-guide)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

The TopoForge backend is a **FastAPI-based microservice** that provides:

✅ **Real-time Anomaly Detection** using TDA and Machine Learning  
✅ **RESTful API** for frontend integration  
✅ **WebSocket Support** for real-time data streaming  
✅ **MongoDB Integration** for persistent storage  
✅ **JWT Authentication** with role-based access control  
✅ **Topological Data Analysis** with Betti number computation

### What Makes This Backend Unique?

Unlike traditional anomaly detection systems that rely on statistical thresholds, TopoForge analyzes the **topological shape** of data streams to detect subtle, coordinated attacks that would otherwise go unnoticed.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FastAPI Application                   │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Auth API  │  │ Anomalies    │  │  Users API    │  │
│  │   /auth/*   │  │    API       │  │  /users/*     │  │
│  │             │  │ /anomalies/* │  │               │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌────────────────┐  ┌──────────────┐
│ TDA Engine   │  │  ML Detector   │  │  Security    │
│ (ripser)     │  │ (IsolationFor) │  │  Classifier  │
│              │  │                │  │  (MITRE)     │
│ Betti #s     │  │ Anomaly Score  │  │ Threat Maps  │
└──────────────┘  └────────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                   ┌──────────────┐
                   │   MongoDB    │
                   │   Database   │
                   └──────────────┘
```

---

## Project Structure

```
backend/
├── main.py                      # FastAPI application entry point
├── requirements.txt             # Python dependencies
├── .env                         # Environment configuration (gitignored)
├── .env.example                 # Environment template
│
├── api/                         # API Layer
│   └── routes/
│       ├── auth.py             # Authentication endpoints
│       ├── anomalies.py        # Anomaly management endpoints
│       ├── users.py            # User management endpoints
│       └── realtime.py         # WebSocket/SSE endpoints
│
├── database/                    # Data Layer
│   ├── connection.py           # MongoDB connection manager
│   ├── models.py               # Database models (CRUD operations)
│   ├── schemas.py              # Pydantic schemas (validation)
│   └── indexes.py              # Database index definitions
│
├── core/                        # Core Business Logic
│   ├── processor.py            # Main data processing pipeline
│   ├── tda.py                  # Topological Data Analysis engine
│   ├── ml.py                   # Machine Learning models
│   └── security.py             # Threat classification
│
├── auth/                        # Authentication
│   ├── password_utils.py       # Password hashing/verification
│   └── jwt_handler.py          # JWT token management
│
├── middleware/                  # Custom Middleware
│   └── auth_middleware.py      # Request authentication
│
├── scripts/                     # Utility Scripts
│   └── seed_database.py        # Database seeding
│
└── tests/                       # Unit Tests
    └── test_tda.py             # TDA engine tests
```

---

## Technology Stack

### Core Framework

- **FastAPI** 0.104 - High-performance async web framework
- **Uvicorn** - ASGI server
- **Python** 3.10+ - Programming language

### Data Processing

- **NumPy** - Numerical computing
- **Pandas** - Data manipulation
- **Scikit-learn** - Machine learning (Isolation Forest)
- **PyTorch** - Deep learning (Autoencoder)

### Topological Data Analysis

- **Ripser** - Persistent homology computation
- **Persim** - Persistence diagram visualization
- **Giotto-TDA** - Additional TDA utilities (optional)

### Database

- **Motor** - Async MongoDB driver
- **PyMongo** - MongoDB utilities
- **MongoDB Atlas** - Cloud database service

### Authentication

- **PassLib** - Password hashing (bcrypt)
- **Python-Jose** - JWT token handling
- **Python-Multipart** - Form data parsing

### Development

- **Pytest** - Testing framework
- **Black** - Code formatting
- **Pylint** - Code linting

---

## Setup Instructions

### Prerequisites

- Python 3.10 or higher
- MongoDB Atlas account (free tier works fine)
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/Vidish-Bijalwan/WINTER-2026.git
cd WINTER-2026/backend
```

### Step 2: Create Virtual Environment

**Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\activate
```

**Linux/macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Variables](#environment-variables)).

### Step 5: Start the Server

**Development Mode:**

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Production Mode:**

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at: `http://localhost:8000`

Interactive API docs: `http://localhost:8000/docs`

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

| Variable        | Description                | Example                                                                    | Required             |
| --------------- | -------------------------- | -------------------------------------------------------------------------- | -------------------- |
| `MONGODB_URI`   | MongoDB connection string  | `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority` | ✅ Yes               |
| `JWT_SECRET`    | Secret key for JWT signing | `your_super_secret_key_change_this`                                        | ✅ Yes               |
| `DATABASE_NAME` | MongoDB database name      | `topoforge`                                                                | ✅ Yes               |
| `CORS_ORIGINS`  | Allowed CORS origins       | `http://localhost:5173,https://yourapp.com`                                | No (defaults to `*`) |

### Generating JWT Secret

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### MongoDB Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP (or use `0.0.0.0/0` for development)
5. Get the connection string from "Connect" → "Connect your application"
6. Replace `<username>`, `<password>`, and `<cluster>` in the connection string

---

## Core Components

### 1. Data Processor (`core/processor.py`)

The main orchestration layer that coordinates data ingestion, analysis, and storage.

**Key Features:**

- Sliding window buffer (default: 50 events)
- Auto-calibration on first full window
- Async database logging
- Real-time WebSocket broadcasting

**Usage:**

```python
from core.processor import DataProcessor

processor = DataProcessor(window_size=50)

# Ingest event
processor.ingest({"value": 0.75, "timestamp": "2026-01-12T08:00:00Z"})

# Process and analyze
result = await processor.process_window()
# Returns: {betti_numbers, anomaly_score, is_anomaly, security_analysis}
```

---

### 2. TDA Engine (`core/tda.py`)

Computes **Persistent Homology** using the Rips filtration.

**Betti Numbers:**

- **H₀ (Betti-0)**: Connected components
- **H₁ (Betti-1)**: Loops/cycles (critical for detecting coordinated behavior)
- **H₂ (Betti-2)**: Voids/cavities

**Features:**

- Adaptive thresholding for noise reduction
- Configurable max homology dimension
- Persistence diagram generation

**Usage:**

```python
from core.tda import TopologyAnalyzer
import numpy as np

tda = TopologyAnalyzer(max_dimension=2)

# Generate point cloud from events
point_cloud = np.array([[0.5, 0.1], [0.7, 0.2], ...])

# Compute persistence diagrams
diagrams = tda.compute_persistence(point_cloud)

# Extract Betti numbers
betti = tda.extract_betti_numbers(diagrams, adaptive=True, sigma=2.0)
# Returns: {"h0": 3, "h1": 1, "h2": 0}
```

---

### 3. ML Anomaly Detector (`core/ml.py`)

Combines **Isolation Forest** and **Autoencoder** for anomaly detection.

**Isolation Forest:**

- Contamination rate: 10%
- Trained on normal baseline data
- Returns anomaly score (higher = more anomalous)

**Autoencoder (Future):**

- Reconstruction error-based detection
- PyTorch implementation ready

**Usage:**

```python
from core.ml import AnomalyDetector

detector = AnomalyDetector(input_dim=2)

# Train on normal data
detector.train(baseline_data)

# Predict
result = detector.predict(new_data_point)
# Returns: {"is_anomaly": True, "severity": 0.87}
```

---

### 4. Security Classifier (`core/security.py`)

Maps anomalies to **MITRE ATT&CK** framework tactics and techniques.

**Risk Levels:**

- Critical (score > 0.8)
- High (score > 0.5)
- Medium (score > 0.2)
- Low (score ≤ 0.2)

**Threat Mapping:**

- High H₁ → Command & Control (T1071)
- High anomaly score → Exfiltration (T1048)
- High frequency → DoS (T1499)

**Usage:**

```python
from core.security import ThreatClassifier

classifier = ThreatClassifier()

analysis = classifier.classify({
    "anomaly_score": 0.9,
    "betti_numbers": {"h0": 3, "h1": 8, "h2": 0}
})
# Returns: {risk_level, confidence, threats[], mitigation}
```

---

## API Documentation

### Base URL

```
http://localhost:8000
```

### Authentication Flow

1. **Register**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` → Returns JWT token
3. **Use Token**: Add header `Authorization: Bearer <token>` to protected routes

### Key Endpoints

| Method | Endpoint               | Description                | Auth Required |
| ------ | ---------------------- | -------------------------- | ------------- |
| POST   | `/api/auth/register`   | Create new user account    | ❌ No         |
| POST   | `/api/auth/login`      | Login and get JWT token    | ❌ No         |
| GET    | `/api/auth/me`         | Get current user profile   | ✅ Yes        |
| POST   | `/api/anomalies/`      | Create anomaly log         | ✅ Yes        |
| GET    | `/api/anomalies/`      | List anomalies (paginated) | ✅ Yes        |
| GET    | `/api/anomalies/stats` | Get anomaly statistics     | ✅ Yes        |
| GET    | `/api/users/{id}`      | Get user by ID             | ✅ Yes        |
| WS     | `/ws/stream`           | Real-time event streaming  | ❌ No         |

**Interactive API Docs:** Visit `/docs` for Swagger UI or `/redoc` for ReDoc.

---

## Database

### MongoDB Collections

**1. `anomalies`** - Anomaly detection logs

- Indexed on: `timestamp`, `is_anomaly`, `source_type`
- Average size: ~500 bytes per document

**2. `users`** - User accounts

- Indexed on: `email` (unique), `username` (unique)
- Password stored as bcrypt hash

**3. `alert_configs`** - Alert configurations

- Indexed on: `user_id`
- Links to user notifications

### Connection Management

The backend uses **Motor** for async MongoDB operations:

```python
from database.connection import db_connection

# Connection lifecycle managed by FastAPI lifespan
# Startup: await db_connection.connect()
# Shutdown: await db_connection.disconnect()

# Get database instance
db = db_connection.get_database()
collection = db["anomalies"]
```

### Creating Indexes

Indexes are automatically created on startup via `database/indexes.py`:

```python
async def create_indexes():
    database = db_connection.get_database()

    # Anomalies collection
    await database["anomalies"].create_index([("timestamp", 1)])
    await database["anomalies"].create_index([("is_anomaly", 1)])

    # Users collection
    await database["users"].create_index([("email", 1)], unique=True)
```

---

## Development Guide

### Adding a New API Endpoint

1. **Create route function** in `api/routes/`:

```python
# api/routes/my_feature.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/my-feature", tags=["MyFeature"])

@router.get("/")
async def get_data():
    return {"status": "ok"}
```

2. **Register router** in `main.py`:

```python
from .api.routes import my_feature
app.include_router(my_feature.router)
```

### Adding a New Database Model

1. **Define schema** in `database/schemas.py`:

```python
class MySchema(BaseModel):
    field1: str
    field2: int
```

2. **Create model** in `database/models.py`:

```python
class MyModel:
    def __init__(self):
        self.collection_name = "my_collection"

    async def create(self, data: Dict[str, Any]):
        database = db_connection.get_database()
        result = await database[self.collection_name].insert_one(data)
        return str(result.inserted_id)
```

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=backend --cov-report=html

# Run specific test file
pytest tests/test_tda.py -v
```

---

## Testing

### Unit Tests

```bash
pytest tests/
```

### Integration Tests

```bash
# Start test database
docker run -d -p 27017:27017 mongo:latest

# Run integration tests
pytest tests/integration/ -v
```

### API Testing with cURL

**Register User:**

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!"}'
```

**Login:**

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -F "username=test@example.com" \
  -F "password=Test123!"
```

---

## Troubleshooting

### Issue: MongoDB Connection Failed

**Error:** `pymongo.errors.ServerSelectionTimeoutError`

**Solutions:**

1. Check `MONGODB_URI` in `.env`
2. Verify database user credentials
3. Whitelist your IP in MongoDB Atlas
4. Check firewall settings

---

### Issue: Module Not Found

**Error:** `ModuleNotFoundError: No module named 'ripser'`

**Solution:**

```bash
pip install --upgrade -r requirements.txt
```

---

### Issue: JWT Token Invalid

**Error:** `401 Unauthorized: Invalid credentials`

**Solutions:**

1. Verify `JWT_SECRET` is set correctly
2. Check token expiration (default: 24 hours)
3. Ensure `Authorization: Bearer <token>` header is present

---

### Issue: TDA Computation Slow

**Problem:** Processing takes > 1 second per window

**Solutions:**

1. Reduce `window_size` (default: 50 → try 30)
2. Lower `max_dimension` (2 → 1)
3. Enable adaptive thresholding to filter noise
4. Consider using Giotto-TDA for GPU acceleration

---

### Issue: Port Already in Use

**Error:** `Address already in use`

**Solution:**

```powershell
# Windows - Find process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

---

## Performance Optimization

### Recommended Settings

**Development:**

- Workers: 1
- Window size: 30-50
- Max dimension: 1

**Production:**

- Workers: 4 (or CPU cores)
- Window size: 100
- Max dimension: 2
- Enable Redis caching (future)

### Monitoring

Key metrics to track:

- Request latency (target: < 200ms)
- TDA computation time (target: < 500ms)
- Memory usage (target: < 512MB per worker)
- Database query time (target: < 50ms)

---

## Security Best Practices

✅ **Never commit `.env` files**  
✅ **Rotate JWT secrets regularly**  
✅ **Use HTTPS in production**  
✅ **Implement rate limiting** (use `slowapi`)  
✅ **Validate all user inputs** (Pydantic handles this)  
✅ **Use strong password policies** (min 8 chars, mixed case, numbers)  
✅ **Enable MongoDB authentication**

---

## Deployment

### Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t topoforge-backend .
docker run -p 8000:8000 --env-file .env topoforge-backend
```

### Cloud Deployment (e.g., Railway, Render)

1. Create `Procfile`:

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. Set environment variables in platform dashboard
3. Deploy from GitHub repository

---

## Additional Resources

- **API Schema Documentation**: See `BACKEND_SCHEMA.md`
- **Main Project README**: See `../README.md`
- **Architecture Docs**: See `../ARCHITECTURE.md`
- **Contributing Guide**: See `../CONTRIBUTING.md`

---

## Support

For issues or questions:

1. Check this documentation
2. Review `BACKEND_SCHEMA.md` for data structures
3. Open an issue on GitHub
4. Contact the development team

---

**Built with ❤️ using FastAPI, TDA, and ML**
