# Data Flow Diagram - Level 2 (Detailed Processes)

**Document Version:** 1.0  
**Date:** January 10, 2026  
**Author:** Team Member 3 - Testing & Documentation

---

## Overview

This Level 2 Data Flow Diagram breaks down the major subsystems identified in Level 1 into detailed processes. It focuses on the internal logic of critical components, specifically Data Ingestion, TDA Processing, Anomaly Detection, and the API Layer.

---

## 1.0 Data Ingestion Process Detail

```mermaid
graph TB
    %% External Inputs
    RawStream["Raw Stream<br/>(SSE/API)"]
    
    %% Processes
    P1_1["1.1 SSE Connection<br/>Manager"]
    P1_2["1.2 Event Parser<br/>& Validator"]
    P1_3["1.3 Event<br/>Normalizer"]
    P1_4["1.4 Batch Buffer"]
    
    %% Internal Data Store
    DeadLetter["Dead Letter<br/>Queue"]
    
    %% Outputs
    Buffer["Event Batch<br/>(To Process 2.0)"]
    
    %% Flows
    RawStream --> P1_1
    P1_1 -->|"DF-1.1.1<br/>Raw Data"| P1_2
    P1_2 -->|"DF-1.1.2<br/>Valid Events"| P1_3
    P1_2 -->|"DF-1.1.3<br/>Invalid Events"| DeadLetter
    P1_3 -->|"DF-1.1.4<br/>Normalized Object"| P1_4
    P1_4 -->|"DF-1.1.5<br/>Batch Ready"| Buffer
    
    %% Styling
    classDef process fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    classDef store fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    class RawStream,Buffer store
    class P1_1,P1_2,P1_3,P1_4 process
    class DeadLetter store
```

### Process Descriptions (1.0)

| Process ID | Name | Description | Input | Output |
|------------|------|-------------|-------|--------|
| **1.1** | SSE Connection Manager | Maintains persistent connection to Wikipedia/Twitter streams | Raw Stream | Raw Data String |
| **1.2** | Event Parser & Validator | Parses JSON and validates against schema (zod/pydantic) | Raw Data | Valid Event / Error |
| **1.3** | Event Normalizer | Maps source-specific fields to common schema | Valid Event | Normalized Object |
| **1.4** | Batch Buffer | Aggregates events into manageable chunks (e.g., 100 events) | Normalized Object | Event Batch |

---

## 2.0 TDA Processing Process Detail

```mermaid
graph TB
    %% Inputs
    EventBatch["Event Batch<br/>(From 1.0)"]
    
    %% Processes
    P2_1["2.1 Point Cloud<br/>Generation"]
    P2_2["2.2 Component<br/>Filter"]
    P2_3["2.3 Simplicial Complex<br/>Construction"]
    P2_4["2.4 Homology<br/>Computation"]
    P2_5["2.5 Feature<br/>Extraction"]
    
    %% Outputs
    Features["Topological Features<br/>(To Process 3.0)"]
    
    %% Flows
    EventBatch --> P2_1
    P2_1 -->|"DF-2.1.1<br/>Vector Points"| P2_2
    P2_2 -->|"DF-2.1.2<br/>Filtered Points"| P2_3
    P2_3 -->|"DF-2.1.3<br/>Vietoris-Rips Complex"| P2_4
    P2_4 -->|"DF-2.1.4<br/>Persistence Diagrams"| P2_5
    P2_5 -->|"DF-2.1.5<br/>Betti Numbers"| Features
    
    %% Styling
    classDef process fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    classDef store fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    class EventBatch,Features store
    class P2_1,P2_2,P2_3,P2_4,P2_5 process
```

### Process Descriptions (2.0)

| Process ID | Name | Description | Input | Output |
|------------|------|-------------|-------|--------|
| **2.1** | Point Cloud Generation | Converts event attributes (user, size, time) to n-dimensional points | Event Batch | Vector Points |
| **2.2** | Component Filter | Removes noise and outliers before TDA | Vector Points | Filtered Points |
| **2.3** | Simplicial Complex Construction | Builds Vietoris-Rips complex at varying epsilon scales | Filtered Points | VR Complex |
| **2.4** | Homology Computation | Calculates persistent homology groups | VR Complex | Persistence Diagrams |
| **2.5** | Feature Extraction | Extracts Betti numbers (H0, H1, H2) from diagrams | Persistence Diagrams | Topological Features |

---

## 3.0 Anomaly Detection Process Detail

```mermaid
graph TB
    %% Inputs
    Features["Topological Features<br/>(From 2.0)"]
    BaselineStore[("Baseline<br/>Model Store")]
    
    %% Processes
    P3_1["3.1 Baseline<br/>Comparison"]
    P3_2["3.2 Anomaly<br/>Scoring"]
    P3_3["3.3 Threshold<br/>Check"]
    P3_4["3.4 Alert<br/>Generation"]
    
    %% Outputs
    Results["Results<br/>(To Storage)"]
    Alerts["Alerts<br/>(To Frontend)"]
    
    %% Flows
    Features --> P3_1
    BaselineStore -->|"DF-3.1.1<br/>Model"| P3_1
    P3_1 -->|"DF-3.1.2<br/>Deviation"| P3_2
    P3_2 -->|"DF-3.1.3<br/>Raw Score"| P3_3
    P3_3 -->|"DF-3.1.4<br/>Is Anomaly?"| P3_4
    P3_4 -->|"DF-3.1.5<br/>Alert Object"| Alerts
    P3_3 -->|"DF-3.1.6<br/>Full Record"| Results
    
    %% Styling
    classDef process fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    classDef store fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    class Features,Results,Alerts,BaselineStore store
    class P3_1,P3_2,P3_3,P3_4 process
```

### Process Descriptions (3.0)

| Process ID | Name | Description | Input | Output |
|------------|------|-------------|-------|--------|
| **3.1** | Baseline Comparison | Compares current Betti numbers against historical baseline | Features, Model | Deviation Vector |
| **3.2** | Anomaly Scoring | Calculates scalar anomaly score (0.0-1.0) | Deviation Vector | Raw Score |
| **3.3** | Threshold Check | Determines if score exceeds dynamic threshold | Raw Score | Classification Result |
| **3.4** | Alert Generation | Creates alert payload if anomaly confirmed | Classification Result | Alert Object |

---

## 5.0 API Layer Process Detail (Authentication)

```mermaid
graph TB
    %% Inputs
    Request["HTTP Request<br/>(From Client)"]
    DB[("User<br/>Database")]
    
    %% Processes
    P5_1["5.1 Route<br/>Dispatcher"]
    P5_2["5.2 Auth<br/>Middleware"]
    P5_3["5.3 Token<br/>Validator"]
    P5_4["5.4 Request<br/>Handler"]
    P5_5["5.5 Response<br/>Formatter"]
    
    %% Outputs
    Response["HTTP Response<br/>(To Client)"]
    
    %% Flows
    Request --> P5_1
    P5_1 --> P5_2
    P5_2 --> P5_3
    P5_3 <-->|"DF-5.3.1<br/>Verify User"| DB
    P5_3 -->|"DF-5.3.2<br/>Valid Context"| P5_4
    P5_3 -.->|"DF-5.3.3<br/>Invalid"| P5_5
    P5_4 -->|"DF-5.4.1<br/>Data"| P5_5
    P5_5 --> Response
    
    %% Styling
    classDef process fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    classDef store fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    class Request,Response,DB store
    class P5_1,P5_2,P5_3,P5_4,P5_5 process
```

### Process Descriptions (5.0)

| Process ID | Name | Description | Input | Output |
|------------|------|-------------|-------|--------|
| **5.1** | Route Dispatcher | Routes request to appropriate handler based on URL | HTTP Request | Routed Context |
| **5.2** | Auth Middleware | Intercepts protected routes checks for headers | Routed Context | Auth Request |
| **5.3** | Token Validator | Decodes and validates JWT signature and expiry | Auth Request | User Context |
| **5.4** | Request Handler | Executes business logic (controller functions) | User Context | Data Result |
| **5.5** | Response Formatter | Formats data as JSON and sets status codes | Data Result | HTTP Response |

---

## Data Structures

### Event Object (Standardized)
```json
{
  "source": "wikipedia",
  "timestamp": "ISO-8601",
  "actor": "string",
  "action": "string",
  "value": number,
  "metadata": {}
}
```

### Topological Feature Vector
```json
{
  "h0": integer,
  "h1": integer,
  "h2": integer,
  "persistence_entropy": float,
  "wasserstein_dist": float
}
```

### Anomaly Result
```json
{
  "is_anomaly": boolean,
  "score": float,
  "confidence": float,
  "features": FeatureVector,
  "timestamp": "ISO-8601"
}
```

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-10 | Team Member 3 | Initial DFD Level 2 creation |

---

## References

- [DFD Level 0 - Context Diagram](file:///d:/os%20lab/WINTER-2026/docs/architecture/DFD_LEVEL_0.md)
- [DFD Level 1 - System Overview](file:///d:/os%20lab/WINTER-2026/docs/architecture/DFD_LEVEL_1.md)
- [Database Schema](file:///d:/os%20lab/WINTER-2026/docs/database/DATABASE_SCHEMA.md)
