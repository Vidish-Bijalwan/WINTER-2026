import logging
import sys
import json
import os
from datetime import datetime
from typing import Any, Dict

class JSONFormatter(logging.Formatter):
    """
    Formatter that outputs JSON strings after parsing the LogRecord.
    """
    def format(self, record: logging.LogRecord) -> str:
        log_object: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
            "path": record.pathname,
        }
        
        if hasattr(record, "request_id"):
            log_object["request_id"] = record.request_id  # type: ignore
            
        if hasattr(record, "user_id"):
            log_object["user_id"] = record.user_id  # type: ignore
            
        if record.exc_info:
            log_object["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_object)

def setup_logger(name: str) -> logging.Logger:
    """
    Setup a logger with JSON formatting and file rotation
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(JSONFormatter())
    logger.addHandler(console_handler)
    
    # File handler (if log directory exists)
    log_dir = "logs"
    if os.path.exists(log_dir):
        from logging.handlers import RotatingFileHandler
        file_handler = RotatingFileHandler(
            os.path.join(log_dir, "topoforge.log"),
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        file_handler.setFormatter(JSONFormatter())
        logger.addHandler(file_handler)
        
    return logger

# Create global logger instance
logger = setup_logger("topoforge")
