"""
Shared test fixtures and sample data generators for backend tests
"""
from datetime import datetime, timedelta
from typing import Dict, Any


def sample_user_data(
    username: str = "testuser",
    email: str = "test@example.com",
    password: str = "Password123!",
    role: str = "viewer"
) -> Dict[str, Any]:
    """Generate sample user data for testing"""
    return {
        "username": username,
        "email": email,
        "password": password,
        "role": role
    }


def sample_admin_data() -> Dict[str, Any]:
    """Generate sample admin user data"""
    return sample_user_data(
        username="admin",
        email="admin@example.com",
        password="AdminPass123!",
        role="admin"
    )


def sample_anomaly_data(
    source_type: str = "wikipedia",
    is_anomaly: bool = True,
    score: float = 0.85
) -> Dict[str, Any]:
    """Generate sample anomaly log data"""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "source_type": source_type,
        "event_data": {
            "title": "Test Page",
            "user": "test_editor",
            "change_size": 250,
            "action": "edit"
        },
        "betti_h0": 5,
        "betti_h1": 2,
        "betti_h2": 0,
        "anomaly_score": score,
        "is_anomaly": is_anomaly,
        "metadata": {
            "cluster_id": "cluster_test",
            "detection_latency_ms": 45,
            "model_version": "1.0.0"
        }
    }


def sample_wikipedia_anomaly() -> Dict[str, Any]:
    """Generate sample Wikipedia anomaly"""
    return sample_anomaly_data(source_type="wikipedia", is_anomaly=True, score=0.9)


def sample_twitter_anomaly() -> Dict[str, Any]:
    """Generate sample Twitter anomaly"""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "source_type": "twitter",
        "event_data": {
            "tweet_id": "123456789",
            "user": "test_user",
            "hashtags": ["test", "anomaly"],
            "retweet_count": 1500
        },
        "betti_h0": 8,
        "betti_h1": 3,
        "betti_h2": 1,
        "anomaly_score": 0.88,
        "is_anomaly": True,
        "metadata": {
            "cluster_id": "twitter_cluster_1",
            "detection_latency_ms": 52
        }
    }


def sample_github_anomaly() -> Dict[str, Any]:
    """Generate sample GitHub anomaly"""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "source_type": "github",
        "event_data": {
            "repo": "test/repository",
            "user": "developer1",
            "action": "push",
            "commit_count": 50
        },
        "betti_h0": 12,
        "betti_h1": 4,
        "betti_h2": 2,
        "anomaly_score": 0.92,
        "is_anomaly": True,
        "metadata": {
            "cluster_id": "github_cluster_1",
            "detection_latency_ms": 38
        }
    }


def sample_normal_event() -> Dict[str, Any]:
    """Generate sample normal (non-anomalous) event"""
    return sample_anomaly_data(
        source_type="wikipedia",
        is_anomaly=False,
        score=0.25
    )


def sample_session_data(user_id: str = "user_123") -> Dict[str, Any]:
    """Generate sample session data"""
    return {
        "user_id": user_id,
        "token": "mock_jwt_token_xyz",
        "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat(),
        "created_at": datetime.utcnow().isoformat()
    }


def sample_alert_config_data(user_id: str = "user_123") -> Dict[str, Any]:
    """Generate sample alert configuration"""
    return {
        "user_id": user_id,
        "threshold": 0.75,
        "notification_channels": ["email", "desktop"],
        "is_active": True,
        "created_at": datetime.utcnow().isoformat()
    }


def generate_batch_anomalies(count: int = 10, source: str = "wikipedia") -> list:
    """Generate a batch of sample anomalies"""
    anomalies = []
    for i in range(count):
        anomaly = sample_anomaly_data(
            source_type=source,
            is_anomaly=i % 3 == 0,  # Make every 3rd one an anomaly
            score=0.5 + (i % 5) * 0.1
        )
        # Vary timestamp
        timestamp = datetime.utcnow() - timedelta(hours=i)
        anomaly["timestamp"] = timestamp.isoformat()
        anomalies.append(anomaly)
    
    return anomalies


def mock_jwt_payload(user_id: str = "user_123", role: str = "viewer") -> Dict[str, Any]:
    """Generate mock JWT payload"""
    return {
        "user_id": user_id,
        "username": "testuser",
        "role": role,
        "exp": int((datetime.utcnow() + timedelta(hours=24)).timestamp()),
        "iat": int(datetime.utcnow().timestamp())
    }


def mock_headers_with_token(token: str = "mock_jwt_token") -> Dict[str, str]:
    """Generate authorization headers with token"""
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }


def mock_admin_headers() -> Dict[str, str]:
    """Generate authorization headers for admin user"""
    return mock_headers_with_token("admin_jwt_token")


def mock_viewer_headers() -> Dict[str, str]:
    """Generate authorization headers for viewer user"""
    return mock_headers_with_token("viewer_jwt_token")
