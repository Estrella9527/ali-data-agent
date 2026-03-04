from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any

from app.services.database import DatabaseService

router = APIRouter()


class QueryRequest(BaseModel):
    dataSourceId: str
    sql: str


class QueryResponse(BaseModel):
    columns: list[str]
    rows: list[dict[str, Any]]
    rowCount: int
    executionTime: float


@router.post("/query", response_model=QueryResponse)
async def execute_query(request: QueryRequest):
    """Execute a SQL query against a data source."""
    try:
        db_service = DatabaseService()

        result = await db_service.execute_query(
            data_source_id=request.dataSourceId,
            sql=request.sql,
        )

        return QueryResponse(
            columns=result["columns"],
            rows=result["rows"],
            rowCount=result["row_count"],
            executionTime=result["execution_time"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
