from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import json

from app.services.llm_client import LLMClient
from app.agents.data_agent import DataAgent

router = APIRouter()


class Memory(BaseModel):
    id: str
    content: str
    source: str
    heat: int
    status: str


class ChatRequest(BaseModel):
    sessionId: str
    message: str
    dataSourceIds: Optional[list[str]] = None
    memories: Optional[list[Memory]] = None
    customInstructions: Optional[str] = None


class ChatResponse(BaseModel):
    sessionId: str
    message: str
    toolCalls: Optional[list] = None
    sqlQueries: Optional[list] = None
    metadata: Optional[dict] = None


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process a chat message and return a response."""
    try:
        agent = DataAgent()

        # Build context from memories
        context = ""
        if request.memories:
            active_memories = [m for m in request.memories if m.status == "active"]
            if active_memories:
                context = "相关记忆:\n" + "\n".join(
                    [f"- {m.content}" for m in active_memories[:5]]
                )

        # Process message
        result = await agent.process(
            session_id=request.sessionId,
            message=request.message,
            data_source_ids=request.dataSourceIds or [],
            context=context,
            custom_instructions=request.customInstructions,
        )

        return ChatResponse(
            sessionId=request.sessionId,
            message=result.get("message", ""),
            toolCalls=result.get("tool_calls"),
            sqlQueries=result.get("sql_queries"),
            metadata=result.get("metadata"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """Stream chat response."""
    try:
        agent = DataAgent()

        # Build context
        context = ""
        if request.memories:
            active_memories = [m for m in request.memories if m.status == "active"]
            if active_memories:
                context = "相关记忆:\n" + "\n".join(
                    [f"- {m.content}" for m in active_memories[:5]]
                )

        async def generate():
            async for chunk in agent.stream(
                session_id=request.sessionId,
                message=request.message,
                data_source_ids=request.dataSourceIds or [],
                context=context,
                custom_instructions=request.customInstructions,
            ):
                yield f"data: {json.dumps(chunk)}\n\n"
            yield "data: [DONE]\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
