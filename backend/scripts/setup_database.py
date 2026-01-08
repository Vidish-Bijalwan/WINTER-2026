import asyncio
import os
import sys

# Add parent directory to path to import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connection import db_connection
from database.indexes import create_indexes
from database.models import UserModel
from auth.password_utils import hash_password

async def setup():
    await db_connection.connect()
    
    print("Creating indexes...")
    await create_indexes()
    
    # Create admin user
    user_model = UserModel()
    admin_email = "admin@topoforge.com"
    existing = await user_model.get_user_by_email(admin_email)
    
    if not existing:
        print("Creating admin user...")
        await user_model.create_user({
            "username": "admin",
            "email": admin_email,
            "hashed_password": hash_password("admin123"),
            "role": "admin",
            "created_at": "2024-01-01T00:00:00"
        })
        print("Admin user created")
    else:
        print("Admin user already exists")
        
    await db_connection.disconnect()

if __name__ == "__main__":
    asyncio.run(setup())
