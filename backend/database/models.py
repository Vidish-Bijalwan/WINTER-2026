from .connection import db_connection
from datetime import datetime
from typing import List, Optional, Dict, Any
from bson import ObjectId

class AnomalyLogModel:
    def __init__(self):
        self.collection_name = "anomalies"

    async def create_log(self, data: Dict[str, Any]):
        database = db_connection.get_database()
        result = await database[self.collection_name].insert_one(data)
        return str(result.inserted_id)

    async def get_logs_by_timeframe(self, start_date: datetime, end_date: datetime):
        database = db_connection.get_database()
        cursor = database[self.collection_name].find({
            "timestamp": {"$gte": start_date, "$lte": end_date}
        })
        return await cursor.to_list(length=None)

    async def get_anomalies_only(self):
        database = db_connection.get_database()
        cursor = database[self.collection_name].find({"is_anomaly": True})
        return await cursor.to_list(length=None)

    async def get_all_logs(self):
        database = db_connection.get_database()
        cursor = database[self.collection_name].find().sort("timestamp", -1)
        return await cursor.to_list(length=None)

    def get_all_logs_cursor(self):
        database = db_connection.get_database()
        return database[self.collection_name].find().sort("timestamp", -1)

class UserModel:
    def __init__(self):
        self.collection_name = "users"

    async def create_user(self, user_data: Dict[str, Any]):
        database = db_connection.get_database()
        result = await database[self.collection_name].insert_one(user_data)
        return str(result.inserted_id)

    async def get_user_by_email(self, email: str):
        database = db_connection.get_database()
        return await database[self.collection_name].find_one({"email": email})
    
    async def get_user_by_username(self, username: str):
        database = db_connection.get_database()
        return await database[self.collection_name].find_one({"username": username})
        
    async def get_user_by_id(self, user_id: str):
        database = db_connection.get_database()
        try:
             return await database[self.collection_name].find_one({"_id": ObjectId(user_id)})
        except:
            return None

    async def get_all_users(self):
        database = db_connection.get_database()
        cursor = database[self.collection_name].find()
        return await cursor.to_list(length=None)

    async def update_profile(self, user_id: str, update_data: Dict[str, Any]):
        database = db_connection.get_database()
        result = await database[self.collection_name].update_one(
            {"_id": ObjectId(user_id)}, {"$set": update_data}
        )
        return result.modified_count
    
    async def update_last_login(self, user_id: str):
        database = db_connection.get_database()
        result = await database[self.collection_name].update_one(
            {"_id": ObjectId(user_id)}, 
            {"$set": {"last_login": datetime.utcnow()}}
        )
        return result.modified_count

class AlertConfigModel:
    def __init__(self):
        self.collection_name = "alert_configs"

    async def create_config(self, config_data: Dict[str, Any]):
        database = db_connection.get_database()
        result = await database[self.collection_name].insert_one(config_data)
        return str(result.inserted_id)

    async def get_user_configs(self, user_id: str):
        database = db_connection.get_database()
        cursor = database[self.collection_name].find({"user_id": user_id})
        return await cursor.to_list(length=None)
    
    async def update_config(self, config_id: str, update_data: Dict[str, Any]):
        database = db_connection.get_database()
        result = await database[self.collection_name].update_one(
            {"_id": ObjectId(config_id)}, {"$set": update_data}
        )
        return result.modified_count

class SourceModel:
    def __init__(self):
        self.collection_name = "data_sources"

    async def create_source(self, source_data: Dict[str, Any]):
        database = db_connection.get_database()
        result = await database[self.collection_name].insert_one(source_data)
        return str(result.inserted_id)

    async def get_all_sources(self):
        database = db_connection.get_database()
        cursor = database[self.collection_name].find()
        return await cursor.to_list(length=None)

    async def delete_source(self, source_id: str):
        database = db_connection.get_database()
        result = await database[self.collection_name].delete_one({"_id": ObjectId(source_id)})
        return result.deleted_count
