from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class AnomalyLogSchema(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    source_type: str
    event_data: Dict[str, Any]
    betti_h0: Optional[int] = 0
    betti_h1: Optional[int] = 0
    betti_h2: Optional[int] = 0
    anomaly_score: float
    is_anomaly: bool
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "source_type": "twitter",
                "event_data": {"text": "Suspicious tweet content"},
                "anomaly_score": 0.95,
                "is_anomaly": True
            }
        }

class UserSchema(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    organization: Optional[str] = None
    role: str = "viewer"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class UserCreateSchema(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: Optional[str] = Field(None, max_length=100)
    organization: Optional[str] = Field(None, max_length=100)
    role: str = "viewer"

class UserInDB(UserSchema):
    hashed_password: str

class AlertConfigSchema(BaseModel):
    user_id: str
    threshold: float
    notification_channels: List[str]
    is_active: bool = True
