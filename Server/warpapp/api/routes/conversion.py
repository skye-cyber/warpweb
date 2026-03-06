import logging
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends, Query
from typing import List, Optional, Dict, Any
from app.models.requests import ConversionRequest
from app.models.responses import TaskResponse
from app.models.tasks import TaskPriority
from app.services.conversion_service import ConversionService
from app.services.progress_service import ProgressService
from app.core.task_manager import TaskManager
from app.core.file_handler import FileHandler
from app.api.dependencies import get_conversion_service, get_task_manager, get_file_handler
from app.api.dependencies import get_progress_service  # , get_websocket_manager

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/conversion", tags=["conversion"])


@router.post("/submit", response_model=TaskResponse)
async def submit_conversion(
    request: ConversionRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Submit a conversion task
    """
    try:
        # Validate input files
        invalid_files = conversion_service.validate_input_files(
            request.input_paths, request.operation.value
        )

        if invalid_files:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid input files: {', '.join(invalid_files)}",
            )

        # Check if target format is required and provided
        operation_info = conversion_service.get_operation_info(request.operation.value)
        if operation_info and operation_info.get("requires_target_format", False):
            if not request.target_format:
                raise HTTPException(
                    status_code=400,
                    detail=f"Target format required for operation: {request.operation.value}",
                )

            # Validate target format
            from_format = file_handler.get_file_info(request.input_paths[0])[
                "extension"
            ]
            valid, message = conversion_service.validate_conversion(
                from_format, f".{request.target_format}"
            )
            if not valid:
                raise HTTPException(status_code=400, detail=message)

        # Submit task
        task_id = conversion_service.submit_conversion(request, priority)

        # Create progress tracker
        total_steps = len(request.input_paths) * 10  # Rough estimate
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=total_steps,
            description=f"Processing {request.operation.value}",
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Conversion task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message="Task submitted successfully",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting conversion: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/operations", response_model=List[Dict[str, Any]])
async def list_operations(
    category: Optional[str] = Query(None, description="Filter by category"),
    conversion_service: ConversionService = Depends(get_conversion_service),
):
    """
    List all supported conversion operations
    """
    return conversion_service.list_operations(category)


@router.get("/operations/{operation}", response_model=Dict[str, Any])
async def get_operation_info(
    operation: str,
    conversion_service: ConversionService = Depends(get_conversion_service),
):
    """
    Get information about a specific operation
    """
    info = conversion_service.get_operation_info(operation)
    if not info:
        raise HTTPException(status_code=404, detail=f"Operation not found: {operation}")
    return info


@router.get("/categories", response_model=List[Dict[str, Any]])
async def get_categories(
    conversion_service: ConversionService = Depends(get_conversion_service),
):
    """
    Get all operation categories
    """
    return conversion_service.get_categories()


@router.post("/validate", response_model=Dict[str, Any])
async def validate_conversion(
    request: ConversionRequest,
    conversion_service: ConversionService = Depends(get_conversion_service),
    file_handler: FileHandler = Depends(get_file_handler),
):
    """
    Validate a conversion request without executing it
    """
    try:
        # Validate operation
        operation_info = conversion_service.get_operation_info(request.operation.value)
        if not operation_info:
            return {
                "valid": False,
                "errors": [f"Unsupported operation: {request.operation.value}"],
            }

        errors = []

        # Validate input files
        invalid_files = conversion_service.validate_input_files(
            request.input_paths, request.operation.value
        )
        if invalid_files:
            errors.extend(invalid_files)

        # Validate target format if required
        if operation_info.get("requires_target_format", False):
            if not request.target_format:
                errors.append("Target format is required")
            else:
                # Validate format compatibility
                from_format = file_handler.get_file_info(request.input_paths[0])[
                    "extension"
                ]
                valid, message = conversion_service.validate_conversion(
                    from_format, f".{request.target_format}"
                )
                if not valid:
                    errors.append(message)

        # Estimate completion time
        estimated_time = conversion_service.estimate_completion_time(
            request.operation.value, request.input_paths
        )

        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "operation_info": operation_info,
            "estimated_time": estimated_time,
            "input_files": [file_handler.get_file_info(p) for p in request.input_paths],
        }

    except Exception as e:
        logger.error(f"Error validating conversion: {e}")
        return {"valid": False, "errors": [str(e)]}


@router.get("/formats", response_model=Dict[str, List[str]])
async def get_supported_formats(
    conversion_service: ConversionService = Depends(get_conversion_service),
):
    """
    Get all supported input/output formats by category
    """
    operations = conversion_service.list_operations()

    formats = {
        "document": {"input": set(), "output": set()},
        "audio": {"input": set(), "output": set()},
        "video": {"input": set(), "output": set()},
        "image": {"input": set(), "output": set()},
        "pdf": {"input": set(), "output": set()},
    }

    for op in operations:
        category = op["category"]
        if category in formats:
            formats[category]["input"].update(op["input_formats"])
            formats[category]["output"].update(op["output_formats"])

    # Convert sets to sorted lists
    result = {}
    for category, fmt_dict in formats.items():
        result[category] = {
            "input": sorted(fmt_dict["input"]),
            "output": sorted(fmt_dict["output"]),
        }

    return result


@router.post("/batch", response_model=List[TaskResponse])
async def submit_batch_conversion(
    requests: List[ConversionRequest],
    background_tasks: BackgroundTasks,
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Submit multiple conversion tasks in batch
    """
    responses = []

    for request in requests:
        try:
            task_id = conversion_service.submit_conversion(request)

            tracker = progress_service.create_tracker(
                task_id, total_steps=10, description=f"Batch: {request.operation.value}"
            )
            tracker.start()

            responses.append(
                TaskResponse(
                    task_id=task_id,
                    status="pending",
                    message="Task submitted successfully",
                    created_at=tracker.start_time.isoformat()
                    if tracker.start_time
                    else None,
                )
            )

        except Exception as e:
            logger.error(f"Error submitting batch task: {e}")
            responses.append(
                TaskResponse(
                    task_id="error", status="failed", message=str(e), created_at=None
                )
            )

    # Add cleanup to background tasks
    background_tasks.add_task(cleanup_old_tasks, task_manager)

    return responses


async def cleanup_old_tasks(task_manager: TaskManager):
    """
    Background task to clean up old tasks
    """
    try:
        count = task_manager.cleanup_old_tasks(days=7)
        if count > 0:
            logger.info(f"Cleaned up {count} old tasks")
    except Exception as e:
        logger.error(f"Error cleaning up old tasks: {e}")
