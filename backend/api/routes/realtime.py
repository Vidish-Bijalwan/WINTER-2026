from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
import asyncio
from typing import List

router = APIRouter(prefix="/api/realtime", tags=["Realtime"])

# Global event queue for broadcasting (simplified)
# In production, use Redis or similar
event_queue: List[asyncio.Queue] = []

@router.get("/stream")
async def message_stream(request):
    queue = asyncio.Queue()
    event_queue.append(queue)
    
    async def event_generator():
        try:
            while True:
                # If client closes connection, stop
                if await request.is_disconnected():
                    break
                
                # Get message from queue
                data = await queue.get()
                yield {
                    "event": "anomaly",
                    "data": data
                }
        except asyncio.CancelledError:
            pass
        finally:
            event_queue.remove(queue)

    return EventSourceResponse(event_generator())

async def broadcast_event(data: dict):
    for queue in event_queue:
        await queue.put(data)
