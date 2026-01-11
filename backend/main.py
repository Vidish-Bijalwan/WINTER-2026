from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from contextlib import asynccontextmanager

# Import internal modules
from .database.connection import db_connection
from .middleware.auth_middleware import AuthMiddleware
from .api.routes import auth, anomalies, users

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("topoforge")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await db_connection.connect()
    from .database.indexes import create_indexes
    await create_indexes()
    logger.info("Database connected and indexes checked")
    yield
    # Shutdown
    await db_connection.disconnect()
    logger.info("Database disconnected")

app = FastAPI(title="TopoForge Intelligence Engine", lifespan=lifespan)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Middleware
app.add_middleware(AuthMiddleware)

# Rate Limiting
from .middleware.rate_limiter import limiter
from slowapi.middleware import SlowAPIMiddleware
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

from .api.routes import auth, anomalies, users, realtime, password_reset
# Include Routers
app.include_router(auth.router)
app.include_router(password_reset.router)
app.include_router(anomalies.router)
app.include_router(users.router)
app.include_router(realtime.router)

# WebSocket Connection Manager (Preserved/Refined)
from typing import List
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# Initialize Processor
from .core.processor import DataProcessor
processor = DataProcessor(window_size=50)

@app.get("/")
async def root():
    return {"status": "online", "system": "TopoForge AI Core"}

@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                event = json.loads(data_text)
                processor.ingest(event)
                
                # Run analysis
                result = await processor.process_window()
                
                response = {
                    "type": "analysis",
                    "data": result,
                    "original_event": event
                }
                
                # Broadcast via WebSocket
                await websocket.send_text(json.dumps(response))
                
                # Broadcast via SSE if anomaly
                if result.get("is_anomaly"):
                    await realtime.broadcast_event(result)
                
            except json.JSONDecodeError:
                pass
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/api/ingest")
async def ingest_data(data: dict):
    processor.ingest(data)
    result = await processor.process_window()
    return result

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "detail": str(exc)},
    )
