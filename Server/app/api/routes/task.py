from fastapi import APIRouter, HTTPException, Depends, Query, BackgroundTasks
from typing import List, Optional, Dict, Any
import logging

from ...core.task_manager import TaskManager
from ...services.progress_service import ProgressService
from ...services.websocket_manager import WebSocketManager
from ...dependencies import get_task_manager, get_progress_service, get_websocket_manager
from ...models.tasks import TaskFilter, TaskSummary
from ...models.responses import TaskStatusResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])

@router.get("", response_model=List[TaskSummary])
async def list_tasks(
    status: Optional[List[str]] = Query(None, description="Filter by status"),
    task_type: Optional[str] = Query(None, description="Filter by task type"),
    operation: Optional[str] = Query(None, description="Filter by operation"),
    limit: int = Query(50, description="Number of tasks to return", ge=1, le=1000),
    offset: int = Query(0, description="Pagination offset", ge=0),
    task_manager: TaskManager = Depends(get_task_manager)
):
    """
    List all tasks with optional filtering
    """
    try:
        filter_params = TaskFilter(
            status=status,
            task_type=task_type,
            operation=operation,
            limit=limit,
            offset=offset
        )

        tasks = task_manager.list_tasks(filter_params)

        return tasks

    except Exception as e:
        logger.error(f"Error listing tasks: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{task_id}", response_model=TaskStatusResponse)
async def get_task(
    task_id: str,
    task_manager: TaskManager = Depends(get_task_manager)
):
    """
    Get detailed task information
    """
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    return TaskStatusResponse(
        task_id=task.task_id,
        status=task.status,
        progress=task.progress,
        message=task.message,
        logs=task.logs[-50:],
        created_at=task.created_at.isoformat() if task.created_at else None,
        started_at=task.started_at.isoformat() if task.started_at else None,
        completed_at=task.completed_at.isoformat() if task.completed_at else None,
        result=task.result,
        error=task.error
    )


@router.get("/{task_id}/status")
async def get_task_status(
    task_id: str,
    task_manager: TaskManager = Depends(get_task_manager)
):
    """
    Get task status (lightweight version)
    """
    status = task_manager.get_task_status(task_id)
    if not status:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    return status


@router.post("/{task_id}/cancel")
async def cancel_task(
    task_id: str,
    background_tasks: BackgroundTasks,
    task_manager: TaskManager = Depends(get_task_manager),
    websocket_manager: WebSocketManager = Depends(get_websocket_manager)
):
    """
    Cancel a running task
    """
    success = task_manager.cancel_task(task_id)

    if not success:
        raise HTTPException(
            status_code=400,
            detail=f"Task {task_id} cannot be cancelled (not found or not running)"
        )

    # Notify via websocket
    background_tasks.add_task(
        websocket_manager.send_task_cancelled,
        task_id
    )

    return {
        'message': f'Task {task_id} cancelled successfully',
        'task_id': task_id
    }


@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    task_manager: TaskManager = Depends(get_task_manager)
):
    """
    Delete a task from history
    """
    success = task_manager.delete_task(task_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Task {task_id} not found"
        )

    return {
        'message': f'Task {task_id} deleted successfully',
        'task_id': task_id
    }


@router.post("/{task_id}/retry")
async def retry_task(
    task_id: str,
    background_tasks: BackgroundTasks,
    task_manager: TaskManager = Depends(get_task_manager),
    progress_service: ProgressService = Depends(get_progress_service)
):
    """
    Retry a failed task
    """
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    if task.status not in ['failed', 'cancelled']:
        raise HTTPException(
            status_code=400,
            detail=f"Task {task_id} is not in a retryable state (status: {task.status})"
        )

    # Create new task with same parameters
    new_task_id = task_manager.create_task(
        operation=task.operation,
        params=task.params,
        priority=task.config.get('priority', 'medium')
    )

    # Create progress tracker
    tracker = progress_service.create_tracker(
        new_task_id,
        total_steps=100,
        description=f"Retry: {task.operation}"
    )
    tracker.start()

    logger.info(f"Retrying task {task_id} as {new_task_id}")

    return {
        'message': f'Task retry initiated',
        'original_task_id': task_id,
        'new_task_id': new_task_id
    }


@router.get("/{task_id}/logs")
async def get_task_logs(
    task_id: str,
    lines: int = Query(100, description="Number of log lines", ge=10, le=1000),
    task_manager: TaskManager = Depends(get_task_manager)
):
    """
    Get task logs
    """
    task = task_manager.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    return {
        'task_id': task_id,
        'logs': task.logs[-lines:],
        'total_lines': len(task.logs)
    }


@router.post("/cleanup")
async def cleanup_tasks(
    days: int = Query(7, description="Delete tasks older than X days", ge=1, le=30),
    status: Optional[List[str]] = Query(None, description="Delete only tasks with these statuses"),
    task_manager: TaskManager = Depends(get_task_manager)
):
    """
    Clean up old tasks
    """
    # This would implement selective cleanup based on status
    count = task_manager.cleanup_old_tasks(days=days)

    return {
        'message': f'Cleaned up {count} tasks older than {days} days',
        'tasks_removed': count,
        'days': days
    }


@router.get("/stats/summary")
async def get_task_statistics(
    task_manager: TaskManager = Depends(get_task_manager)
):
    """
    Get task statistics summary
    """
    return task_manager.get_statistics()


@router.get("/stats/timeline")
async def get_task_timeline(
    days: int = Query(7, description="Number of days to include", ge=1, le=30),
    task_manager: TaskManager = Depends(get_task_manager)
):
    """
    Get task timeline for charts
    """
    # This would aggregate tasks by day
    # Placeholder implementation
    from datetime import datetime, timedelta

    timeline = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    # Generate daily stats
    current = start_date
    while current <= end_date:
        timeline.append({
            'date': current.strftime('%Y-%m-%d'),
            'completed': 0,
            'failed': 0,
            'cancelled': 0,
            'total': 0
        })
        current += timedelta(days=1)

    return {
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'timeline': timeline
    }
