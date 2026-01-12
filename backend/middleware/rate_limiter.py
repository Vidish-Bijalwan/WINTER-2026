"""
Rate limiting middleware for API endpoints
Prevents brute force attacks and API abuse
"""
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Create rate limiter instance
limiter = Limiter(key_func=get_remote_address)

# Rate limit configurations
RATE_LIMITS = {
    "auth_login": "5/15minutes",  # 5 attempts per 15 minutes
    "auth_register": "3/hour",     # 3 registrations per hour
    "default": "100/minute",       # Default rate limit for other routes
}

def get_rate_limit(limit_key: str) -> str:
    """Get rate limit for specific endpoint"""
    return RATE_LIMITS.get(limit_key, RATE_LIMITS["default"])
