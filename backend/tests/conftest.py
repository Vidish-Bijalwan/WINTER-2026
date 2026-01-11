import pytest
import pytest_asyncio
from httpx import AsyncClient
from backend.main import app
from backend.database.connection import db_connection
import mongomock
import os
from unittest.mock import MagicMock, AsyncMock

# Helpers for Async Mongomock
# Since Motor is async and Mongomock is sync, we need to mock async calls
# This is a simplified mock. For complex queries, specialized libraries are better.

class AsyncMockCollection:
    def __init__(self, collection):
        self.collection = collection

    async def find_one(self, *args, **kwargs):
        return self.collection.find_one(*args, **kwargs)

    async def insert_one(self, *args, **kwargs):
        return self.collection.insert_one(*args, **kwargs)
        
    async def delete_one(self, *args, **kwargs):
        return self.collection.delete_one(*args, **kwargs)

    async def update_one(self, *args, **kwargs):
        return self.collection.update_one(*args, **kwargs)
        
    def find(self, *args, **kwargs):
        cursor = self.collection.find(*args, **kwargs)
        # Wrap cursor to be async-iterable
        async def async_gen():
            for doc in cursor:
                yield doc
        return async_gen()
        
    async def count_documents(self, *args, **kwargs):
        return self.collection.count_documents(*args, **kwargs)

class AsyncMockDatabase:
    def __init__(self, db):
        self.db = db
    
    def __getitem__(self, name):
        return AsyncMockCollection(self.db[name])
        
    def get_collection(self, name):
        return AsyncMockCollection(self.db[name])

@pytest.fixture
def mock_db():
    client = mongomock.MongoClient()
    db = client.test_db
    return AsyncMockDatabase(db)

@pytest_asyncio.fixture
async def test_client(mock_db):
    # Override database connection
    # We need to monkeypatch the db_connection.get_database or similar
    
    # Since db_connection.client is what's used, let's try to mock the get_database method
    # But wait, connection.py uses self.client[self.db_name]
    
    # We will override the dependency if possible, or patch global
    with pytest.MonkeyPatch.context() as m:
        # Mock the get_database method of the global implementation
        m.setattr(db_connection, "get_database", lambda: mock_db)
        
        # Also need to ensure startup event doesn't fail or try to connect to real DB
        # We can override lifespan or just patch connect
        m.setattr(db_connection, "connect", AsyncMock())
        m.setattr(db_connection, "disconnect", AsyncMock())

        async with AsyncClient(app=app, base_url="http://test") as client:
            yield client

@pytest.fixture
def sample_user_data():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "Password123!",
        "role": "viewer"
    }

@pytest.fixture
def sample_anomaly_data():
    return {
        "source": "wikipedia",
        "timestamp": "2024-01-01T00:00:00Z",
        "score": 0.9,
        "details": {"page": "Test"}
    }
