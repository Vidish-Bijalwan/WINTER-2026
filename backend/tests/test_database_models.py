"""
Unit tests for database models and operations
Tests CRUD operations for User and AnomalyLog models
"""
import pytest
from datetime import datetime


@pytest.mark.asyncio
async def test_create_user(mock_db):
    """Test creating a new user"""
    collection = mock_db.get_collection("users")
    
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "hashed_password": "hashed_password_123",
        "role": "viewer",
        "created_at": datetime.utcnow()
    }
    
    result = await collection.insert_one(user_data)
    assert result.inserted_id is not None
    
    # Verify user was created
    found_user = await collection.find_one({"email": "test@example.com"})
    assert found_user is not None
    assert found_user["username"] == "testuser"
    assert found_user["role"] == "viewer"


@pytest.mark.asyncio
async def test_find_user_by_email(mock_db):
    """Test finding user by email"""
    collection = mock_db.get_collection("users")
    
    # Insert test user
    await collection.insert_one({
        "username": "findme",
        "email": "findme@example.com",
        "hashed_password": "hash123",
        "role": "viewer"
    })
    
    # Find user
    user = await collection.find_one({"email": "findme@example.com"})
    
    assert user is not None
    assert user["username"] == "findme"


@pytest.mark.asyncio
async def test_find_user_by_username(mock_db):
    """Test finding user by username"""
    collection = mock_db.get_collection("users")
    
    # Insert test user
    await collection.insert_one({
        "username": "uniqueuser",
        "email": "unique@example.com",
        "hashed_password": "hash123",
        "role": "admin"
    })
    
    # Find user
    user = await collection.find_one({"username": "uniqueuser"})
    
    assert user is not None
    assert user["role"] == "admin"


@pytest.mark.asyncio
async def test_update_user_profile(mock_db):
    """Test updating user profile"""
    collection = mock_db.get_collection("users")
    
    # Insert user
    result = await collection.insert_one({
        "username": "updateme",
        "email": "update@example.com",
        "hashed_password": "hash123",
        "role": "viewer"
    })
    user_id = result.inserted_id
    
    # Update user
    await collection.update_one(
        {"_id": user_id},
        {"$set": {"username": "updated", "email": "updated@example.com"}}
    )
    
    # Verify update
    updated_user = await collection.find_one({"_id": user_id})
    assert updated_user["username"] == "updated"
    assert updated_user["email"] == "updated@example.com"


@pytest.mark.asyncio
async def test_delete_user(mock_db):
    """Test deleting a user"""
    collection = mock_db.get_collection("users")
    
    # Insert user
    result = await collection.insert_one({
        "username": "deleteme",
        "email": "delete@example.com",
        "hashed_password": "hash123",
        "role": "viewer"
    })
    user_id = result.inserted_id
    
    # Delete user
    delete_result = await collection.delete_one({"_id": user_id})
    assert delete_result.deleted_count == 1
    
    # Verify deletion
    deleted_user = await collection.find_one({"_id": user_id})
    assert deleted_user is None


@pytest.mark.asyncio
async def test_create_anomaly_log(mock_db):
    """Test creating anomaly log entry"""
    collection = mock_db.get_collection("anomaly_logs")
    
    anomaly_data = {
        "timestamp": datetime.utcnow(),
        "source_type": "wikipedia",
        "event_data": {
            "title": "Test Page",
            "user": "editor1",
            "change_size": 150
        },
        "betti_h0": 5,
        "betti_h1": 2,
        "betti_h2": 0,
        "anomaly_score": 0.85,
        "is_anomaly": True,
        "metadata": {
            "cluster_id": "cluster_123",
            "detection_latency_ms": 45
        }
    }
    
    result = await collection.insert_one(anomaly_data)
    assert result.inserted_id is not None
    
    # Verify creation
    found_anomaly = await collection.find_one({"_id": result.inserted_id})
    assert found_anomaly is not None
    assert found_anomaly["source_type"] == "wikipedia"
    assert found_anomaly["is_anomaly"] is True


@pytest.mark.asyncio
async def test_get_anomalies_by_timeframe(mock_db):
    """Test retrieving anomalies within a timeframe"""
    collection = mock_db.get_collection("anomaly_logs")
    
    # Insert multiple anomalies with different timestamps
    now = datetime.utcnow()
    anomalies = [
        {
            "timestamp": now,
            "source_type": "wikipedia",
            "event_data": {},
            "betti_h0": 5,
            "betti_h1": 2,
            "betti_h2": 0,
            "anomaly_score": 0.8,
            "is_anomaly": True
        }
        for _ in range(5)
    ]
    
    for anomaly in anomalies:
        await collection.insert_one(anomaly)
    
    # Query anomalies
    count = await collection.count_documents({"is_anomaly": True})
    assert count >= 5


@pytest.mark.asyncio
async def test_get_anomalies_only_filter(mock_db):
    """Test filtering only anomalous events"""
    collection = mock_db.get_collection("anomaly_logs")
    
    # Insert mix of anomalies and normal events
    await collection.insert_one({
        "timestamp": datetime.utcnow(),
        "source_type": "github",
        "event_data": {},
        "betti_h0": 10,
        "betti_h1": 3,
        "betti_h2": 1,
        "anomaly_score": 0.9,
        "is_anomaly": True
    })
    
    await collection.insert_one({
        "timestamp": datetime.utcnow(),
        "source_type": "github",
        "event_data": {},
        "betti_h0": 5,
        "betti_h1": 1,
        "betti_h2": 0,
        "anomaly_score": 0.3,
        "is_anomaly": False
    })
    
    # Count only anomalies
    anomaly_count = await collection.count_documents({"is_anomaly": True})
    assert anomaly_count >= 1


@pytest.mark.asyncio
async def test_get_anomalies_by_source(mock_db):
    """Test retrieving anomalies by source type"""
    collection = mock_db.get_collection("anomaly_logs")
    
    # Insert anomalies from different sources
    for source in ["wikipedia", "twitter", "github"]:
        await collection.insert_one({
            "timestamp": datetime.utcnow(),
            "source_type": source,
            "event_data": {},
            "betti_h0": 5,
            "betti_h1": 2,
            "betti_h2": 0,
            "anomaly_score": 0.7,
            "is_anomaly": True
        })
    
    # Query by source
    wikipedia_count = await collection.count_documents({"source_type": "wikipedia"})
    assert wikipedia_count >= 1


@pytest.mark.asyncio
async def test_update_anomaly_log(mock_db):
    """Test updating anomaly log entry"""
    collection = mock_db.get_collection("anomaly_logs")
    
    # Insert anomaly
    result = await collection.insert_one({
        "timestamp": datetime.utcnow(),
        "source_type": "wikipedia",
        "event_data": {},
        "betti_h0": 5,
        "betti_h1": 2,
        "betti_h2": 0,
        "anomaly_score": 0.8,
        "is_anomaly": False
    })
    anomaly_id = result.inserted_id
    
    # Update anomaly status
    await collection.update_one(
        {"_id": anomaly_id},
        {"$set": {"is_anomaly": True, "anomaly_score": 0.95}}
    )
    
    # Verify update
    updated_anomaly = await collection.find_one({"_id": anomaly_id})
    assert updated_anomaly["is_anomaly"] is True
    assert updated_anomaly["anomaly_score"] == 0.95


@pytest.mark.asyncio
async def test_delete_anomaly_log(mock_db):
    """Test deleting anomaly log entry"""
    collection = mock_db.get_collection("anomaly_logs")
    
    # Insert anomaly
    result = await collection.insert_one({
        "timestamp": datetime.utcnow(),
        "source_type": "twitter",
        "event_data": {},
        "betti_h0": 7,
        "betti_h1": 3,
        "betti_h2": 1,
        "anomaly_score": 0.6,
        "is_anomaly": False
    })
    anomaly_id = result.inserted_id
    
    # Delete anomaly
    delete_result = await collection.delete_one({"_id": anomaly_id})
    assert delete_result.deleted_count == 1
    
    # Verify deletion
    deleted_anomaly = await collection.find_one({"_id": anomaly_id})
    assert deleted_anomaly is None
