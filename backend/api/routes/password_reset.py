"""
Password Reset functionality
Generates secure reset tokens and handles password reset flow
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from ...database.models import UserModel
from ...auth.password_utils import hash_password
from datetime import datetime, timedelta
import secrets
import hashlib

router = APIRouter(prefix="/api/auth", tags=["Password Reset"])
user_model = UserModel()

# In-memory token storage (use Redis in production)
reset_tokens = {}

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

def generate_reset_token(email: str) -> str:
    """Generate secure password reset token"""
    token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    
    # Store token with expiration (15 minutes)
    reset_tokens[token_hash] = {
        "email": email,
        "expires_at": datetime.utcnow() + timedelta(minutes=15)
    }
    
    return token

def verify_reset_token(token: str) -> str | None:
    """Verify reset token and return email if valid"""
    token_hash = hashlib.sha256(token.encode()).hexdigest()
    
    token_data = reset_tokens.get(token_hash)
    if not token_data:
        return None
    
    # Check if token expired
    if token_data["expires_at"] < datetime.utcnow():
        del reset_tokens[token_hash]
        return None
    
    return token_data["email"]

@router.post("/forgot-password")
async def forgot_password(request: PasswordResetRequest):
    """
    Request password reset link
    In production, this would send an email with the reset link
    """
    user = await user_model.get_user_by_email(request.email)
    
    # Always return success to prevent email enumeration
    if not user:
        return {
            "message": "If the email exists, a password reset link has been sent",
            "success": True
        }
    
    # Generate reset token
    token = generate_reset_token(request.email)
    
    # TODO: Send email with reset link
    # For now, return token (ONLY FOR DEVELOPMENT)
    # In production, this should send an email and return generic success message
    
    return {
        "message": "Password reset link has been sent to your email",
        "success": True,
        # Remove this in production:
        "dev_token": token,
        "dev_reset_url": f"/reset-password?token={token}"
    }

@router.post("/reset-password")
async def reset_password(request: PasswordResetConfirm):
    """
    Reset password using valid token
    """
    # Verify token
    email = verify_reset_token(request.token)
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Find user
    user = await user_model.get_user_by_email(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User not found"
        )
    
    # Update password
    new_password_hash = hash_password(request.new_password)
    await user_model.update_profile(
        str(user["_id"]),
        {"hashed_password": new_password_hash}
    )
    
    # Invalidate token
    token_hash = hashlib.sha256(request.token.encode()).hexdigest()
    if token_hash in reset_tokens:
        del reset_tokens[token_hash]
    
    return {
        "message": "Password has been reset successfully",
        "success": True
    }

@router.get("/verify-reset-token/{token}")
async def verify_token(token: str):
    """
    Verify if a reset token is still valid
    """
    email = verify_reset_token(token)
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    return {
        "valid": True,
        "email": email
    }
