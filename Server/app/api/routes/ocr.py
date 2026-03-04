from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    Query,
    BackgroundTasks,
    UploadFile,
    File,
)
from typing import List
import logging
from pathlib import Path
import os

from ...models.requests import OCRRequest
from ...models.responses import TaskResponse
from ...models.tasks import TaskPriority
from ...services.conversion_service import ConversionService
from ...services.progress_service import ProgressService
from ...core.task_manager import TaskManager
from ...core.file_handler import FileHandler
from ...dependencies import get_conversion_service, get_task_manager, get_file_handler
from ...dependencies import get_progress_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/ocr", tags=["ocr"])


@router.post("/extract", response_model=TaskResponse)
async def extract_text(
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
        valid_extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp"]
        invalid_files = []

        for path in request.image_paths:
            if not file_handler.validate_path(path):
                invalid_files.append(f"{path} (not accessible)")
            elif Path(path).suffix.lower() not in valid_extensions:
                invalid_files.append(f"{path} (invalid image format)")

        if invalid_files:
            raise HTTPException(
                status_code=400, detail=f"Invalid files: {', '.join(invalid_files)}"
            )

        # Submit task
        task_id = conversion_service.submit_conversion(
            ConversionRequest(
                operation="ocr",
                input_paths=request.image_paths,
                output_path=request.output_path,
                options={"language": request.language, "separator": request.separator},
            ),
            priority,
        )

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=len(request.image_paths) * 10,
            description=f"Performing OCR on {len(request.image_paths)} images",
        )
        tracker.start()

        # Add cleanup
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
        logger.error(f"Error submitting OCR task: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload-extract")
async def upload_and_extract(
    files: List[UploadFile] = File(..., description="Images to process"),
    language: str = Query("eng", description="OCR language"),
    separator: str = Query("\n", description="Text separator"),
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Upload images and extract text using OCR
    """
    temp_files = []

    try:
        # Save uploaded files temporarily
        for file in files:
            # Validate file type
            ext = Path(file.filename).suffix.lower()
            valid_extensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"]

            if ext not in valid_extensions:
                raise HTTPException(
                    status_code=400, detail=f"Invalid image format: {ext}"
                )

            # Save to temp file
            temp_path = file_handler.get_temp_path(prefix="ocr_upload", extension=ext)
            with open(temp_path, "wb") as f:
                content = await file.read()
                f.write(content)

            temp_files.append(temp_path)

        # Create OCR request
        request = OCRRequest(
            image_paths=temp_files, language=language, separator=separator
        )

        # Submit task
        task_id = conversion_service.submit_conversion(
            ConversionRequest(
                operation="ocr",
                input_paths=temp_files,
                options={"language": language, "separator": separator},
            ),
            priority,
        )

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=len(temp_files) * 10,
            description=f"Performing OCR on {len(temp_files)} uploaded images",
        )
        tracker.start()

        # Clean up temp files after processing
        if background_tasks:
            background_tasks.add_task(cleanup_temp_files, temp_files)
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(
            f"OCR task submitted with {len(temp_files)} uploaded files: {task_id}"
        )

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Processing {len(temp_files)} uploaded images",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        # Clean up temp files on error
        for temp_file in temp_files:
            try:
                os.unlink(temp_file)
            except:
                pass
        raise
    except Exception as e:
        # Clean up temp files on error
        for temp_file in temp_files:
            try:
                os.unlink(temp_file)
            except:
                pass
        logger.error(f"Error in upload OCR: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/languages")
async def get_supported_languages():
    """
    Get supported OCR languages
    """
    # This would typically come from Tesseract or similar
    return {
        "languages": [
            {"code": "eng", "name": "English"},
            {"code": "spa", "name": "Spanish"},
            {"code": "fra", "name": "French"},
            {"code": "deu", "name": "German"},
            {"code": "ita", "name": "Italian"},
            {"code": "por", "name": "Portuguese"},
            {"code": "rus", "name": "Russian"},
            {"code": "jpn", "name": "Japanese"},
            {"code": "kor", "name": "Korean"},
            {"code": "chi_sim", "name": "Chinese (Simplified)"},
            {"code": "chi_tra", "name": "Chinese (Traditional)"},
            {"code": "ara", "name": "Arabic"},
            {"code": "hin", "name": "Hindi"},
        ],
        "default": "eng",
    }


async def cleanup_temp_files(file_paths: List[str]):
    """
    Clean up temporary files
    """
    for path in file_paths:
        try:
            if os.path.exists(path):
                os.unlink(path)
                logger.debug(f"Cleaned up temp file: {path}")
        except Exception as e:
            logger.error(f"Error cleaning up temp file {path}: {e}")


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
