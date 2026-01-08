from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os
from dotenv import load_dotenv
import logging

load_dotenv()

class MongoDBConnection:
    _instance: Optional["MongoDBConnection"] = None
    
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db_name = os.getenv("DATABASE_NAME", "topoforge")
        self.logger = logging.getLogger("topoforge.database")

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    async def connect(self):
        """Create database connection."""
        try:
            mongo_uri = os.getenv("MONGODB_URI")
            if not mongo_uri:
                self.logger.warning("MONGODB_URI not found in environment variables")
                return

            self.client = AsyncIOMotorClient(
                mongo_uri,
                minPoolSize=10,
                maxPoolSize=50
            )
            # Test connection
            await self.client.admin.command('ping')
            self.logger.info("Successfully connected to MongoDB")
            print("Successfully connected to MongoDB")
        except Exception as e:
            self.logger.error(f"Error connecting to MongoDB: {e}")
            print(f"Error connecting to MongoDB: {e}")
            raise e

    async def disconnect(self):
        """Close database connection."""
        if self.client:
            self.client.close()
            self.logger.info("Disconnected from MongoDB")

    def get_database(self):
        """Get database instance."""
        if self.client is None:
            raise Exception("Database not initialized. Call connect() first.")
        return self.client[self.db_name]

# Global instance
db_connection = MongoDBConnection.get_instance()
