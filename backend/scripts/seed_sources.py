"""
Seed script to populate data sources from sources_seed_data.py
Run: python -m backend.scripts.seed_sources
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from backend.database.connection import db_connection
from backend.scripts.sources_seed_data import SOURCES_DATA


async def seed_sources():
    """Populate the sources collection with initial data"""
    try:
        await db_connection.connect()
        db = db_connection.get_database()
        sources_collection = db["sources"]
        
        # Clear existing sources (optional - comment out to keep existing)
        # await sources_collection.delete_many({})
        
        # Insert sources
        inserted_count = 0
        for source in SOURCES_DATA:
            # Check if source already exists (by name)
            existing = await sources_collection.find_one({"name": source["name"]})
            if not existing:
                await sources_collection.insert_one(source)
                inserted_count += 1
                print(f"✓ Added: {source['name']}")
            else:
                print(f"⊘ Skipped (exists): {source['name']}")
        
        print(f"\n✓ Seed completed! Added {inserted_count} new sources.")
        print(f"Total sources in database: {await sources_collection.count_documents({})}")
        
    except Exception as e:
        print(f"✗ Error seeding sources: {e}")
        raise
    finally:
        await db_connection.disconnect()


if __name__ == "__main__":
    asyncio.run(seed_sources())
