from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from typing import Optional
import logging
import json

from ...services.websocket_manager import WebSocketManager
from ...services.progress_service import ProgressService
from ...dependencies import get_websocket_manager, get_progress_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/ws", tags=["websocket"])


@router.websocket("/task/{task_id}")
async def task_websocket(
    websocket: WebSocket,
    task_id: str,
    client_id: Optional[str] = Query(None, description="Client identifier"),
    ws_manager: WebSocketManager = Depends(get_websocket_manager),
    progress_service: ProgressService = Depends(get_progress_service)
):
    """
    WebSocket connection for real-time task updates
    """
    await ws_manager.connect(websocket, task_id, client_id)

    # Send initial status if task exists
    initial_status = progress_service.get_progress(task_id)
    if initial_status:
        await websocket.send_json({
            'type': 'initial_status',
            'task_id': task_id,
            'data': initial_status
        })

    # Register progress listener
    def progress_callback(tid: str, status: dict):
        # This will be called from progress_service
        # We need to send updates via websocket
        import asyncio
        asyncio.create_task(
            ws_manager.send_progress_update(
                tid,
                status.get('progress', 0),
                status.get('message', ''),
                status
            )
        )

    progress_service.progress_manager.get_tracker(task_id)?.register_callback(progress_callback)

    try:
        # Handle incoming messages
        while True:
            message = await websocket.receive_text()
            data = json.loads(message)

            # Handle different message types
            msg_type = data.get('type')

            if msg_type == 'ping':
                await websocket.send_json({
                    'type': 'pong',
                    'timestamp': data.get('timestamp')
                })

            elif msg_type == 'cancel_task':
                # Forward cancel request to task manager
                # This would need task manager dependency
                await websocket.send_json({
                    'type': 'cancel_ack',
                    'task_id': task_id,
                    'status': 'processing'
                })

            elif msg_type == 'get_status':
                status = progress_service.get_progress(task_id)
                await websocket.send_json({
                    'type': 'status_update',
                    'task_id': task_id,
                    'data': status
                })

            logger.debug(f"Received WebSocket message from task {task_id}: {msg_type}")

    except WebSocketDisconnect:
        await ws_manager.disconnect(websocket, task_id)
        logger.info(f"WebSocket disconnected for task {task_id}")
    except Exception as e:
        logger.error(f"WebSocket error for task {task_id}: {e}")
        await ws_manager.disconnect(websocket, task_id)


@router.websocket("/system")
async def system_websocket(
    websocket: WebSocket,
    client_id: Optional[str] = Query(None, description="Client identifier"),
    ws_manager: WebSocketManager = Depends(get_websocket_manager)
):
    """
    WebSocket connection for system-wide updates
    """
    await ws_manager.connect(websocket, "system", client_id)

    try:
        while True:
            message = await websocket.receive_text()
            data = json.loads(message)

            if data.get('type') == 'ping':
                await websocket.send_json({
                    'type': 'pong',
                    'timestamp': data.get('timestamp')
                })

            elif data.get('type') == 'subscribe':
                # Subscribe to specific event types
                topics = data.get('topics', [])
                await websocket.send_json({
                    'type': 'subscribed',
                    'topics': topics
                })

    except WebSocketDisconnect:
        await ws_manager.disconnect(websocket, "system")
    except Exception as e:
        logger.error(f"System WebSocket error: {e}")
        await ws_manager.disconnect(websocket, "system")


@router.websocket("/health")
async def health_websocket(
    websocket: WebSocket,
    ws_manager: WebSocketManager = Depends(get_websocket_manager)
):
    """
    Simple health check WebSocket
    """
    await websocket.accept()

    try:
        await websocket.send_json({
            'type': 'connected',
            'message': 'WebSocket connection established',
            'timestamp': 'now'
        })

        while True:
            message = await websocket.receive_text()
            if message == 'ping':
                await websocket.send_text('pong')

    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"Health WebSocket error: {e}")
