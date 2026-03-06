from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    Query,
    BackgroundTasks,
    # UploadFile,
    # File,
)
from typing import Optional, Dict, Any
from pathlib import Path

from warpapp.models.requests import ConversionRequest, ConversionType, AudioJoinRequest
from warpapp.models.responses import TaskResponse
from warpapp.models.tasks import TaskPriority
from warpapp.services.conversion_service import ConversionService
from warpapp.services.progress_service import ProgressService
from warpapp.core.task_manager import TaskManager
from warpapp.core.file_handler import FileHandler
from warpapp.api.dependencies import get_conversion_service, get_task_manager, get_file_handler
from warpapp.api.dependencies import get_progress_service
from warpapp.utils.logger import logger


router = APIRouter(prefix="/api/v1/audio", tags=["audio"])


@router.post("/convert", response_model=TaskResponse)
async def convert_audio(
    request: ConversionRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Convert audio files between formats
    """
    try:
        # Validate operation
        if request.operation not in [
            ConversionType.CONVERT_AUDIO,
            ConversionType.CONVERT_AUDIO_ALT,
        ]:
            raise HTTPException(
                status_code=400, detail="Invalid operation for audio conversion"
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

        # Submit task
        task_id = conversion_service.submit_conversion(request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=100,
            description=f"Converting audio to {request.target_format}",
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Audio conversion task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Converting audio to {request.target_format}",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract", response_model=TaskResponse)
async def extract_audio_from_video(
    video_path: str,
    output_format: str = Query("mp3", description="Output audio format"),
    output_path: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Extract audio from a video file
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
        conv_request = ConversionRequest(
            operation=ConversionType.EXTRACT_AUDIO,
            input_paths=[video_path],
            target_format=output_format,
            output_path=output_path,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id, total_steps=100, description=f"Extracting audio to {output_format}"
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Audio extraction task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Extracting audio to {output_format}",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/join", response_model=TaskResponse)
async def join_audio_files(
    request: AudioJoinRequest,
    background_tasks: BackgroundTasks,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Join multiple audio files into one
    """
    try:
        # Validate at least 2 files
        if len(request.input_paths) < 2:
            raise HTTPException(
                status_code=400, detail="At least 2 audio files required for joining"
            )

        # Create conversion request
        conv_request = ConversionRequest(
            operation=ConversionType.JOIN_AUDIO,
            input_paths=request.input_paths,
            output_path=request.output_path,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id,
            total_steps=len(request.input_paths) * 10,
            description=f"Joining {len(request.input_paths)} audio files",
        )
        tracker.start()

        # Add cleanup to background tasks
        background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Audio join task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message=f"Joining {len(request.input_paths)} audio files",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error joining audio files: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/record", response_model=TaskResponse)
async def record_audio(
    duration: Optional[int] = Query(None, description="Recording duration in seconds"),
    output_format: str = Query("wav", description="Output format"),
    output_path: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Record audio from microphone
    """
    try:
        # Create conversion request
        options = {}
        if duration:
            options["duration"] = duration

        conv_request = ConversionRequest(
            operation=ConversionType.RECORD,
            input_paths=[],
            target_format=output_format,
            output_path=output_path,
            options=options,
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        total_steps = duration if duration else 100
        tracker = progress_service.create_tracker(
            task_id, total_steps=total_steps, description="Recording audio"
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Audio recording task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message="Recording audio",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except Exception as e:
        logger.error(f"Error recording audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/effects", response_model=TaskResponse)
async def apply_audio_effects(
    audio_path: str,
    effects: Dict[str, Any],
    output_path: Optional[str] = None,
    background_tasks: BackgroundTasks = None,
    priority: TaskPriority = Query(TaskPriority.MEDIUM, description="Task priority"),
    conversion_service: ConversionService = Depends(get_conversion_service),
    task_manager: TaskManager = Depends(get_task_manager),
    file_handler: FileHandler = Depends(get_file_handler),
    progress_service: ProgressService = Depends(get_progress_service),
):
    """
    Apply effects to an audio file
    """
    try:
        # Validate audio file
        audio_ext = Path(audio_path).suffix.lower()
        valid_audio_extensions = [".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac"]

        if audio_ext not in valid_audio_extensions:
            raise HTTPException(
                status_code=400, detail=f"Unsupported audio format: {audio_ext}"
            )

        # Create conversion request
        conv_request = ConversionRequest(
            operation=ConversionType.AUDIO_EFFECTS,
            input_paths=[audio_path],
            output_path=output_path,
            options={"effects": effects},
        )

        # Submit task
        task_id = conversion_service.submit_conversion(conv_request, priority)

        # Create progress tracker
        tracker = progress_service.create_tracker(
            task_id, total_steps=100, description="Applying audio effects"
        )
        tracker.start()

        # Add cleanup to background tasks
        if background_tasks:
            background_tasks.add_task(cleanup_old_tasks, task_manager)

        logger.info(f"Audio effects task submitted: {task_id}")

        return TaskResponse(
            task_id=task_id,
            status="pending",
            message="Applying audio effects",
            created_at=tracker.start_time.isoformat() if tracker.start_time else None,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error applying audio effects: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/formats")
async def get_audio_formats():
    """
    Get supported audio formats
    """
    return {
        "input": [".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac", ".wma"],
        "output": [".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac"],
        "extractable_from": [".mp4", ".avi", ".mkv", ".mov", ".flv", ".wmv", ".webm"],
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
