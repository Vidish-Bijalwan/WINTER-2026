import time
from typing import Dict
import jwt
from decouple import config
import os

JWT_SECRET = config("JWT_SECRET", default=os.getenv("JWT_SECRET", "secret"))
JWT_ALGORITHM = config("JWT_ALGORITHM", default="HS256")

def token_response(token: str):
    return {
        "access_token": token
    }

def create_access_token(user_id: str, username: str, role: str) -> Dict[str, str]:
    payload = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "expires": time.time() + 86400  # 24 hours
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token_response(token)

def decode_access_token(token: str) -> Dict:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token["expires"] >= time.time() else None
    except:
        return None

def create_refresh_token(user_id: str) -> Dict[str, str]:
    # Simplified refresh token
    payload = {
        "user_id": user_id,
        "expires": time.time() + 604800  # 7 days
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"refresh_token": token}
