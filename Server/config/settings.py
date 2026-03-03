"""
Settings import module for backward compatibility.
Re-exports settings from app.config.
"""
from pydantic import BaseSettings
from typing import Optional
# from app.config import settings


class Settings(BaseSettings):
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    # File paths
    UPLOAD_DIR: str = "uploads"
    OUTPUT_DIR: str = "outputs"
    MAX_UPLOAD_SIZE: int = 1024 * 1024 * 1024  # 1GB

    # Task settings
    MAX_CONCURRENT_TASKS: int = 5
    TASK_TIMEOUT: int = 3600  # 1 hour

    # Security
    API_KEY: Optional[str] = None
    ENABLE_AUTH: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
__all__ = ["settings"]
