from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Application
    app_name: str = "Data Agent Service"
    debug: bool = False

    # LLM Configuration
    llm_api_key: str = ""
    llm_base_url: str = "https://dashscope.aliyuncs.com/compatible-mode/v1"
    llm_model: str = "qwen-plus"
    llm_temperature: float = 0.7
    llm_max_tokens: int = 4096

    # Database
    database_url: str = "postgresql://dataagent:dataagent123@postgres:5432/dataagent"

    # ChromaDB
    chroma_host: str = "chromadb"
    chroma_port: int = 8000

    # CORS
    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
