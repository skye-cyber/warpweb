from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
import uuid


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class TaskType(str, Enum):
    CONVERSION = "conversion"
    EXTRACTION = "extraction"
    ANALYSIS = "analysis"
    JOIN = "join"
    OCR = "ocr"
    RECORDING = "recording"
    SLICE = "slice"


class TaskStatus(str, Enum):
    COMPLETED = "completed"
    FAILED = "failed"
    PENDING = "pending"
    CANCELLED = "cancelled"


class TaskConfig(BaseModel):
    """Configuration for a task"""
    max_retries: int = Field(3, ge=0, le=10)
    timeout: int = Field(3600, ge=60, le=86400)  # 1 hour default
    priority: TaskPriority = TaskPriority.MEDIUM
    cleanup_temp: bool = True
    notify_on_complete: bool = False
    webhook_url: Optional[str] = None


class TaskMetrics(BaseModel):
    """Metrics for a task"""
    cpu_usage: Optional[float] = None
    memory_usage: Optional[float] = None
    disk_usage: Optional[float] = None
    estimated_remaining: Optional[int] = None  # seconds


class TaskModel(BaseModel):
    """Internal task model"""
    task_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    task_type: TaskType
    operation: str
    params: Dict[str, Any]
    config: TaskConfig = Field(default_factory=TaskConfig)

    # Status fields
    status: str = "pending"
    progress: int = 0
    message: str = ""
    logs: List[str] = []

    # Timing
    created_at: datetime = Field(default_factory=datetime.now)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    # Results
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

    # Metadata
    metrics: Optional[TaskMetrics] = None
    cancel_flag: bool = False
    user_id: Optional[str] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class TaskSummary(BaseModel):
    """Summary of a task for list views"""
    task_id: str
    task_type: TaskType
    operation: str
    status: str
    progress: int
    created_at: str
    completed_at: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "task_id": "123e4567-e89b-12d3-a456-426614174000",
                "task_type": "conversion",
                "operation": "convert-doc",
                "status": "running",
                "progress": 45,
                "created_at": "2024-01-15T10:30:00"
            }
        }


class TaskFilter(BaseModel):
    """Filter for task queries"""
    status: Optional[List[str]] = None
    task_type: Optional[TaskType] = None
    operation: Optional[str] = None
    created_after: Optional[datetime] = None
    created_before: Optional[datetime] = None
    user_id: Optional[str] = None
    limit: int = Field(50, ge=1, le=1000)
    offset: int = Field(0, ge=0)


class BulkTaskResponse(BaseModel):
    """Response for bulk task operations"""
    total: int
    tasks: List[TaskSummary]
    next_offset: Optional[int] = None
    previous_offset: Optional[int] = None
