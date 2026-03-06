from fastapi import APIRouter, HTTPException, Depends, Query, BackgroundTasks
from typing import Optional
import logging
from pathlib import Path

from app.models.requests import ConversionRequest, ConversionType, VideoAnalysisRequest
from app.models.responses import TaskResponse
from app.models.tasks import TaskPriority
from app.services.conversion_service import ConversionService
from app.services.progress_service import ProgressService
from app.core.task_manager import TaskManager
from app.core.file_handler import FileHandler
from app.api.dependencies import get_conversion_service, get_task_manager, get_file_handler
from app.api.dependencies import get_progress_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/video", tags=["video"])


@router.post("/convert", response_model=TaskResponse)
async def convert_video(
    request: ConversionRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert video files between formats
    """
    try:
        # Validate operation
        if request.operation not in [
            ConversionType.CONVERT_VIDEO,
            ConversionType.CONVERT_VIDEO_ALT,
        ]:
            raise HTTPException(
                status_code=400, detail="Invalid operation for video conversion"
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
                status_code=400, detail="Target format required for video conversion"
            )

        # Submit task
        task_id = conversion_service.submit_conversion(request, priority)

        # Create progress tracker
        file_info = file_handler.get_file_info(request.input_paths[0])
        total_steps = int(file_info["size"] / (1024 * 1024)) * 2  # 2 steps per MB
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=max(100, total_steps),
            description=f"Converting video to {request.target_format}",
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Video conversion task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Converting video to {request.target_format}",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting video: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze", response_model=TaskResponse)
async def analyze_video(
    request: VideoAnalysisRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Analyze video properties and metadata
    """
    try:
        # Create conversion request
        conv_request = ConversionRequest(
            operation=ConversionType.ANALYZE_VIDEO,
            input_paths=[request.video_path],
            options={
                "analyze_audio": request.analyze_audio,
                "extract_metadata": request.extract_metadata,
            },
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id, total_steps=100, description="Analyzing video"
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Video analysis task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message="Analyzing video",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing video: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-frames", response_model=TaskResponse)
async def extract_frames(
    video_path: str,
    frame_rate: Optional[int] = Query(1, description="Frames per second to extract"),
    output_dir: Optional[str] = None,
    format: str = Query("jpg", description="Output image format"),
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Extract frames from a video
    """
    try:
        # Validate video file
        video_ext = Path(video_path).suffix.lower()
        valid_video_extensions = [
            ".mp4",
            ".avi",
            ".mkv",
            ".mov",
            ".flv",
            ".wmv",
            ".webm",
        ]

        if video_ext not in valid_video_extensions:
            raise HTTPException(
                status_code=400, detail=f"Unsupported video format: {video_ext}"
            )

        # Create conversion request
        options = {"frame_rate": frame_rate, "format": format}

        # For frame extraction, we might need a custom operation
        # Using CONVERT_VIDEO with special options for now
        conv_request = ConversionRequest(
            operation=ConversionType.CONVERT_VIDEO,
            input_paths=[video_path],
            output_path=output_dir,
            target_format=format,
            options=options,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        file_info = file_handler.get_file_info(video_path)
        estimated_frames = (
            int(file_info["duration"] if "duration" in file_info else 60) * frame_rate
        )
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=estimated_frames,
            description=f"Extracting frames at {frame_rate} fps",
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Frame extraction task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Extracting frames at {frame_rate} fps",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting frames: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compress", response_model=TaskResponse)
async def compress_video(
    video_path: str,
    target_size: Optional[str] = Query(
        None, description="Target size (e.g., '100MB', '50%')"
    ),
    quality: Optional[int] = Query(
        23, description="Quality (0-51, lower is better)", ge=0, le=51
    ),
    output_path: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Compress a video file
    """
    try:
        # Validate video file
        video_ext = Path(video_path).suffix.lower()
        valid_video_extensions = [".mp4", ".avi", ".mkv", ".mov", ".webm"]

        if video_ext not in valid_video_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported video format for compression: {video_ext}",
            )

        options = {"quality": quality}
        if target_size:
            options["target_size"] = target_size

        conv_request = ConversionRequest(
            operation=ConversionType.CONVERT_VIDEO,
            input_paths=[video_path],
            output_path=output_path,
            target_format=video_ext[1:],  # Keep same format
            options=options,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        file_info = file_handler.get_file_info(video_path)
        total_steps = int(file_info["size"] / (1024 * 1024)) * 3
        tracker = progress_service.create_tracker(
            task_id, total_steps=max(100, total_steps), description="Compressing video"
        )
        tracker.start()

        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Video compression task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message="Compressing video",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error compressing video: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/formats")
async def get_video_formats():
    """
    Get supported video formats
    """
    return {
        "input": [".mp4", ".avi", ".mkv", ".mov", ".flv", ".wmv", ".webm"],
        "output": [".mp4", ".avi", ".mkv", ".mov", ".webm", ".gif"],
        "codecs": {
            "mp4": "mpeg4",
            "avi": "rawvideo",
            "webm": "libvpx",
            "mov": "mpeg4",
            "mkv": "mpeg4",
            "flv": "flv",
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
