"""
Main FastAPI application entry point.
"""
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
sys.path.insert(0, Path(__file__).parent.parent.absolute().as_posix())
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
    websocket_router,
    upload_router,
)
from warpapp.config import settings
from warpapp.api.dependencies import cleanup_resources
from warpapp.utils.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    logger.info("=" * 50)
    logger.info(f"Starting FileWarp API v{settings.API_VERSION}")
    logger.info(f"Environment: {'development' if settings.DEBUG else 'production'}")
    logger.info(f"Host: {settings.HOST}:{settings.PORT}")
    logger.info(f"Upload directory: {settings.UPLOAD_DIR}")
    logger.info(f"Output directory: {settings.OUTPUT_DIR}")
    logger.info("=" * 50)

    yield

    # Shutdown
    logger.info("Shutting down FileWarp API...")
    await cleanup_resources()
    logger.info("Shutdown complete")


# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(conversion_router, prefix=settings.API_V1_PREFIX)
app.include_router(pdf_router, prefix=settings.API_V1_PREFIX)
app.include_router(audio_router, prefix=settings.API_V1_PREFIX)
app.include_router(video_router, prefix=settings.API_V1_PREFIX)
app.include_router(image_router, prefix=settings.API_V1_PREFIX)
app.include_router(document_router, prefix=settings.API_V1_PREFIX)
app.include_router(ocr_router, prefix=settings.API_V1_PREFIX)
app.include_router(system_router, prefix=settings.API_V1_PREFIX)
app.include_router(tasks_router, prefix=settings.API_V1_PREFIX)
app.include_router(formats_router, prefix=settings.API_V1_PREFIX)
app.include_router(websocket_router, prefix=settings.API_V1_PREFIX)
app.include_router(upload_router, prefix=settings.API_V1_PREFIX)


# Mount static directories
if settings.OUTPUT_DIR.exists():
    app.mount(
        "/outputs", StaticFiles(directory=str(settings.OUTPUT_DIR)), name="outputs"
    )


@app.get(f"/{settings.API_V1_PREFIX}/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": settings.API_TITLE,
        "version": settings.API_VERSION,
        "description": settings.API_DESCRIPTION,
        "docs": "/docs" if settings.DEBUG else None,
        "health": f"/{settings.API_V1_PREFIX}/system/health",
    }


@app.get(f"/{settings.API_V1_PREFIX}/health")
async def health_check():
    """Simple health check endpoint"""
    return {"status": "healthy", "version": settings.API_VERSION}


def start():
    """Start the server using uvicorn"""
    uvicorn.run(
        "warpapp.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        workers=settings.WORKERS,
        log_level=settings.LOG_LEVEL.lower(),
    )


if __name__ == "__main__":
    start()
