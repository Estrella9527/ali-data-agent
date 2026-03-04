from openai import AsyncOpenAI
from typing import AsyncGenerator, Optional
import json

from app.config import settings


class LLMClient:
    """OpenAI-compatible LLM client for Qwen/DeepSeek/GPT."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
    ):
        self.client = AsyncOpenAI(
            api_key=api_key or settings.llm_api_key,
            base_url=base_url or settings.llm_base_url,
        )
        self.model = model or settings.llm_model

    async def chat(
        self,
        messages: list[dict],
        tools: Optional[list[dict]] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> dict:
        """Send a chat completion request."""
        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature or settings.llm_temperature,
            "max_tokens": max_tokens or settings.llm_max_tokens,
        }

        if tools:
            kwargs["tools"] = tools
            kwargs["tool_choice"] = "auto"

        response = await self.client.chat.completions.create(**kwargs)

        choice = response.choices[0]
        result = {
            "content": choice.message.content or "",
            "finish_reason": choice.finish_reason,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            },
        }

        if choice.message.tool_calls:
            result["tool_calls"] = [
                {
                    "id": tc.id,
                    "type": tc.type,
                    "function": {
                        "name": tc.function.name,
                        "arguments": tc.function.arguments,
                    },
                }
                for tc in choice.message.tool_calls
            ]

        return result

    async def stream_chat(
        self,
        messages: list[dict],
        tools: Optional[list[dict]] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> AsyncGenerator[dict, None]:
        """Stream chat completion response."""
        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature or settings.llm_temperature,
            "max_tokens": max_tokens or settings.llm_max_tokens,
            "stream": True,
        }

        if tools:
            kwargs["tools"] = tools
            kwargs["tool_choice"] = "auto"

        stream = await self.client.chat.completions.create(**kwargs)

        tool_calls_buffer = {}

        async for chunk in stream:
            delta = chunk.choices[0].delta if chunk.choices else None
            finish_reason = chunk.choices[0].finish_reason if chunk.choices else None

            if delta:
                # Text content
                if delta.content:
                    yield {"type": "text", "content": delta.content}

                # Tool calls
                if delta.tool_calls:
                    for tc in delta.tool_calls:
                        if tc.index not in tool_calls_buffer:
                            tool_calls_buffer[tc.index] = {
                                "id": tc.id or "",
                                "type": "function",
                                "function": {"name": "", "arguments": ""},
                            }

                        if tc.id:
                            tool_calls_buffer[tc.index]["id"] = tc.id
                        if tc.function:
                            if tc.function.name:
                                tool_calls_buffer[tc.index]["function"][
                                    "name"
                                ] = tc.function.name
                            if tc.function.arguments:
                                tool_calls_buffer[tc.index]["function"][
                                    "arguments"
                                ] += tc.function.arguments

            if finish_reason == "tool_calls":
                for tc in tool_calls_buffer.values():
                    yield {"type": "tool_call", "toolCall": tc}

            if finish_reason == "stop":
                yield {"type": "done"}


# Singleton instance
llm_client = LLMClient()
