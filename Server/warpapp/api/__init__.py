"""
API package for FileWarp backend.
Exposes all route modules for easy import.
"""

from warpapp.api.routes import (
    conversion_router,
    pdf_router,
    audio_router,
    video_router,
    image_router,
    document_router,
    ocr_router,
    system_router,
    tasks_router,
    formats_router,
    websocket_router
)

__all__ = [
    'conversion_router',
    'pdf_router',
    'audio_router',
    'video_router',
    'image_router',
    'document_router',
    'ocr_router',
    'system_router',
    'tasks_router',
    'formats_router',
    'websocket_router'
]
