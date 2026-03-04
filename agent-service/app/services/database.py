import time
from typing import Any, Optional
import asyncpg
from app.config import settings


class DatabaseService:
    """Service for executing SQL queries against data sources."""

    def __init__(self):
        self._connection_pool: Optional[asyncpg.Pool] = None

    async def get_pool(self) -> asyncpg.Pool:
        """Get or create connection pool."""
        if self._connection_pool is None:
            self._connection_pool = await asyncpg.create_pool(
                settings.database_url,
                min_size=5,
                max_size=20,
            )
        return self._connection_pool

    async def execute_query(
        self,
        data_source_id: str,
        sql: str,
    ) -> dict[str, Any]:
        """Execute a SQL query and return results."""
        start_time = time.time()

        # TODO: Get connection config from data source
        # For now, use default database
        pool = await self.get_pool()

        async with pool.acquire() as conn:
            # Execute query
            records = await conn.fetch(sql)

            # Get column names
            if records:
                columns = list(records[0].keys())
                rows = [dict(r) for r in records]
            else:
                columns = []
                rows = []

        execution_time = time.time() - start_time

        return {
            "columns": columns,
            "rows": rows,
            "row_count": len(rows),
            "execution_time": execution_time,
        }

    async def test_connection(
        self,
        host: str,
        port: int,
        database: str,
        username: str,
        password: str,
    ) -> dict[str, Any]:
        """Test database connection."""
        try:
            conn = await asyncpg.connect(
                host=host,
                port=port,
                database=database,
                user=username,
                password=password,
                timeout=10,
            )

            # Get list of tables
            tables = await conn.fetch(
                """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                ORDER BY table_name
                """
            )

            await conn.close()

            return {
                "success": True,
                "tables": [t["table_name"] for t in tables],
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
            }

    async def get_table_schema(
        self,
        data_source_id: str,
        table_name: str,
    ) -> dict[str, Any]:
        """Get schema information for a table."""
        pool = await self.get_pool()

        async with pool.acquire() as conn:
            # Get column information
            columns = await conn.fetch(
                """
                SELECT
                    column_name,
                    data_type,
                    is_nullable,
                    column_default
                FROM information_schema.columns
                WHERE table_name = $1
                ORDER BY ordinal_position
                """,
                table_name,
            )

            return {
                "columns": [
                    {
                        "name": c["column_name"],
                        "type": c["data_type"],
                        "nullable": c["is_nullable"] == "YES",
                        "default": c["column_default"],
                    }
                    for c in columns
                ]
            }

    async def close(self):
        """Close connection pool."""
        if self._connection_pool:
            await self._connection_pool.close()
            self._connection_pool = None


# Singleton instance
db_service = DatabaseService()
