"""
Configuration management for FileWarp backend.
Loads settings from environment variables with defaults.
"""

from pathlib import Path
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from dotenv import load_dotenv

# Load .env file if present
load_dotenv('.env')

# Base directories
BASE_DIR = Path(__file__).parent.parent
DEFAULT_UPLOAD_DIR = BASE_DIR / "uploads"
DEFAULT_OUTPUT_DIR = BASE_DIR / "outputs"
DEFAULT_LOG_DIR = BASE_DIR / "logs"
DEFAULT_TASK_STORAGE = BASE_DIR / "data" / "tasks"


class Settings(BaseSettings):
    """Application settings"""

    # Server settings
    HOST: str = Field("0.0.0.0", env="HOST")
    PORT: int = Field(8000, env="PORT")
    DEBUG: bool = Field(False, env="DEBUG")
    RELOAD: bool = Field(False, env="RELOAD")
    WORKERS: int = Field(1, env="WORKERS")

    # API settings
    API_V1_PREFIX: str = "/api/v1"
    API_TITLE: str = "FileWarp API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "REST API for FileWarp operations"

    # Security
    SECRET_KEY: str = Field(
        "filewarp-secret-key-to-be-changed-in-production", env="SECRET_KEY"
    )
    API_KEY: Optional[str] = Field(None, env="API_KEY")
    ENABLE_AUTH: bool = Field(False, env="ENABLE_AUTH")
    CORS_ORIGINS: List[str] = Field(["*"], env="CORS_ORIGINS")

    # File paths
    FILEWARP_PATH: Optional[str] = Field(None, env="FILEWARP_PATH")
    UPLOAD_DIR: Path = Field(DEFAULT_UPLOAD_DIR, env="UPLOAD_DIR")
    OUTPUT_DIR: Path = Field(DEFAULT_OUTPUT_DIR, env="OUTPUT_DIR")
    LOG_DIR: Path = Field(DEFAULT_LOG_DIR, env="LOG_DIR")
    TASK_STORAGE_PATH: Optional[Path] = Field(
        DEFAULT_TASK_STORAGE, env="TASK_STORAGE_PATH"
    )

    # File limits
    MAX_UPLOAD_SIZE: int = Field(1024 * 1024 * 1024, env="MAX_UPLOAD_SIZE")  # 1GB
    MAX_BATCH_SIZE: int = Field(100, env="MAX_BATCH_SIZE")
    ALLOWED_EXTENSIONS: List[str] = Field(["*"], env="ALLOWED_EXTENSIONS")

    # Task settings
    MAX_CONCURRENT_TASKS: int = Field(5, env="MAX_CONCURRENT_TASKS")
    TASK_TIMEOUT: int = Field(3600, env="TASK_TIMEOUT")  # 1 hour
    TASK_CLEANUP_DAYS: int = Field(7, env="TASK_CLEANUP_DAYS")

    # Logging
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")
    LOG_FORMAT: str = Field(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s", env="LOG_FORMAT"
    )

    # WebSocket
    WS_PING_INTERVAL: int = Field(30, env="WS_PING_INTERVAL")
    WS_MAX_CONNECTIONS: int = Field(1000, env="WS_MAX_CONNECTIONS")

    # Performance
    ENABLE_CACHE: bool = Field(True, env="ENABLE_CACHE")
    CACHE_TTL: int = Field(300, env="CACHE_TTL")  # 5 minutes

    @field_validator("UPLOAD_DIR", "OUTPUT_DIR", "LOG_DIR", "TASK_STORAGE_PATH", mode="before")
    def create_directories(cls, v):
        """Create directories if they don't exist"""
        if v and isinstance(v, (str, Path)):
            path = Path(v)
            path.mkdir(parents=True, exist_ok=True)
        return v

    @field_validator("CORS_ORIGINS", mode="before")
    def parse_cors_origins(cls, v):
        """Parse CORS origins from string"""
        print(cls, v)
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    @field_validator("ALLOWED_EXTENSIONS", mode="before")
    def parse_allowed_extensions(cls, v):
        """Parse allowed extensions from string"""
        if isinstance(v, str):
            return [ext.strip() for ext in v.split(",")]
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


# Create global settings instance
settings = Settings()
print(f"Final CORS_ORIGINS: {settings.CORS_ORIGINS}")


# Logging configuration
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": settings.LOG_FORMAT,
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
            "level": settings.LOG_LEVEL,
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "default",
            "filename": settings.LOG_DIR / "filewarp.log",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
            "level": settings.LOG_LEVEL,
        },
    },
    "root": {
        "handlers": ["console", "file"],
        "level": settings.LOG_LEVEL,
    },
    "loggers": {
        "uvicorn": {
            "handlers": ["console"],
            "level": settings.LOG_LEVEL,
            "propagate": False,
        },
        "fastapi": {
            "handlers": ["console", "file"],
            "level": settings.LOG_LEVEL,
            "propagate": False,
        },
        "filewarp": {
            "handlers": ["console", "file"],
            "level": settings.LOG_LEVEL,
            "propagate": False,
        },
    },
}
