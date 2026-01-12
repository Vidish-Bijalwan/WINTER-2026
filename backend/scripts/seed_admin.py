"""
Seed script to create default admin user for TopoForge platform.
Run this script to initialize the database with an admin account.
"""
from database.models import UserModel
from database.connection import db_connection
from auth.password_utils import hash_password
from datetime import datetime
import asyncio
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

async def seed_admin_user():
    """Create default admin user if not exists."""
    
    print("🌱 Seeding database with admin user...")
    
    # Connect to database
    await db_connection.connect()
    
    user_model = UserModel()
    
    # Check if admin already exists
    existing_admin = await user_model.get_user_by_username("admin")
    
    if existing_admin:
        print("⚠️  Admin user already exists. Skipping...")
        await db_connection.disconnect()
        return
    
    # Create admin user
    admin_data = {
        "username": "admin",
        "email": "admin@toposhape.com",
        "hashed_password": hash_password("tda2024"),
        "full_name": "System Administrator",
        "organization": "TopoShape Insights",
        "role": "admin",
        "created_at": datetime.utcnow(),
        "last_login": None
    }
    
    user_id = await user_model.create_user(admin_data)
    
    print(f"✅ Admin user created successfully!")
    print(f"   ID: {user_id}")
    print(f"   Username: admin")
    print(f"   Password: tda2024")
    print(f"   Email: admin@toposhape.com")
    print(f"\n⚠️  Please change the default password after first login!")
    
    # Close database connection
    await db_connection.disconnect()

if __name__ == "__main__":
    asyncio.run(seed_admin_user())
