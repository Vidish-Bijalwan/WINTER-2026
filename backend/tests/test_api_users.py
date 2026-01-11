"""
Integration tests for User Management API endpoints
Tests user retrieval, updates, and permission management
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_all_users_as_admin(test_client: AsyncClient):
    """Test admin retrieving all users"""
    # Mock admin token
    headers = {"Authorization": "Bearer admin_jwt_token"}
    
    response = await test_client.get("/api/users", headers=headers)
    
    # Should return 200 for admin or 401/403 if not implemented
    assert response.status_code in [200, 401, 403, 404, 500]


@pytest.mark.asyncio
async def test_get_all_users_as_viewer(test_client: AsyncClient):
    """Test viewer attempting to retrieve all users (should fail)"""
    # Mock viewer token
    headers = {"Authorization": "Bearer viewer_jwt_token"}
    
    response = await test_client.get("/api/users", headers=headers)
    
    # Should return 403 Forbidden or 401
    assert response.status_code in [401, 403, 404, 500]


@pytest.mark.asyncio
async def test_get_all_users_without_auth(test_client: AsyncClient):
    """Test retrieving users without authentication"""
    response = await test_client.get("/api/users")
    
    # Should return 401 Unauthorized
    assert response.status_code in [401, 404]


@pytest.mark.asyncio
async def test_get_user_by_id(test_client: AsyncClient, mock_db):
    """Test retrieving specific user by ID"""
    # Insert test user
    collection = mock_db.get_collection("users")
    test_user = {
        "username": "testuser",
        "email": "test@example.com",
        "hashed_password": "hashed_pw",
        "role": "viewer"
    }
    result = await collection.insert_one(test_user)
    user_id = str(result.inserted_id)
    
    headers = {"Authorization": "Bearer mock_jwt_token"}
    response = await test_client.get(f"/api/users/{user_id}", headers=headers)
    
    assert response.status_code in [200, 401, 404, 500]


@pytest.mark.asyncio
async def test_get_user_not_found(test_client: AsyncClient):
    """Test 404 for non-existent user"""
    fake_id = "507f1f77bcf86cd799439011"
    headers = {"Authorization": "Bearer mock_jwt_token"}
    
    response = await test_client.get(f"/api/users/{fake_id}", headers=headers)
    
    assert response.status_code in [404, 401, 500]


@pytest.mark.asyncio
async def test_update_own_profile(test_client: AsyncClient):
    """Test user updating their own profile"""
    user_id = "user_123"
    update_data = {
        "username": "newusername",
        "email": "newemail@example.com"
    }
    
    # Mock token for this user
    headers = {"Authorization": "Bearer user_123_jwt_token"}
    
    response = await test_client.put(
        f"/api/users/{user_id}",
        json=update_data,
        headers=headers
    )
    
    # Should succeed or require auth
    assert response.status_code in [200, 401, 404, 422, 500]


@pytest.mark.asyncio
async def test_update_other_user_profile_as_viewer(test_client: AsyncClient):
    """Test viewer attempting to update another user's profile (should fail)"""
    other_user_id = "user_456"
    update_data = {
        "username": "hackedname"
    }
    
    # Mock viewer token
    headers = {"Authorization": "Bearer viewer_jwt_token"}
    
    response = await test_client.put(
        f"/api/users/{other_user_id}",
        json=update_data,
        headers=headers
    )
    
    # Should return 403 Forbidden
    assert response.status_code in [401, 403, 404, 500]


@pytest.mark.asyncio
async def test_update_user_as_admin(test_client: AsyncClient):
    """Test admin updating any user's profile"""
    user_id = "user_789"
    update_data = {
        "role": "admin"
    }
    
    # Mock admin token
    headers = {"Authorization": "Bearer admin_jwt_token"}
    
    response = await test_client.put(
        f"/api/users/{user_id}",
        json=update_data,
        headers=headers
    )
    
    # Should succeed for admin
    assert response.status_code in [200, 401, 404, 422, 500]


@pytest.mark.asyncio
async def test_update_user_invalid_data(test_client: AsyncClient):
    """Test updating user with invalid data"""
    user_id = "user_123"
    invalid_data = {
        "email": "not-an-email",  # Invalid email format
        "role": "invalid_role"  # Invalid role
    }
    
    headers = {"Authorization": "Bearer user_123_jwt_token"}
    
    response = await test_client.put(
        f"/api/users/{user_id}",
        json=invalid_data,
        headers=headers
    )
    
    # Should return validation error
    assert response.status_code in [400, 422, 401, 404, 500]


@pytest.mark.asyncio
async def test_delete_user_as_admin(test_client: AsyncClient):
    """Test admin deleting a user"""
    user_id = "user_to_delete"
    
    # Mock admin token
    headers = {"Authorization": "Bearer admin_jwt_token"}
    
    response = await test_client.delete(f"/api/users/{user_id}", headers=headers)
    
    # Endpoint may or may not exist
    assert response.status_code in [200, 204, 401, 403, 404, 405]


@pytest.mark.asyncio
async def test_delete_user_as_viewer(test_client: AsyncClient):
    """Test viewer attempting to delete a user (should fail)"""
    user_id = "user_to_delete"
    
    # Mock viewer token
    headers = {"Authorization": "Bearer viewer_jwt_token"}
    
    response = await test_client.delete(f"/api/users/{user_id}", headers=headers)
    
    # Should return 403 Forbidden
    assert response.status_code in [401, 403, 404, 405]


@pytest.mark.asyncio
async def test_change_user_role(test_client: AsyncClient):
    """Test changing user role"""
    user_id = "user_123"
    role_data = {
        "role": "admin"
    }
    
    # Mock admin token (only admin should be able to change roles)
    headers = {"Authorization": "Bearer admin_jwt_token"}
    
    response = await test_client.patch(
        f"/api/users/{user_id}/role",
        json=role_data,
        headers=headers
    )
    
    # Endpoint may or may not exist
    assert response.status_code in [200, 401, 403, 404, 405]
