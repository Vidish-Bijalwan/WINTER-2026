from .connection import db_connection
import pymongo

async def create_indexes():
    db = db_connection.get_database()
    
    # Anomaly Logs
    await db.anomalies.create_index(
        [("timestamp", pymongo.DESCENDING), ("source_type", pymongo.ASCENDING)]
    )
    
    # Users
    await db.users.create_index("email", unique=True)
    
    # Sessions (TTL)
    await db.sessions.create_index("expires_at", expireAfterSeconds=0)
    
    # Alert Configs
    await db.alert_configs.create_index("user_id")
    
    print("Indexes created successfully")
