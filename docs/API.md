# API Documentation

## Overview
The TopoShape Insights API provides endpoints for data ingestion, anomaly detection, and system monitoring.

## Base URL
`http://localhost:8000/api/v1`

## Endpoints

### Data Ingestion

#### `POST /ingest/event`
Ingest a single event for analysis.

**Request:**
```json
{
  "source": "wikipedia",
  "timestamp": "2025-12-31T12:00:00Z",
  "data": {
    "user": "Editor123",
    "page": "Topology",
    "delta_bytes": 150
  }
}
```

**Response:**
```json
{
  "status": "success",
  "id": "evt_123456"
}
```

### Anomaly Detection

#### `GET /anomalies/recent`
Get recent anomalies detected by the TDA engine.

**Response:**
```json
[
  {
    "id": "anom_789",
    "type": "coordinated_attack",
    "confidence": 0.95,
    "timestamp": "2025-12-31T12:05:00Z",
    "details": {
      "betti_numbers": [1, 5, 0],
      "affected_nodes": ["UserA", "UserB", "PageX"]
    }
  }
]
```

### System Monitoring

#### `GET /metrics`
Prometheus metrics for system performance.
