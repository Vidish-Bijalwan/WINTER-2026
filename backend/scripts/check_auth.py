import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

# Load env
load_dotenv()

# Password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

async def check_auth(username_or_email, password):
    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri:
        print("❌ MONGODB_URI missing")
        return

    client = AsyncIOMotorClient(mongo_uri)
    db = client[os.getenv("DATABASE_NAME", "topoforge")]
    users = db.users

    print(f"Checking auth for: {username_or_email}")
    
    # Find user
    user = await users.find_one({"email": username_or_email})
    if not user:
        user = await users.find_one({"username": username_or_email})
    
    if not user:
        print("❌ User not found")
        return

    print(f"✅ User found: {user.get('username')} (ID: {user.get('_id')})")
    
    # Verify password
    hashed = user.get("hashed_password")
    if not hashed:
        print("❌ No hashed password found on user document")
        return

    is_valid = verify_password(password, hashed)
    if is_valid:
        print("✅ Password verification SUCCESS")
    else:
        print("❌ Password verification FAILED")

    client.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python check_auth.py <username/email> <password>")
    else:
        asyncio.run(check_auth(sys.argv[1], sys.argv[2]))
