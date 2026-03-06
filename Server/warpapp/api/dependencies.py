"""
Dependency injection for FastAPI routes.
Provides shared dependencies across the application.
"""

from typing import Optional
from fastapi import Request, HTTPException, Depends
import logging

from warpapp.core.task_manager import TaskManager
from warpapp.core.file_handler import FileHandler
from warpapp.core.interpreter import OperationInterpreter
from warpapp.services.conversion_service import ConversionService
from warpapp.services.progress_service import ProgressService
from warpapp.services.websocket_manager import WebSocketManager
from warpapp.services.notification_service import NotificationService
from warpapp.services.format_service import FormatService
from warpapp.config import settings

logger = logging.getLogger(__name__)

# Singleton instances
_task_manager: Optional[TaskManager] = None
_file_handler: Optional[FileHandler] = None
_operation_interpreter: Optional[OperationInterpreter] = None
_conversion_service: Optional[ConversionService] = None
_progress_service: Optional[ProgressService] = None
_websocket_manager: Optional[WebSocketManager] = None
_notification_service: Optional[NotificationService] = None
_format_service: Optional[FormatService] = None


def get_task_manager() -> TaskManager:
    """Get or create TaskManager singleton"""
    global _task_manager
    if _task_manager is None:
        _task_manager = TaskManager(
            storage_path=settings.TASK_STORAGE_PATH,
            filewarp_path=settings.FILEWARP_PATH,
        )
        logger.info("TaskManager initialized")
    return _task_manager


def get_file_handler() -> FileHandler:
    """Get or create FileHandler singleton"""
    global _file_handler
    if _file_handler is None:
        _file_handler = FileHandler(
            base_upload_dir=settings.UPLOAD_DIR, base_output_dir=settings.OUTPUT_DIR
        )
        logger.info("FileHandler initialized")
    return _file_handler


def get_operation_interpreter() -> OperationInterpreter:
    """Get or create OperationInterpreter singleton"""
    global _operation_interpreter
    if _operation_interpreter is None:
        _operation_interpreter = OperationInterpreter(
            filewarp_path=settings.FILEWARP_PATH
        )
        logger.info("OperationInterpreter initialized")
    return _operation_interpreter


def get_conversion_service() -> ConversionService:
    """Get or create ConversionService singleton"""
    global _conversion_service
    if _conversion_service is None:
        _conversion_service = ConversionService(
            task_manager=get_task_manager(), file_handler=get_file_handler()
        )
        logger.info("ConversionService initialized")
    return _conversion_service


def get_progress_service() -> ProgressService:
    """Get or create ProgressService singleton"""
    global _progress_service
    if _progress_service is None:
        _progress_service = ProgressService()
        logger.info("ProgressService initialized")
    return _progress_service


def get_websocket_manager() -> WebSocketManager:
    """Get or create WebSocketManager singleton"""
    global _websocket_manager
    if _websocket_manager is None:
        _websocket_manager = WebSocketManager()
        logger.info("WebSocketManager initialized")
    return _websocket_manager


def get_notification_service() -> NotificationService:
    """Get or create NotificationService singleton"""
    global _notification_service
    if _notification_service is None:
        _notification_service = NotificationService()
        logger.info("NotificationService initialized")
    return _notification_service


def get_format_service() -> FormatService:
    """Get or create FormatService singleton"""
    global _format_service
    if _format_service is None:
        _format_service = FormatService()
        logger.info("FormatService initialized")
    return _format_service


# Request-scoped dependencies
async def get_current_user(request: Request) -> Optional[dict]:
    """
    Get current user from request (placeholder for authentication)
    To be implemented with actual auth logic
    """
    # This is a placeholder - implement actual authentication
    api_key = request.headers.get("X-API-Key")

    if settings.ENABLE_AUTH and not api_key:
        raise HTTPException(status_code=401, detail="API key required")

    if settings.ENABLE_AUTH and api_key != settings.API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

    # Return user info (placeholder)
    return {"user_id": "system", "authenticated": True}


async def validate_file_access(
    paths: list, user: Optional[dict] = Depends(get_current_user)
):
    """
    Validate that user has access to specified files
    """
    # This is a placeholder - implement actual permission checking
    file_handler = get_file_handler()

    for path in paths:
        if not file_handler.validate_path(path):
            raise HTTPException(status_code=400, detail=f"File not accessible: {path}")

    return paths


# Database session (if using database)
# def get_db() -> Generator:
#     """Get database session"""
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# Cleanup function for application shutdown
async def cleanup_resources():
    """Clean up resources on application shutdown"""
    logger.info("Cleaning up resources...")

    # Clean up old tasks
    task_manager = get_task_manager()
    task_manager.cleanup_old_tasks(days=1)

    # Clean up old progress trackers
    progress_service = get_progress_service()
    progress_service.cleanup_old_trackers(max_age_minutes=60)

    logger.info("Cleanup complete")
