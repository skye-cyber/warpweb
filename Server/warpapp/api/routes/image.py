from fastapi import APIRouter, HTTPException, Depends, Query, BackgroundTasks
from typing import List, Optional
import logging
from pathlib import Path

from app.models.requests import (
    ConversionRequest,
    ConversionType,
    ImageResizeRequest,
    OCRRequest,
)
from app.models.responses import TaskResponse
from app.models.tasks import TaskPriority
from app.services.conversion_service import ConversionService
from app.services.progress_service import ProgressService
from app.core.task_manager import TaskManager
from app.core.file_handler import FileHandler
from app.api.dependencies import get_conversion_service, get_task_manager, get_file_handler
from app.api.dependencies import get_progress_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/image", tags=["image"])


@router.post("/convert", response_model=TaskResponse)
async def convert_image(
    request: ConversionRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert images between formats
    """
    try:
        # Validate operation
        if request.operation not in [
            ConversionType.CONVERT_IMAGE,
            ConversionType.CONVERT_IMAGE_ALT,
        ]:
            raise HTTPException(
                status_code=400, detail="Invalid operation for image conversion"
            )

        # Validate input files
        invalid_files = conversion_service.validate_input_files(
            request.input_paths, request.operation.value
        )

        if invalid_files:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid input files: {', '.join(invalid_files)}",
            )

        # Validate target format
        if not request.target_format:
            raise HTTPException(
                status_code=400, detail="Target format required for image conversion"
            )

        # Submit task
        task_id = conversion_service.submit_conversion(request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=len(request.input_paths) * 5,
            description=f"Converting images to {request.target_format}",
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Image conversion task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Converting {len(request.input_paths)} images to {request.target_format}",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting image: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/resize", response_model=TaskResponse)
async def resize_image(
    request: ImageResizeRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Resize or compress an image
    """
    try:
        # Create conversion request
        options = {"target_size": request.target_size}

        conv_request = ConversionRequest(
            operation=ConversionType.RESIZE_IMAGE,
            input_paths=[request.image_path],
            output_path=request.output_path,
            target_format=request.output_format,
            options=options,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=100,
            description=f"Resizing image to {request.target_size}",
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Image resize task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Resizing image to {request.target_size}",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resizing image: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/to-pdf", response_model=TaskResponse)
async def images_to_pdf(
    image_paths: List[str],
    output_path: Optional[str] = None,
    sort: bool = Query(False, description="Sort images"),
    walk: bool = Query(False, description="Process subdirectories"),
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert multiple images to a single PDF
    """
    try:
        # Validate image files
        valid_extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"]
        invalid_files = []

        for path in image_paths:
            if not file_handler.validate_path(path):
                invalid_files.append(f"{path} (not accessible)")
            elif Path(path).suffix.lower() not in valid_extensions:
                invalid_files.append(f"{path} (invalid image format)")

        if invalid_files:
            raise HTTPException(
                status_code=400, detail=f"Invalid files: {', '.join(invalid_files)}"
            )

        # Create conversion request
        options = {"sort": sort, "walk": walk}

        conv_request = ConversionRequest(
            operation=ConversionType.IMAGES_TO_PDF,
            input_paths=image_paths,
            output_path=output_path,
            options=options,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=len(image_paths) * 2,
            description=f"Converting {len(image_paths)} images to PDF",
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Images to PDF task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Converting {len(image_paths)} images to PDF",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting images to PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/to-word", response_model=TaskResponse)
async def images_to_word(
    image_paths: List[str],
    output_path: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert multiple images to a Word document
    """
    try:
        # Validate image files
        valid_extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"]
        invalid_files = []

        for path in image_paths:
            if not file_handler.validate_path(path):
                invalid_files.append(f"{path} (not accessible)")
            elif Path(path).suffix.lower() not in valid_extensions:
                invalid_files.append(f"{path} (invalid image format)")

        if invalid_files:
            raise HTTPException(
                status_code=400, detail=f"Invalid files: {', '.join(invalid_files)}"
            )

        # Create conversion request
        conv_request = ConversionRequest(
            operation=ConversionType.IMAGES_TO_WORD,
            input_paths=image_paths,
            output_path=output_path,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=len(image_paths) * 3,
            description=f"Converting {len(image_paths)} images to Word",
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Images to Word task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Converting {len(image_paths)} images to Word",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting images to Word: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/grayscale", response_model=TaskResponse)
async def images_to_grayscale(
    image_paths: List[str],
    output_dir: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert images to grayscale
    """
    try:
        # Create conversion request
        conv_request = ConversionRequest(
            operation=ConversionType.IMAGES_TO_GRAY,
            input_paths=image_paths,
            output_path=output_dir,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=len(image_paths) * 2,
            description=f"Converting {len(image_paths)} images to grayscale",
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Grayscale conversion task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Converting {len(image_paths)} images to grayscale",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting to grayscale: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ocr", response_model=TaskResponse)
async def perform_ocr(
    request: OCRRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Extract text from images using OCR
    """
    try:
        # Validate image files
        invalid_files = []
        for path in request.image_paths:
            if not file_handler.validate_path(path):
                invalid_files.append(f"{path} (not accessible)")

        if invalid_files:
            raise HTTPException(
                status_code=400, detail=f"Invalid files: {', '.join(invalid_files)}"
            )

        # Create conversion request
        options = {"language": request.language, "separator": request.separator}

        conv_request = ConversionRequest(
            operation=ConversionType.OCR,
            input_paths=request.image_paths,
            output_path=request.output_path,
            options=options,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=len(request.image_paths) * 10,
            description=f"Performing OCR on {len(request.image_paths)} images",
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"OCR task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Performing OCR on {len(request.image_paths)} images",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error performing OCR: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/formats")
async def get_image_formats():
    """
    Get supported image formats
    """
    return {
        "input": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".svg"],
        "output": [".jpg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".pdf"],
        "ocr_supported": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],
    }


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
