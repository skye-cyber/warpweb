from fastapi import APIRouter, HTTPException, Depends, Query, BackgroundTasks
from typing import List, Optional
from pathlib import Path
from warpapp.models.requests import ConversionRequest, ConversionType, TextToWordRequest
from warpapp.models.responses import TaskResponse
from warpapp.models.tasks import TaskPriority
from warpapp.services.conversion_service import ConversionService
from warpapp.services.progress_service import ProgressService
from warpapp.core.task_manager import TaskManager
from warpapp.core.file_handler import FileHandler
from warpapp.api.dependencies import get_conversion_service, get_task_manager, get_file_handler
from warpapp.api.dependencies import get_progress_service
from warpapp.utils.logger import logger

router = APIRouter(prefix="/api/v1/document", tags=["document"])


@router.post("/convert", response_model=TaskResponse)
async def convert_document(
    request: ConversionRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert documents between formats (PDF, DOCX, TXT, etc.)
    """
    try:
        # Validate operation
        valid_ops = [
            ConversionType.CONVERT_DOC,
            ConversionType.CONVERT_DOC_ALT,
            ConversionType.DOC_TO_IMAGE,
            ConversionType.HTML_TO_WORD,
            ConversionType.MARKDOWN_TO_DOCX,
        ]

        if request.operation not in valid_ops:
            raise HTTPException(
                status_code=400, detail="Invalid operation for document conversion"
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

        # Validate target format if required
        operation_info = conversion_service.get_operation_info(request.operation.value)
        if operation_info and operation_info.get("requires_target_format", False):
            if not request.target_format:
                raise HTTPException(
                    status_code=400,
                    detail=f"Target format required for {request.operation.value}",
                )

        # Submit task
        task_id = conversion_service.submit_conversion(request, priority)

        # Create progress tracker
        total_steps = len(request.input_paths) * 5
        if request.operation == ConversionType.DOC_TO_IMAGE:
            total_steps *= 2

        tracker = progress_service.create_tracker(
            task_id,
            total_steps=total_steps,
            description=f"Converting documents to {request.target_format or 'target format'}",
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Document conversion task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Converting {len(request.input_paths)} document(s)",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/to-image", response_model=TaskResponse)
async def document_to_image(
    document_path: str,
    output_format: str = Query("png", description="Output image format"),
    output_dir: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert a document to images
    """
    try:
        # Validate document
        doc_ext = Path(document_path).suffix.lower()
        valid_doc_extensions = [".pdf", ".docx", ".doc", ".txt", ".rtf", ".odt"]

        if doc_ext not in valid_doc_extensions:
            raise HTTPException(
                status_code=400, detail=f"Unsupported document format: {doc_ext}"
            )

        # Create conversion request
        conv_request = ConversionRequest(
            operation=ConversionType.DOC_TO_IMAGE,
            input_paths=[document_path],
            target_format=output_format,
            output_path=output_dir,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=100,
            description=f"Converting document to {output_format} images",
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Document to image task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Converting document to {output_format} images",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting document to image: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/html2word", response_model=TaskResponse)
async def html_to_word(
    html_paths: List[str],
    output_dir: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert HTML files to Word documents
    """
    try:
        # Validate HTML files
        invalid_files = []
        for path in html_paths:
            ext = Path(path).suffix.lower()
            if ext not in [".html", ".htm"]:
                invalid_files.append(f"{path} (not an HTML file)")

        if invalid_files:
            raise HTTPException(
                status_code=400, detail=f"Invalid files: {', '.join(invalid_files)}"
            )

        # Create conversion request
        conv_request = ConversionRequest(
            operation=ConversionType.HTML_TO_WORD,
            input_paths=html_paths,
            output_path=output_dir,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=len(html_paths) * 5,
            description=f"Converting {len(html_paths)} HTML files to Word",
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"HTML to Word task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Converting {len(html_paths)} HTML files to Word",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting HTML to Word: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/text2word", response_model=TaskResponse)
async def text_to_word(
    request: TextToWordRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert styled text to Word document
    """
    try:
        # Validate text file
        if not file_handler.validate_file_type(request.text_path, [".txt"]):
            raise HTTPException(
                status_code=400, detail=f"Not a text file: {request.text_path}"
            )

        # Create conversion request
        options = {"font_size": request.font_size, "font_name": request.font_name}

        conv_request = ConversionRequest(
            operation=ConversionType.TEXT_TO_WORD,
            input_paths=[request.text_path],
            output_path=request.output_path,
            options=options,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id, total_steps=100, description="Converting text to Word"
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Text to Word task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message="Converting text to Word document",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting text to Word: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/markdown2word", response_model=TaskResponse)
async def markdown_to_word(
    markdown_path: str,
    output_path: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert Markdown to Word document with Mermaid rendering
    """
    try:
        # Validate markdown file
        ext = Path(markdown_path).suffix.lower()
        if ext not in [".md", ".markdown"]:
            raise HTTPException(
                status_code=400, detail=f"Not a markdown file: {markdown_path}"
            )

        # Create conversion request
        conv_request = ConversionRequest(
            operation=ConversionType.MARKDOWN_TO_DOCX,
            input_paths=[markdown_path],
            output_path=output_path,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id, total_steps=100, description="Converting Markdown to Word"
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Markdown to Word task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message="Converting Markdown to Word document",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting Markdown to Word: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/formats")
async def get_document_formats():
    """
    Get supported document formats
    """
    return {
        "input": [
            ".pdf",
            ".docx",
            ".doc",
            ".txt",
            ".rtf",
            ".odt",
            ".html",
            ".htm",
            ".md",
            ".markdown",
        ],
        "output": [".pdf", ".docx", ".txt", ".html", ".jpg", ".png"],
        "conversion_matrix": {
            "pdf": [".docx", ".txt", ".jpg", ".png"],
            "docx": [".pdf", ".txt", ".html", ".jpg", ".png"],
            "doc": [".pdf", ".docx", ".txt"],
            "txt": [".pdf", ".docx", ".html"],
            "html": [".pdf", ".docx", ".txt"],
            "md": [".html", ".pdf", ".docx"],
        },
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
