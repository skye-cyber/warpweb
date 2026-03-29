from warpapp.api.routes.conversion import router as conversion_router
from warpapp.api.routes.pdf import router as pdf_router
from warpapp.api.routes.audio import router as audio_router
from warpapp.api.routes.video import router as video_router
from warpapp.api.routes.image import router as image_router
from warpapp.api.routes.document import router as document_router
from warpapp.api.routes.ocr import router as ocr_router
from warpapp.api.routes.system import router as system_router
from warpapp.api.routes.tasks import router as tasks_router
from warpapp.api.routes.formats import router as formats_router
from warpapp.api.routes.websocket import router as websocket_router
from warpapp.api.routes.upload import router as upload_router

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
    'upload_router',
    'websocket_router'
]
