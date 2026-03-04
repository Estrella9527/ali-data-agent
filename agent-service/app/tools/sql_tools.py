from typing import Any

from app.services.database import DatabaseService


def get_sql_tools() -> list[dict]:
    """Get SQL-related tools for the agent."""
    return [
        {
            "type": "function",
            "function": {
                "name": "execute_sql",
                "description": "执行SQL查询获取数据。仅支持SELECT查询，不支持INSERT/UPDATE/DELETE等修改操作。",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "sql": {
                            "type": "string",
                            "description": "要执行的SQL SELECT查询语句",
                        },
                        "explanation": {
                            "type": "string",
                            "description": "解释这个查询的目的",
                        },
                    },
                    "required": ["sql", "explanation"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_table_schema",
                "description": "获取数据表的结构信息，包括列名、数据类型等。",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "table_name": {
                            "type": "string",
                            "description": "要查询的表名",
                        },
                    },
                    "required": ["table_name"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "list_tables",
                "description": "列出数据源中的所有可用表。",
                "parameters": {
                    "type": "object",
                    "properties": {},
                },
            },
        },
    ]


async def execute_sql_tool(
    db: DatabaseService, data_source_id: str, args: dict[str, Any]
) -> dict[str, Any]:
    """Execute the SQL tool."""
    sql = args.get("sql", "")

    # Security check - only allow SELECT
    sql_upper = sql.strip().upper()
    if not sql_upper.startswith("SELECT"):
        return {
            "error": "只允许执行 SELECT 查询",
            "columns": [],
            "rows": [],
            "rowCount": 0,
        }

    # Block dangerous keywords
    dangerous_keywords = [
        "INSERT",
        "UPDATE",
        "DELETE",
        "DROP",
        "CREATE",
        "ALTER",
        "TRUNCATE",
        "GRANT",
        "REVOKE",
    ]
    for keyword in dangerous_keywords:
        if keyword in sql_upper:
            return {
                "error": f"查询包含不允许的关键字: {keyword}",
                "columns": [],
                "rows": [],
                "rowCount": 0,
            }

    try:
        result = await db.execute_query(data_source_id, sql)
        return result
    except Exception as e:
        return {
            "error": str(e),
            "columns": [],
            "rows": [],
            "rowCount": 0,
        }


async def get_table_schema_tool(
    db: DatabaseService, data_source_id: str, args: dict[str, Any]
) -> dict[str, Any]:
    """Get table schema tool."""
    table_name = args.get("table_name", "")

    try:
        result = await db.get_table_schema(data_source_id, table_name)
        return result
    except Exception as e:
        return {"error": str(e), "columns": []}
