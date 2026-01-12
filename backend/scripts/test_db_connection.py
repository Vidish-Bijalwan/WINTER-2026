import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables
load_dotenv()

async def test_connection():
    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri:
        print("❌ Error: MONGODB_URI not found in environment variables.")
        return

    print(f"Attempting to connect to MongoDB...")
    # Mask URI for security in logs
    masked_uri = mongo_uri.split("@")[-1] if "@" in mongo_uri else "..."
    print(f"URI Host: {masked_uri}")

    try:
        client = AsyncIOMotorClient(mongo_uri, serverSelectionTimeoutMS=5000)
        # Force a connection verification
        await client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas!")
        
        # Check database access
        db_name = os.getenv("DATABASE_NAME", "topoforge")
        db = client[db_name]
        collections = await db.list_collection_names()
        print(f"✅ Database '{db_name}' accessible. Collections: {collections}")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    asyncio.run(test_connection())
