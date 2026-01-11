from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any
from ...database.models import SourceModel
from pydantic import BaseModel

router = APIRouter(prefix="/api/sources", tags=["Sources"])
source_model = SourceModel()

class SourceSchema(BaseModel):
    name: str
    type: str
    url: str
    description: str = ""
    active: bool = True

@router.get("/")
async def get_sources():
    sources = await source_model.get_all_sources()
    # Convert ObjectId to str
    for source in sources:
        source["id"] = str(source["_id"])
        del source["_id"]
    return sources

@router.post("/")
async def create_source(source: SourceSchema):
    source_id = await source_model.create_source(source.model_dump())
    return {"id": source_id, **source.model_dump()}

@router.delete("/{id}")
async def delete_source(id: str):
    count = await source_model.delete_source(id)
    if count == 0:
        raise HTTPException(status_code=404, detail="Source not found")
    return {"status": "deleted"}
