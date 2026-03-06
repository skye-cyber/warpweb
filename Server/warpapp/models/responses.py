from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum


class TaskStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class TaskResponse(BaseModel):
    """Response model for task submission"""

    task_id: str
    status: TaskStatus
    message: str
    created_at: str

    class Config:
        schema_extra = {
            "example": {
                "task_id": "123e4567-e89b-12d3-a456-426614174000",
                "status": "pending",
                "message": "Task submitted successfully",
                "created_at": "2024-01-15T10:30:00",
            }
        }


class TaskStatusResponse(BaseModel):
    """Response model for task status queries"""

    task_id: str
    status: TaskStatus
    progress: int = Field(..., ge=0, le=100)
    message: str
    logs: List[str]
    created_at: Optional[str] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "task_id": "123e4567-e89b-12d3-a456-426614174000",
                "status": "running",
                "progress": 45,
                "message": "Processing page 5 of 10",
                "logs": ["[10:30:05] Started processing", "[10:30:10] Page 1 complete"],
                "created_at": "2024-01-15T10:30:00",
                "started_at": "2024-01-15T10:30:01",
            }
        }


class OperationResult(BaseModel):
    """Response model for operation results"""

    success: bool
    message: str
    output_path: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    execution_time: Optional[float] = None

    class Config:
        schema_extra = {
            "example": {
                "success": True,
                "message": "Conversion completed successfully",
                "output_path": "/outputs/20240115/document_converted.pdf",
                "execution_time": 3.45,
            }
        }


class FileInfoResponse(BaseModel):
    """Response model for file information"""

    name: str
    path: str
    size: int
    size_human: str
    modified: str
    extension: str
    exists: bool
    is_directory: bool

    class Config:
        schema_extra = {
            "example": {
                "name": "document.pdf",
                "path": "/home/user/document.pdf",
                "size": 1048576,
                "size_human": "1.0 MB",
                "modified": "2024-01-15T10:30:00",
                "extension": ".pdf",
                "exists": True,
                "is_directory": False,
            }
        }


class FormatInfoResponse(BaseModel):
    """Response model for format information"""

    input_formats: List[str]
    output_formats: List[str]
    examples: List[Dict[str, str]]

    class Config:
        schema_extra = {
            "example": {
                "input_formats": [".pdf", ".docx", ".txt"],
                "output_formats": [".pdf", ".docx", ".txt", ".jpg"],
                "examples": [{"input": "document.docx", "output": "document.pdf"}],
            }
        }


class SystemInfoResponse(BaseModel):
    """Response model for system information"""

    version: str
    api_version: str
    uptime: str
    active_tasks: int
    completed_tasks: int
    failed_tasks: int
    total_tasks: int
    system_info: Dict[str, Any]

    class Config:
        schema_extra = {
            "example": {
                "version": "1.0.0",
                "api_version": "v1",
                "uptime": "2 days, 3 hours",
                "active_tasks": 2,
                "completed_tasks": 150,
                "failed_tasks": 3,
                "total_tasks": 155,
                "system_info": {
                    "cpu_count": 8,
                    "memory_total": "16 GB",
                    "disk_free": "50 GB",
                },
            }
        }


class ErrorResponse(BaseModel):
    """Response model for errors"""

    error: str
    detail: Optional[str] = None
    status_code: int
    timestamp: str
    path: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "error": "File not found",
                "detail": "/path/to/file.pdf does not exist",
                "status_code": 404,
                "timestamp": "2024-01-15T10:30:00",
                "path": "/api/v1/conversion/submit",
            }
        }


class ValidationErrorResponse(BaseModel):
    """Response model for validation errors"""

    errors: List[Dict[str, str]]
    status_code: int = 422
    timestamp: str

    class Config:
        schema_extra = {
            "example": {
                "errors": [
                    {"field": "input_paths", "message": "Path does not exist"},
                    {"field": "target_format", "message": "Required field"},
                ],
                "status_code": 422,
                "timestamp": "2024-01-15T10:30:00",
            }
        }
