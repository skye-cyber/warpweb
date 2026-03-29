from fastapi import APIRouter, File, UploadFile, HTTPException, BackgroundTasks, Form
from fastapi.responses import JSONResponse
from typing import List, Optional

# import asyncio
import aiohttp
import json
from pathlib import Path
from warpapp.utils.logger import logger
from ...models.requests import ConversionRequest
from ...services.download_service import downloader


router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/")
async def upload(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
):
    """
    Endpoint that accepts blob files, saves them to disk, then calls existing conversion endpoint
    """
    try:
        # Save all uploaded files
        saved_paths = await downloader.save_multiple_files(
            files
        )

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "files": saved_paths,
                "file_count": len(saved_paths),
                "message": "Files uploaded successfully",
            },
        )

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid options JSON")
    except Exception as e:
        logger.error(f"Upload and convert failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# New endpoint to handle blob uploads and bridge to conversion
@router.post("/convert")
async def upload_and_convert(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    operation: str = Form(...),
    target_format: str = Form(...),
    options: str = Form("{}"),  # JSON string
    threads: int = Form(3),
    cleanup_after: bool = Form(True),  # Whether to cleanup files after conversion
):
    """
    Endpoint that accepts blob files, saves them to disk, then calls existing conversion endpoint
    """
    try:
        # Parse options from JSON string
        options_dict = json.loads(options)

        # Save all uploaded files
        saved_paths = await downloader.save_multiple_files(
            files, subdir="pending_conversion"
        )

        # Prepare request for existing conversion endpoint
        conversion_request = ConversionRequest(
            input_paths=saved_paths,
            operation=operation,
            options=options_dict,
            target_format=target_format,
            threads=threads,
        )

        # Call existing conversion endpoint
        # Using background tasks to handle conversion asynchronously
        conversion_result = await call_conversion_endpoint(conversion_request)

        # Optionally cleanup files after conversion
        if cleanup_after:
            background_tasks.add_task(cleanup_files, saved_paths)

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "conversion_result": conversion_result,
                "uploaded_files": saved_paths,
                "message": "Files uploaded and conversion started",
            },
        )

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid options JSON")
    except Exception as e:
        logger.error(f"Upload and convert failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def call_conversion_endpoint(conversion_request: ConversionRequest):
    """
    Call your existing conversion endpoint
    """
    # Assuming your conversion endpoint is at /api/v1/conversion/submit
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "http://localhost:8000/api/v1/conversion/submit",  # Adjust URL as needed
            json=conversion_request.dict(),
        ) as response:
            if response.status != 200:
                error_text = await response.text()
                raise Exception(f"Conversion endpoint failed: {error_text}")
            return await response.json()


def cleanup_files(file_paths: List[str]):
    """
    Clean up temporary files
    """
    for file_path in file_paths:
        try:
            path = Path(file_path)
            if path.exists():
                path.unlink()
                logger.info(f"Cleaned up: {file_path}")
        except Exception as e:
            logger.error(f"Failed to cleanup {file_path}: {e}")


# Optional: Endpoint for checking upload status
@router.get("/upload-status/{download_id}")
async def get_upload_status(download_id: str):
    """
    Get status of an ongoing upload
    """
    status = downloader.get_download_status(download_id)
    if not status:
        raise HTTPException(status_code=404, detail="Upload not found")
    return status


# Endpoint that accepts blobs directly (more flexible)
@router.post("/blobs")
async def upload_blobs(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    auto_convert: bool = False,
    conversion_params: Optional[str] = Form(None),
):
    """
    Simple blob upload endpoint that saves files
    """
    saved_paths = await downloader.save_multiple_files(files, subdir="blob_uploads")

    result = {"success": True, "files": saved_paths, "file_count": len(saved_paths)}

    # If auto_convert is true, trigger conversion
    if auto_convert and conversion_params:
        pass
        # params = json.loads(conversion_params)
        # background_tasks.add_task(
        #     trigger_conversion,
        #     saved_paths,
        #     params.get("operation"),
        #     params.get("target_format"),
        #     params.get("options", {}),
        #     params.get("threads", 3),
        # )
        # result["conversion_triggered"] = True

    return result
