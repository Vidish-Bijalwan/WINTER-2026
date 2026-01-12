"""
OpenAPI 3.0 Specification for TopoShape Insights API
Auto-generated documentation served at /api/docs
"""

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

def custom_openapi(app: FastAPI):
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="TopoShape Insights API",
        version="1.0.0",
        description="""
        # TopoShape Insights API
        
        Real-time anomaly detection using Topological Data Analysis (TDA).
        
        ## Features
        - **Persistence Diagram Computation**: Analyze topological features in streaming data
        - **Multi-Modal Anomaly Detection**: Combine TDA with statistical methods
        - **User Management**: Secure authentication and profile management
        - **Webhook Integration**: Real-time notifications for anomalies
        
        ## Authentication
        All endpoints require JWT Bearer token except `/auth/*` routes.
        
        ## Rate Limiting
        - Authenticated: 100 requests/minute
        - Anonymous: 20 requests/minute
        """,
        routes=app.routes,
        contact={
            "name": "TopoShape Team",
            "email": "api@toposhape.io",
            "url": "https://toposhape.io"
        },
        license_info={
            "name": "MIT",
            "url": "https://opensource.org/licenses/MIT"
        },
        servers=[
            {"url": "https://api.toposhape.io", "description": "Production"},
            {"url": "http://localhost:8000", "description": "Development"}
        ],
        tags=[
            {
                "name": "Authentication",
                "description": "User authentication and token management"
            },
            {
                "name": "TDA Analysis",
                "description": "Topological data analysis endpoints"
            },
            {
                "name": "Users",
                "description": "User profile management"
            },
            {
                "name": "Webhooks",
                "description": "Webhook registration and management"
            }
        ]
    )
    
    # Add security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "Bearer Auth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT token in the format: Bearer {token}"
        }
    }
    
    # Add global security requirement
    openapi_schema["security"] = [{"BearerAuth": []}]
    
    # Add example schemas
    openapi_schema["components"]["schemas"]["PersistencePoint"] = {
        "type": "object",
        "properties": {
            "id": {"type": "string", "example": "feature-1"},
            "birth": {"type": "number", "example": 0.0},
            "death": {"type": "number", "example": 1.234},
            "dimension": {"type": "integer", "example": 0, "minimum": 0, "maximum": 2}
        },
        "required": ["id", "birth", "death", "dimension"]
    }
    
    openapi_schema["components"]["schemas"]["AnomalyDetection"] = {
        "type": "object",
        "properties": {
            "timestamp": {"type": "string", "format": "date-time"},
            "total_score": {"type": "number", "minimum": 0},
            "wasserstein_score": {"type": "number"},
            "landscape_score": {"type": "number"},
            "statistical_score": {"type": "number"},
            "confidence": {"type": "number", "minimum": 0, "maximum": 1},
            "is_anomaly": {"type": "boolean"}
        }
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


def setup_openapi(app: FastAPI):
    """Setup OpenAPI documentation for FastAPI app"""
    app.openapi = lambda: custom_openapi(app)
