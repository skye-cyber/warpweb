from .conversion import router as conversion_router
from .pdf import router as pdf_router
from .audio import router as audio_router
from .video import router as video_router
from .image import router as image_router
from .document import router as document_router
from .ocr import router as ocr_router
from .system import router as system_router
from .tasks import router as tasks_router
from .formats import router as formats_router
from .websocket import router as websocket_router

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
