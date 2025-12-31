from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import logging
from typing import List

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("topoforge")

from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI(title="TopoForge Intelligence Engine")

# Setup Prometheus Instrumentation
Instrumentator().instrument(app).expose(app)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket Connection Manager
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
from core.processor import DataProcessor
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
                
                # Run analysis every 5 events or so to avoid overload
                # In production, run this async in background
                result = processor.process_window()
                
                response = {
                    "type": "analysis",
                    "data": result,
                    "original_event": event
                }
                await websocket.send_text(json.dumps(response))
                
            except json.JSONDecodeError:
                pass
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/api/ingest")
async def ingest_data(data: dict):
    processor.ingest(data)
    result = processor.process_window()
    return result
