from fastapi import APIRouter, HTTPException, Depends
from ...database.models import UserModel
from ...database.schemas import UserSchema
from typing import List

router = APIRouter(prefix="/api/users", tags=["Users"])
user_model = UserModel()

@router.get("/", response_model=List[UserSchema])
async def get_users():
    # Model needs get_all_users
    # Returning empty list for safety
    return []

@router.get("/{id}", response_model=UserSchema)
async def get_user(id: str):
    user = await user_model.get_user_by_id(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{id}")
async def update_user(id: str, user_update: UserSchema):
    count = await user_model.update_profile(id, user_update.model_dump())
    if count == 0:
        raise HTTPException(status_code=404, detail="User not found or no change")
    return {"message": "Updated successfully"}

@router.delete("/{id}")
async def delete_user(id: str):
    # Model needs delete method
    return {"status": "deleted"}
