from fastapi import APIRouter, HTTPException, status, Depends
from ...database.models import UserModel
from ...database.schemas import UserCreateSchema, UserSchema, UserInDB
from ...auth.password_utils import hash_password, verify_password
from ...auth.jwt_handler import create_access_token, create_refresh_token
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime
from typing import Dict, Any

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
user_model = UserModel()

@router.post("/register", response_model=Dict[str, Any])
async def register(user: UserCreateSchema):
    # Check if email already exists
    existing_user = await user_model.get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_username = await user_model.get_user_by_username(user.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Username already taken"
        )
    
    # Create user document
    user_dict = user.model_dump()
    user_dict["hashed_password"] = hash_password(user_dict.pop("password"))
    user_dict["created_at"] = datetime.utcnow()
    user_dict["last_login"] = datetime.utcnow()
    user_dict["is_verified"] = False
    
    # Generate verification token
    import secrets
    verification_token = secrets.token_urlsafe(32)
    user_dict["verification_token"] = verification_token
    
    user_id = await user_model.create_user(user_dict)
    
    # Send verification email
    from ...services.email_service import send_verification_email
    await send_verification_email(user.email, verification_token)
    
    # Create access token
    token_data = create_access_token(str(user_id), user.username, user.role)
    
    # Return user data with token
    return {
        "access_token": token_data["access_token"],
        "token_type": "bearer",
        "user": {
            "id": str(user_id),
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "organization": user.organization,
            "role": user.role,
            "is_verified": False
        },
        "message": "Registration successful. Please check your email to verify your account."
    }

@router.get("/verify-email")
async def verify_email(token: str):
    """
    Verify user email address
    """
    from ...database.connection import db_connection
    database = db_connection.get_database()
    user = await database["users"].find_one({"verification_token": token})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
        
    await database["users"].update_one(
        {"_id": user["_id"]},
        {
            "$set": {"is_verified": True},
            "$unset": {"verification_token": ""}
        }
    )
    
    return {"message": "Email verified successfully", "success": True}

@router.post("/bypass-login")
async def bypass_login():
    """
    Bypass login for development. Creates/Gets a 'bypass' user and returns token.
    """
    # Check if bypass user exists
    user = await user_model.get_user_by_email("bypass@example.com")
    
    if not user:
        # Create bypass user
        user_dict = {
            "username": "bypass_user",
            "email": "bypass@example.com",
            "full_name": "Bypass User",
            "organization": "Dev Corp",
            "role": "admin",
            "hashed_password": hash_password("bypass"), # dummy
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow(),
            "is_verified": True
        }
        user_id = await user_model.create_user(user_dict)
        user = await user_model.get_user_by_id(user_id)
    else:
        # Update last login
        await user_model.update_last_login(str(user["_id"]))
    
    # Create access token
    token_data = create_access_token(
        str(user["_id"]), 
        user["username"], 
        user.get("role", "admin")
    )
    
    # Return token and user data
    return {
        "access_token": token_data["access_token"],
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "full_name": user.get("full_name"),
            "organization": user.get("organization"),
            "role": user.get("role", "admin")
        }
    }

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Try to find user by email first, then by username
    user = await user_model.get_user_by_email(form_data.username)
    
    if not user:
        # Try finding by username
        user = await user_model.get_user_by_username(form_data.username)
    
    # Verify user exists and password is correct
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Update last login
    await user_model.update_last_login(str(user["_id"]))
    
    # Create access token
    token_data = create_access_token(
        str(user["_id"]), 
        user["username"], 
        user.get("role", "viewer")
    )
    
    # Return token and user data
    return {
        "access_token": token_data["access_token"],
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"],
            "full_name": user.get("full_name"),
            "organization": user.get("organization"),
            "role": user.get("role", "viewer")
        }
    }

@router.get("/me")
async def get_current_user_profile():
    # This will be implemented with JWT authentication middleware
    # For now, return placeholder
    return {"msg": "User profile endpoint - requires authentication middleware"}

