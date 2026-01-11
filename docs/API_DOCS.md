# TopoForge API Documentation

## Base URL
`http://localhost:8000`

## Authentication
Most endpoints require a Bearer Token.
`Authorization: Bearer <token>`

## REST Endpoints

### Anomalies

#### Export Data
Download anomaly logs as CSV or JSON.

- **URL**: `/api/anomalies/export`
- **Method**: `GET`
- **Query Params**:
    - `format`: `csv` (default) or `json`
- **Response**: File download (CSV) or JSON array.

#### Get Anomalies
Retrieve a paginated list of anomalies.

- **URL**: `/api/anomalies`
- **Method**: `GET`
- **Query Params**:
    - `page`: Page number (default 1)
    - `limit`: Items per page (default 20)
    - `start_date`: ISO timestamp
    - `end_date`: ISO timestamp

### Authentication

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
    ```json
    {
        "username": "user",
        "password": "password"
    }
    ```

#### Register
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
    ```json
    {
        "username": "user",
        "email": "user@example.com",
        "password": "password"
    }
    ```

## WebSocket Protocol

**URL**: `ws://localhost:8000/ws/stream`

### Client -> Server

#### Ingest Event
Send a data point for analysis.
```json
{
    "type": "event",
    "payload": {
        "id": "123",
        "timestamp": "2024-01-01T12:00:00Z",
        "value": 10.5,
        ...other_fields
    }
}
```
*Note: You can also send the raw event object directly.*

#### Update Configuration
Update real-time processing settings.
```json
{
    "type": "config",
    "payload": {
        "anomaly_threshold": 75.0
    }
}
```

### Server -> Client

#### Analysis Result
Broadcasted after processing a window.
```json
{
    "type": "analysis",
    "data": {
        "is_anomaly": true,
        "anomaly_score": 85.5,
        "scores": {
            "total": 85.5,
            "betti": 90.0,
            "entropy": 60.0,
            "ml": 95.0
        },
        "betti_numbers": {"h0": 5, "h1": 2, "h2": 0},
        "topology_features": {
            "entropy": 2.5,
            "total_lifetime": 15.0,
            "landscape": {"x": [...], "y": [...]}
        }
    },
    "original_event": {...}
}
```
