# TopoForge Database Schema Documentation

This document describes the MongoDB database structure for the TopoForge anomaly detection platform.

## ER Diagram

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : "has"
    USERS ||--o{ ALERT_CONFIGS : "configures"
    USERS {
        ObjectId _id PK
        string username UK
        string email UK "Indexed"
        string hashed_password
        string role "admin|viewer"
        datetime created_at
        datetime last_login
    }

    SESSIONS {
        ObjectId _id PK
        ObjectId user_id FK
        string token
        datetime expires_at "TTL Index"
    }

    ALERT_CONFIGS {
        ObjectId _id PK
        ObjectId user_id FK
        float threshold "0.0-10.0"
        string[] notification_channels
        boolean is_active
    }

    DATA_SOURCES {
        ObjectId _id PK
        string name
        string type "wikipedia|twitter|reddit"
        string url
        string description
        boolean active
        datetime created_at
    }

    ANOMALY_LOGS {
        ObjectId _id PK
        datetime timestamp "Compound Index"
        string source_type FK "References DATA_SOURCES.type"
        object event_data
        int betti_h0 "Connected Components"
        int betti_h1 "Loops/Cycles"
        int betti_h2 "Voids/Cavities"
        float anomaly_score "0.0-10.0"
        boolean is_anomaly
        object metadata
    }
    
    DATA_SOURCES ||--o{ ANOMALY_LOGS : "generates"
```

## Collections

### 1. Users (`users`)

Stores user account information for authentication and authorization.

| Field             | Type     | Required | Description                    |
| ----------------- | -------- | -------- | ------------------------------ |
| `_id`             | ObjectId | Yes      | Unique identifier              |
| `username`        | String   | Yes      | Display name                   |
| `email`           | String   | Yes      | Unique email address (Indexed) |
| `hashed_password` | String   | Yes      | Bcrypt hash of password        |
| `role`            | String   | Yes      | 'admin' or 'viewer'            |
| `created_at`      | DateTime | Yes      | Account creation timestamp     |
| `last_login`      | DateTime | No       | Last successful login          |

### 2. Anomaly Logs (`anomalies`)

Stores detected anomalies and their topological features.

| Field           | Type     | Required | Description                               |
| --------------- | -------- | -------- | ----------------------------------------- |
| `_id`           | ObjectId | Yes      | Unique identifier                         |
| `timestamp`     | DateTime | Yes      | Detection time (Compound Index)           |
| `source_type`   | String   | Yes      | Source of data (e.g., 'wikipedia')        |
| `event_data`    | Object   | Yes      | Raw event data snapshot                   |
| `betti_h0`      | Int      | No       | 0th Betti number (Components)             |
| `betti_h1`      | Int      | No       | 1st Betti number (Loops)                  |
| `betti_h2`      | Int      | No       | 2nd Betti number (Voids)                  |
| `anomaly_score` | Float    | Yes      | Calculated severity (0.0-10.0)            |
| `is_anomaly`    | Boolean  | Yes      | Flag if anomaly (threshold: score > 3.0)  |
| `metadata`      | Object   | No       | Additional context (e.g., security class) |

### 3. Sessions (`sessions`)

Manages active user sessions.

| Field        | Type     | Required | Description                          |
| ------------ | -------- | -------- | ------------------------------------ |
| `_id`        | ObjectId | Yes      | Unique identifier                    |
| `user_id`    | ObjectId | Yes      | Reference to User                    |
| `token`      | String   | Yes      | Refresh token                        |
| `expires_at` | DateTime | Yes      | Expiry time (TTL Index: auto-delete) |

### 4. Alert Configs (`alert_configs`)

User preferences for anomaly notifications.

| Field                   | Type     | Required | Description                        |
| ----------------------- | -------- | -------- | ---------------------------------- |
| `_id`                   | ObjectId | Yes      | Unique identifier                  |
| `user_id`               | ObjectId | Yes      | Reference to User                  |
| `threshold`             | Float    | Yes      | Minimum score to trigger alert     |
| `notification_channels` | Array    | Yes      | List of channels (e.g., ['email']) |
| `is_active`             | Boolean  | Yes      | Config status                      |

### 5. Data Sources (`data_sources`)

Available data sources for anomaly detection.

| Field         | Type     | Required | Description                           |
| ------------- | -------- | -------- | ------------------------------------- |
| `_id`         | ObjectId | Yes      | Unique identifier                     |
| `name`        | String   | Yes      | Display name                          |
| `type`        | String   | Yes      | Source type (wikipedia, twitter, etc) |
| `url`         | String   | Yes      | API endpoint or stream URL            |
| `description` | String   | No       | Source description                    |
| `active`      | Boolean  | Yes      | Whether source is active              |
| `created_at`  | DateTime | Yes      | Creation timestamp                    |

## Collection Relationships

```mermaid
graph TB
    Users[(Users)] -->|1:N| Sessions[(Sessions)]
    Users -->|1:N| AlertConfigs[(Alert Configs)]
    DataSources[(Data Sources)] -->|1:N| AnomalyLogs[(Anomaly Logs)]
    
    style Users fill:#4a9eff,color:#fff
    style Sessions fill:#2d2d2d,color:#fff
    style AlertConfigs fill:#2d2d2d,color:#fff
    style DataSources fill:#4a9eff,color:#fff
    style AnomalyLogs fill:#2d2d2d,color:#fff
```

**Relationship Details:**
- One User can have multiple Sessions (1:N)
- One User can have multiple Alert Configs (1:N)
- One Data Source can generate multiple Anomaly Logs (1:N)
- Anomaly Logs reference Data Sources via `source_type` field

---

## Indexes

### Primary Indexes
- **Users**: 
  - `{ "email": 1 }` - Unique index for login lookups
  - `{ "username": 1 }` - Unique index for user identification
  
- **Anomalies**: 
  - `{ "timestamp": -1, "source_type": 1 }` - Compound index for time-based queries
  - `{ "is_anomaly": 1, "timestamp": -1 }` - Index for anomaly filtering
  
- **Sessions**: 
  - `{ "expires_at": 1 }` - TTL index (expireAfterSeconds=0) for auto-deletion
  - `{ "user_id": 1 }` - Index for user session queries
  
- **AlertConfigs**: 
  - `{ "user_id": 1, "is_active": 1 }` - Compound index for active configs
  
- **DataSources**:
  - `{ "type": 1, "active": 1 }` - Compound index for source filtering

### Index Visualization

```mermaid
graph LR
    subgraph "Users Collection"
        U1[email: UNIQUE]
        U2[username: UNIQUE]
    end
    
    subgraph "Anomalies Collection"
        A1[timestamp + source_type]
        A2[is_anomaly + timestamp]
    end
    
    subgraph "Sessions Collection"
        S1[expires_at: TTL]
        S2[user_id]
    end
    
    style U1 fill:#4caf50,color:#fff
    style U2 fill:#4caf50,color:#fff
    style A1 fill:#ff9800,color:#fff
    style A2 fill:#ff9800,color:#fff
    style S1 fill:#f44336,color:#fff
    style S2 fill:#ff9800,color:#fff
```

---

## Example Documents

### User Document
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "username": "analyst_john",
  "email": "john@toposhape.io",
  "hashed_password": "$2b$12$K1zTHIZ...",
  "role": "admin",
  "full_name": "John Doe",
  "organization": "TopoShape Research",
  "created_at": ISODate("2024-01-15T10:30:00Z"),
  "last_login": ISODate("2026-01-12T08:14:35Z")
}
```

### Anomaly Log Document
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6789abcdef0"),
  "timestamp": ISODate("2026-01-12T13:42:15Z"),
  "source_type": "wikipedia",
  "event_data": {
    "user": "SuspiciousBot123",
    "page": "Important_Article",
    "edit_delta": 5000,
    "comment": "automated edit"
  },
  "betti_h0": 245,
  "betti_h1": 18,
  "betti_h2": 3,
  "anomaly_score": 7.8,
  "is_anomaly": true,
  "metadata": {
    "wasserstein_distance": 4.2,
    "landscape_norm": 3.1,
    "statistical_component": 2.5,
    "confidence": 0.92
  }
}
```

### Data Source Document
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6789abcdef1"),
  "name": "Wikipedia Recent Changes",
  "type": "wikipedia",
  "url": "https://stream.wikimedia.org/v2/stream/recentchange",
  "description": "Real-time stream of all edits across all Wikimedia projects",
  "active": true,
  "created_at": ISODate("2024-01-10T00:00:00Z")
}
```

### Session Document
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6789abcdef2"),
  "user_id": ObjectId("507f1f77bcf86cd799439011"),
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": ISODate("2026-01-19T13:42:00Z")
}
```

## Data Retention Policy

- **Anomaly Logs**: Retained for 90 days.
- **Sessions**: Retained for 7 days (managed by TTL index).
- **Users**: Indefinite storage until account deletion.

## Backup Strategy

- **Daily**: Automated snapshots via MongoDB Atlas.
- **On-Demand**: Export API to CSV/JSON.
