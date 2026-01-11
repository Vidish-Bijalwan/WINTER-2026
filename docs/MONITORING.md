# Monitoring and Logging Guide

This document details the monitoring and logging infrastructure for TopoForge.

## Logging

### Backend (Python)
We use structured JSON logging for all backend services.

**Log Levels:**
- `DEBUG`: Detailed diagnostic info (development only)
- `INFO`: General operational events (startup, shutdown, configuration)
- `WARNING`: Unexpected events that don't stop execution (slow requests, 4xx errors)
- `ERROR`: Runtime errors that failed a request (5xx errors, exceptions)
- `CRITICAL`: System-critical events (database connection lost)

**Log Format:**
```json
{
  "timestamp": "2026-01-10T12:00:00.123Z",
  "level": "INFO",
  "message": "Incoming request: GET /api/anomalies",
  "module": "logging_middleware",
  "function": "dispatch",
  "request_id": "a1b2c3d4-...",
  "status_code": 200,
  "duration_ms": 45.2
}
```

### Frontend
Console logs are stripped in production except for errors.
Web Vitals are captured and sent to the backend.

---

## Metrics (Prometheus)

The backend exposes metrics at `/metrics` scraper by Prometheus.

### Key Metrics
- `http_requests_total`: Total request count by method, path, and status
- `http_request_duration_seconds`: Histogram of request latency
- `http_requests_in_progress`: Current active requests
- `process_cpu_seconds_total`: CPU usage
- `process_open_fds`: Open file descriptors

### Visualizing in Grafana
Common dashboards include:
1. **API Overview**: RPS, Error Rate, Latency (p50, p95, p99)
2. **Resource Usage**: CPU, Memory, Disk user
3. **Business Metrics**: Anomalies detected per hour, Active users

---

## Error Tracking

### Strategy
1. **Global Error Boundary (Frontend)**: Catches React rendering errors
2. **Exception Handlers (Backend)**: Catches unhandled Python exceptions
3. **Alerting**: 
   - 5xx Error Rate > 1% (Warning)
   - 5xx Error Rate > 5% (Critical)
   - Database Connectivity Loss (Critical)

---

## Setup Instructions

### Enable Metrics
Set `ENABLE_METRICS=true` in environment variables.

### Access Logs
- **Docker**: `docker logs topoforge-backend`
- **File**: `logs/topoforge.log` (rotated daily)

### Health Checks
- Backend: `GET /health` or `GET /`
- Database: `db.runCommand("ping")`
