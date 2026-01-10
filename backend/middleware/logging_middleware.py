import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from backend.utils.logger import logger

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        start_time = time.time()
        
        # Log request
        logger.info(
            f"Incoming request: {request.method} {request.url.path}",
            extra={
                "request_id": request_id, 
                "method": request.method,
                "path": request.url.path,
                "query_params": str(request.query_params),
                "client_ip": request.client.host if request.client else "unknown"
            }
        )
        
        try:
            response = await call_next(request)
            
            # Calculate duration
            process_time = (time.time() - start_time) * 1000
            
            # Log response
            log_level = "info"
            if response.status_code >= 500:
                log_level = "error"
            elif response.status_code >= 400:
                log_level = "warning"
                
            log_message = f"Request completed: {response.status_code} in {process_time:.2f}ms"
            
            getattr(logger, log_level)(
                log_message,
                extra={
                    "request_id": request_id,
                    "status_code": response.status_code,
                    "duration_ms": process_time
                }
            )
            
            response.headers["X-Request-ID"] = request_id
            return response
            
        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"Request failed: {str(e)}",
                extra={
                    "request_id": request_id,
                    "duration_ms": process_time,
                    "error": str(e)
                },
                exc_info=True
            )
            raise
