from prometheus_fastapi_instrumentator import Instrumentator
from fastapi import FastAPI

def setup_metrics(app: FastAPI):
    """
    Setup Prometheus metrics for the FastAPI application
    """
    instrumentator = Instrumentator(
        should_group_status_codes=True,
        should_ignore_untemplated=True,
        should_instrument_requests_inprogress=True,
        excluded_handlers=["/metrics", "/docs", "/openapi.json"],
        env_var_name="ENABLE_METRICS",
        inprogress_name="inprogress",
        inprogress_labels=True,
    )
    
    # Add custom metrics here if needed
    # instrumentator.add(...)
    
    instrumentator.instrument(app).expose(app)
