from fastapi import APIRouter, HTTPException, Depends, Query, BackgroundTasks
from typing import Optional
from ...models.requests import (
    ConversionRequest,
    ConversionType,
    PDFMergeRequest,
    PageExtractionRequest,
)
from warpapp.models.responses import TaskResponse
from warpapp.models.tasks import TaskPriority
from warpapp.services.conversion_service import ConversionService
from warpapp.services.progress_service import ProgressService
from warpapp.core.task_manager import TaskManager
from warpapp.core.file_handler import FileHandler
from warpapp.api.dependencies import get_conversion_service, get_task_manager, get_file_handler
from warpapp.api.dependencies import get_progress_service
from warpapp.utils.logger import logger

router = APIRouter(prefix="/pdf", tags=["pdf"])


@router.post("/merge", response_model=TaskResponse)
async def merge_pdfs(
    request: PDFMergeRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Join multiple PDF files into one
    """
    try:
        # Validate PDF files
        for pdf_path in request.pdf_paths:
            if not file_handler.validate_file_type(pdf_path, [".pdf"]):
                raise HTTPException(
                    status_code=400, detail=f"Not a PDF file: {pdf_path}"
                )

        # Create conversion request
        conv_request = ConversionRequest(
            operation=ConversionType.PDF_JOIN,
            input_paths=request.pdf_paths,
            output_path=request.output_path,
            options={"order": request.order},
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=len(request.pdf_paths) * 5,
            description=f"Joining {len(request.pdf_paths)} PDFs",
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"PDF join task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Joining {len(request.pdf_paths)} PDF files",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error joining PDFs: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-pages", response_model=TaskResponse)
async def extract_pages(
    request: PageExtractionRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Extract specific pages from a PDF
    """
    try:
        # Validate PDF
        if not file_handler.validate_file_type(request.pdf_path, [".pdf"]):
            raise HTTPException(
                status_code=400, detail=f"Not a PDF file: {request.pdf_path}"
            )

        # Create conversion request
        conv_request = ConversionRequest(
            operation=ConversionType.EXTRACT_PAGES,
            input_paths=[request.pdf_path],
            output_path=request.output_path,
            options={
                "start_page": request.start_page,
                "stop_page": request.stop_page,
            },
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=-1,
            description=f"Extracting page {request.start_page} to {request.stop_page} from PDF",
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Page extraction task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Extracting page range ({request.start_page} - {request.stop_page}) from PDF",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting pages: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-images", response_model=TaskResponse)
async def extract_images_from_pdf(
    pdf_path: str,
    output_dir: Optional[str] = None,
    image_size: Optional[str] = Query(None, description="Image size (e.g., '256x82')"),
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Extract images from a PDF
    """
    try:
        # Validate PDF
        if not file_handler.validate_file_type(pdf_path, [".pdf"]):
            raise HTTPException(status_code=400, detail=f"Not a PDF file: {pdf_path}")

        # Create conversion request
        options = {}
        if image_size:
            options["size"] = image_size

        conv_request = ConversionRequest(
            operation=ConversionType.EXTRACT_IMAGES,
            input_paths=[pdf_path],
            output_path=output_dir,
            options=options,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id, total_steps=100, description="Extracting images from PDF"
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Image extraction task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message="Extracting images from PDF",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting images: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/scan", response_model=TaskResponse)
async def scan_pdf(
    pdf_path: str,
    mode: str = Query("standard", enum=["standard", "image", "long"], description="Scan strategy"),
    separator: str = Query("\n", description="Text separator"),
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Scan PDF and extract text
    """
    try:
        # Validate PDF
        if not file_handler.validate_file_type(pdf_path, [".pdf"]):
            raise HTTPException(status_code=400, detail=f"Not a PDF file: {pdf_path}")

        # Map mode to operation
        operation_map = {
            "standard": ConversionType.SCAN_PDF,
            "image": ConversionType.SCAN_AS_IMAGE,
            "long": ConversionType.SCAN_LONG,
        }

        operation = operation_map.get(mode, ConversionType.SCAN_PDF)

        # Create conversion request
        options = {}
        if mode == "long":
            options["separator"] = separator

        conv_request = ConversionRequest(
            operation=operation, input_paths=[pdf_path], options=options
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id, total_steps=100, description=f"Scanning PDF ({mode} mode)"
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"PDF scan task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Scanning PDF in {mode} mode",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error scanning PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/to-long-image", response_model=TaskResponse)
async def pdf_to_long_image(
    pdf_path: str,
    output_path: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert PDF to a single long image
    """
    try:
        # Validate PDF
        if not file_handler.validate_file_type(pdf_path, [".pdf"]):
            raise HTTPException(status_code=400, detail=f"Not a PDF file: {pdf_path}")

        # Create conversion request
        conv_request = ConversionRequest(
            operation=ConversionType.PDF_TO_LONG_IMAGE,
            input_paths=[pdf_path],
            output_path=output_path,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id, total_steps=100, description="Converting PDF to long image"
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"PDF to long image task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message="Converting PDF to long image",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting PDF to long image: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/info")
async def get_pdf_info(
    pdf_path: str, file_handler: FileHandler = Depends(get_file_handler)
):
    """
    Get information about a PDF file
    """
    try:
        if not file_handler.validate_file_type(pdf_path, [".pdf"]):
            raise HTTPException(status_code=400, detail=f"Not a PDF file: {pdf_path}")

        info = file_handler.get_file_info(pdf_path)

        # Add PDF-specific info (would need PyPDF2 or similar)
        # This is a placeholder
        info["pdf_info"] = {
            "pages": "Unknown",
            "version": "Unknown",
            "encrypted": False,
        }

        return info

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting PDF info: {e}")
        raise HTTPException(status_code=500, detail=str(e))


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
