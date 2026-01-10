# Data Flow Diagram - Level 1 (System Overview)

**Document Version:** 1.0  
**Date:** January 10, 2026  
**Author:** Team Member 3 - Testing & Documentation

---

## Overview

This Level 1 Data Flow Diagram decomposes the TopoForge system into its major subsystems and shows the data flows between them. This provides a more detailed view than the Context Diagram while maintaining a high-level perspective.

---

## System Decomposition Diagram

```mermaid
graph TB
    %% External Entities
    DataSources[("Data Sources<br/>Wikipedia, Twitter, GitHub")]
    Users[("Users<br/>Analysts, Admins")]
    MongoDB[("MongoDB Atlas")]
    
    %% Subsystems
    DataIngestion["1.0<br/><b>Data Ingestion</b><br/>SSE Connection<br/>Event Parsing"]
    TDAProcessing["2.0<br/><b>TDA Processing</b><br/>Point Cloud Gen<br/>Homology Computation"]
    AnomalyDetection["3.0<br/><b>Anomaly Detection</b><br/>Scoring & Alerting"]
    StorageLayer["4.0<br/><b>Storage Layer</b><br/>Database Operations"]
    APILayer["5.0<br/><b>API Layer</b><br/>Auth & Routing"]
    FrontendUI["6.0<br/><b>Frontend UI</b><br/>Visualization<br/>Dashboard"]
    
    %% Data Flows - External to Internal
    DataSources -->|DF-1.1: Raw Events| DataIngestion
    
    %% Internal Data Flows
    DataIngestion -->|DF-1.2: Normalized Events| TDAProcessing
    TDAProcessing -->|DF-1.3: Topological Features<br/>(Betti Numbers)| AnomalyDetection
    AnomalyDetection -->|DF-1.4: Anomaly Results| StorageLayer
    StorageLayer <-->|DF-1.5: DB Queries/Results| MongoDB
    
    StorageLayer -->|DF-1.6: Historical Data| APILayer
    APILayer -->|DF-1.7: JSON API Response| FrontendUI
    FrontendUI -->|DF-1.8: User Requests| APILayer
    APILayer -->|DF-1.9: Data Queries| StorageLayer
    
    %% Real-time path
    AnomalyDetection -.->|DF-1.10: Real-time Alerts<br/>(WebSocket)| FrontendUI
    
    %% User interactions
    Users <-->|DF-1.11: HTTP/WebSocket| FrontendUI
    
    %% Styling
    classDef external fill:#e1f5ff,stroke:#0277bd,stroke-width:3px
    classDef subsystem fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    classDef database fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
    
    class DataSources,Users external
    class DataIngestion,TDAProcessing,AnomalyDetection,StorageLayer,APILayer,FrontendUI subsystem
    class MongoDB database
```

---

## Subsystem Descriptions

### 1.0 Data Ingestion

**Purpose:** Receive and normalize raw event data from external sources

**Key Functions:**
- Establish SSE connections to data sources
- Parse incoming JSON events
- Validate event structure
- Buffer events for batch processing
- Handle connection failures and reconnection

**Input:** Raw event streams (JSON over SSE)  
**Output:** Normalized event objects with standardized schema

---

### 2.0 TDA Processing

**Purpose:** Apply Topological Data Analysis to detect structural patterns

**Key Functions:**
- Generate point clouds from event sequences
- Construct simplicial complexes
- Compute persistent homology
- Calculate Betti numbers (H0, H1, H2)
- Generate persistence diagrams

**Input:** Normalized events  
**Output:** Topological features (Betti numbers, persistence data)

**Libraries Used:** Ripser, Persim, scikit-learn

---

### 3.0 Anomaly Detection

**Purpose:** Identify anomalous patterns using topological features

**Key Functions:**
- Maintain baseline models of normal behavior
- Compute anomaly scores from Betti numbers
- Apply threshold-based detection
- Generate alert notifications
- Classify anomaly severity

**Input:** Topological features  
**Output:** Anomaly detection results with scores

**Algorithm:** Statistical deviation from baseline + ML-based classification

---

### 4.0 Storage Layer

**Purpose:** Manage all database operations and data persistence

**Key Functions:**
- CRUD operations for anomaly logs
- User management (create, update, delete)
- Session management
- Query optimization and indexing
- Data retention policies (90-day cleanup)

**Input:** Anomaly results, user data, queries  
**Output:** Stored records, query results

---

### 5.0 API Layer

**Purpose:** Provide RESTful API for frontend and external integrations

**Key Functions:**
- Route HTTP requests to appropriate handlers
- JWT authentication and authorization
- Input validation and sanitization
- Rate limiting
- Error handling and logging

**Endpoints:** `/api/auth/*`, `/api/anomalies/*`, `/api/users/*`

**Input:** HTTP requests from frontend  
**Output:** JSON responses

---

### 6.0 Frontend UI

**Purpose:** Provide interactive visualization and user interface

**Key Functions:**
- Render 3D network topology visualizations (Three.js)
- Display real-time anomaly feed
- Interactive filtering and querying
- User authentication UI
- Export data to CSV/JSON
- Theme management (dark/light mode)

**Technologies:** React, TypeScript, Three.js, D3.js

**Input:** User interactions, API responses, WebSocket updates  
**Output:** Rendered visualizations and UI components

---

## Detailed Data Flow Descriptions

### DF-1.1: Raw Events (Data Sources → Data Ingestion)

| Attribute | Details |
|-----------|---------|
| **Flow ID** | DF-1.1 |
| **Data Type** | JSON objects |
| **Protocol** | Server-Sent Events (SSE) |
| **Format** | `{type, timestamp, metadata, ...}` |
| **Volume** | High (100-1000 events/second) |

---

### DF-1.2: Normalized Events (Data Ingestion → TDA Processing)

| Attribute | Details |
|-----------|---------|
| **Flow ID** | DF-1.2 |
| **Data Type** | Standardized event objects |
| **Format** | `{source, timestamp, features[], ...}` |
| **Processing** | Batched (100 events/batch) |
| **Schema** | Unified schema across all sources |

---

### DF-1.3: Topological Features (TDA Processing → Anomaly Detection)

| Attribute | Details |
|-----------|---------|
| **Flow ID** | DF-1.3 |
| **Data Type** | Computed topological invariants |
| **Contents** | Betti numbers (H0, H1, H2), persistence intervals |
| **Format** | `{betti_h0, betti_h1, betti_h2, persistence_diagram[]}` |
| **Frequency** | Per batch of events processed |

---

### DF-1.4: Anomaly Results (Anomaly Detection → Storage Layer)

| Attribute | Details |
|-----------|---------|
| **Flow ID** | DF-1.4 |
| **Data Type** | Anomaly detection results |
| **Contents** | Anomaly score, classification, topological features |
| **Format** | `{is_anomaly, score, betti_h0, betti_h1, betti_h2, metadata}` |
| **Action** | INSERT into anomaly_logs collection |

---

### DF-1.5: DB Queries/Results (Storage Layer ↔ MongoDB)

| Attribute | Details |
|-----------|---------|
| **Flow ID** | DF-1.5 |
| **Direction** | Bidirectional |
| **Operations** | INSERT, FIND, UPDATE, DELETE |
| **Protocol** | MongoDB Wire Protocol |
| **Collections** | users, anomaly_logs, sessions, alert_configs |

---

### DF-1.6: Historical Data (Storage Layer → API Layer)

| Attribute | Details |
|-----------|---------|
| **Flow ID** | DF-1.6 |
| **Data Type** | Query results from database |
| **Contents** | Filtered anomaly logs, user data, statistics |
| **Format** | Python dictionaries/lists |
| **Processing** | Pagination, sorting, aggregation |

---

### DF-1.7: JSON API Response (API Layer → Frontend UI)

| Attribute | Details |
|-----------|---------|
| **Flow ID** | DF-1.7 |
| **Data Type** | JSON-formatted HTTP responses |
| **Protocol** | HTTPS |
| **Format** | `{data: [...], total, page, limit}` |
| **Status Codes** | 200 (success), 401 (unauthorized), 404 (not found) |

---

### DF-1.8: User Requests (Frontend UI → API Layer)

| Attribute | Details |
|-----------|---------|
| **Flow ID** | DF-1.8 |
| **Data Type** | HTTP requests |
| **Methods** | GET, POST, PUT, DELETE |
| **Headers** | Authorization (JWT), Content-Type |
| **Body** | Query parameters, filters, form data |

---

### DF-1.9: Data Queries (API Layer → Storage Layer)

| Attribute | Details |
|-----------|---------|
| **Flow ID** | DF-1.9 |
| **Data Type** | Database query objects |
| **Operations** | Find with filters, aggregation pipelines |
| **Parameters** | Date range, source filter, pagination |

---

### DF-1.10: Real-time Alerts (Anomaly Detection → Frontend UI)

| Attribute | Details |
|-----------|---------|
| **Flow ID** | DF-1.10 |
| **Data Type** | WebSocket messages |
| **Protocol** | WebSocket (WSS) |
| **Contents** | Newly detected anomalies |
| **Frequency** | Event-driven (when anomaly detected) |
| **Format** | `{type: 'anomaly', data: {...}}` |

---

### DF-1.11: HTTP/WebSocket (Users ↔ Frontend UI)

| Attribute | Details |
|-----------|---------|
| **Flow ID** | DF-1.11 |
| **Direction** | Bidirectional |
| **Protocols** | HTTPS (initial load), WebSocket (real-time updates) |
| **User Actions** | Login, filter, query, export, configure |
| **UI Responses** | Rendered pages, visualizations, notifications |

---

## Process Interactions

### Primary Data Pipeline (Linear Flow)

```
Data Sources → Data Ingestion → TDA Processing → Anomaly Detection → Storage Layer → MongoDB
```

### Query Pipeline (User-Initiated)

```
Users → Frontend UI → API Layer → Storage Layer → MongoDB
MongoDB → Storage Layer → API Layer → Frontend UI → Users
```

### Real-time Alert Pipeline

```
Anomaly Detection → Frontend UI (WebSocket) → Users
```

---

## Data Store Information

### MongoDB Collections (Referenced as Process 4.0 outputs)

1. **anomaly_logs** - Stores detected anomalies with topological features
2. **users** - User accounts and authentication data
3. **sessions** - Active user sessions for JWT management
4. **alert_configs** - User-defined alert thresholds and preferences

---

## Performance Considerations

| Subsystem | Bottleneck | Mitigation |
|-----------|-----------|------------|
| Data Ingestion | High event volume | Event batching, async processing |
| TDA Processing | CPU-intensive computations | GPU acceleration, optimized algorithms |
| Anomaly Detection | Model inference latency | Pre-computed baselines, caching |
| Storage Layer | Database write throughput | Batch inserts, indexing |
| API Layer | Concurrent requests | Connection pooling, caching |
| Frontend UI | 3D rendering performance | WebGL optimization, LOD techniques |

---

## Error Handling

Each subsystem implements error handling:
- **Data Ingestion**: Retry failed SSE connections, skip malformed events
- **TDA Processing**: Handle edge cases (empty point clouds), timeout long computations
- **Anomaly Detection**: Fall back to baseline if model fails
- **Storage Layer**: Transaction rollback on failures
- **API Layer**: Return appropriate HTTP error codes
- **Frontend UI**: Display user-friendly error messages

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-10 | Team Member 3 | Initial DFD Level 1 creation |

---

## References

- [DFD Level 0 - Context Diagram](file:///d:/os%20lab/WINTER-2026/docs/architecture/DFD_LEVEL_0.md)
- [DFD Level 2 - Detailed Processes](file:///d:/os%20lab/WINTER-2026/docs/architecture/DFD_LEVEL_2.md)
- [System Architecture](file:///d:/os%20lab/WINTER-2026/ARCHITECTURE.md)
