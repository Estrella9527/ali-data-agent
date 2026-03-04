from typing import AsyncGenerator, Optional
import json

from app.services.llm_client import LLMClient
from app.services.database import DatabaseService
from app.tools.sql_tools import get_sql_tools, execute_sql_tool


class DataAgent:
    """Main data analysis agent."""

    SYSTEM_PROMPT = """你是一个专业的数据分析助手，名为 Data Agent。你的任务是帮助用户分析数据、执行SQL查询、生成报告。

你的能力包括：
1. 理解用户的数据分析需求
2. 编写和执行SQL查询
3. 解释数据结果和发现洞察
4. 生成数据可视化建议
5. 创建分析报告

工作原则：
- 在执行任何SQL之前，先向用户确认查询意图
- 保护数据安全，不执行破坏性操作
- 用简洁清晰的语言解释分析结果
- 主动发现数据中的问题和机会

{context}

{custom_instructions}"""

    def __init__(self):
        self.llm = LLMClient()
        self.db = DatabaseService()
        self.tools = get_sql_tools()

    async def process(
        self,
        session_id: str,
        message: str,
        data_source_ids: list[str],
        context: str = "",
        custom_instructions: str = "",
    ) -> dict:
        """Process a message and return a response."""
        # Build system prompt
        system_prompt = self.SYSTEM_PROMPT.format(
            context=f"\n当前上下文:\n{context}" if context else "",
            custom_instructions=(
                f"\n自定义指示:\n{custom_instructions}" if custom_instructions else ""
            ),
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ]

        # Initial LLM call
        response = await self.llm.chat(messages, tools=self.tools)

        result = {
            "message": response["content"],
            "metadata": {
                "tokensUsed": response["usage"]["total_tokens"],
                "modelId": self.llm.model,
            },
        }

        # Handle tool calls
        if "tool_calls" in response:
            sql_queries = []
            tool_results = []

            for tool_call in response["tool_calls"]:
                if tool_call["function"]["name"] == "execute_sql":
                    args = json.loads(tool_call["function"]["arguments"])

                    # Execute SQL
                    query_result = await execute_sql_tool(
                        self.db, data_source_ids[0] if data_source_ids else "", args
                    )

                    sql_queries.append(
                        {
                            "sql": args.get("sql", ""),
                            "dataSourceId": data_source_ids[0] if data_source_ids else "",
                            "result": query_result,
                        }
                    )

                    tool_results.append(
                        {
                            "tool_call_id": tool_call["id"],
                            "role": "tool",
                            "content": json.dumps(query_result, ensure_ascii=False),
                        }
                    )

            # Continue conversation with tool results
            if tool_results:
                messages.append(
                    {
                        "role": "assistant",
                        "content": response["content"],
                        "tool_calls": response["tool_calls"],
                    }
                )
                messages.extend(tool_results)

                # Get final response
                final_response = await self.llm.chat(messages)
                result["message"] = final_response["content"]
                result["sqlQueries"] = sql_queries
                result["toolCalls"] = response["tool_calls"]
                result["metadata"]["tokensUsed"] += final_response["usage"]["total_tokens"]

        return result

    async def stream(
        self,
        session_id: str,
        message: str,
        data_source_ids: list[str],
        context: str = "",
        custom_instructions: str = "",
    ) -> AsyncGenerator[dict, None]:
        """Stream a response."""
        # Build system prompt
        system_prompt = self.SYSTEM_PROMPT.format(
            context=f"\n当前上下文:\n{context}" if context else "",
            custom_instructions=(
                f"\n自定义指示:\n{custom_instructions}" if custom_instructions else ""
            ),
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message},
        ]

        # Stream response
        async for chunk in self.llm.stream_chat(messages, tools=self.tools):
            yield chunk

            # Handle tool calls
            if chunk["type"] == "tool_call":
                tool_call = chunk["toolCall"]
                if tool_call["function"]["name"] == "execute_sql":
                    args = json.loads(tool_call["function"]["arguments"])

                    # Execute SQL
                    query_result = await execute_sql_tool(
                        self.db, data_source_ids[0] if data_source_ids else "", args
                    )

                    yield {
                        "type": "tool_result",
                        "toolResult": {
                            "toolCallId": tool_call["id"],
                            "result": query_result,
                        },
                    }
