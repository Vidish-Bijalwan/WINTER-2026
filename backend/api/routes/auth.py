from fastapi import APIRouter, HTTPException, status, Depends
from ...database.models import UserModel
from ...database.schemas import UserCreateSchema, UserSchema, UserInDB
from ...auth.password_utils import hash_password, verify_password
from ...auth.jwt_handler import create_access_token, create_refresh_token
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
user_model = UserModel()

@router.post("/register", response_model=UserSchema)
async def register(user: UserCreateSchema):
    existing_user = await user_model.get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.model_dump()
    user_dict["hashed_password"] = hash_password(user_dict.pop("password"))
    user_dict["created_at"] = datetime.utcnow()
    
    user_id = await user_model.create_user(user_dict)
    
    # Return created user
    return {**user_dict, "id": str(user_id)}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await user_model.get_user_by_email(form_data.username) # Using username field as email
    # If using username as username, change this. Schema has email and username.
    # Usually OAuth2 form uses 'username' field which can be email.
    
    # Try finding by username if email fails
    if not user:
         # Implementation specific: Assuming login by EMAIL for now based on typical flows, 
         # but form_data.username contains the input
         pass
    
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    access_token = create_access_token(str(user["_id"]), user["username"], user["role"])
    
    return access_token

@router.get("/me")
async def get_current_user_profile():
    # Placeholder: requires dependency to get user from request
    return {"msg": "User profile"}
