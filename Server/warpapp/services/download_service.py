import os
import uuid
import asyncio
# import shutil
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime
import aiofiles
from fastapi import UploadFile, HTTPException  # BackgroundTasks
from warpapp.utils.logger import logger
from warpapp.config import settings


class DownloaderService:
    def __init__(self, upload_dir: str | Path = settings.UPLOAD_DIR):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.active_downloads: Dict[str, Dict] = {}

    async def save_upload_file(
        self,
        file: UploadFile,
        custom_filename: Optional[str] = None,
        subdir: Optional[str] = None
    ) -> str:
        """
        Save uploaded file to disk and return the absolute path
        """
        # Generate safe filename
        original_filename = custom_filename or file.filename
        safe_filename = self._sanitize_filename(original_filename)

        # Add timestamp to avoid collisions
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = uuid.uuid4().hex[:8]
        final_filename = f"{timestamp}_{unique_id}_{safe_filename}"

        # Determine full path
        if subdir:
            target_dir = self.upload_dir / subdir
            target_dir.mkdir(parents=True, exist_ok=True)
            file_path = target_dir / final_filename
        else:
            file_path = self.upload_dir / final_filename

        # Save file asynchronously with progress tracking
        download_id = str(uuid.uuid4())
        self.active_downloads[download_id] = {
            "id": download_id,
            "filename": final_filename,
            "original_name": original_filename,
            "path": str(file_path),
            "size": 0,
            "progress": 0,
            "status": "uploading",
            "created_at": datetime.now().isoformat()
        }

        try:
            # Stream write to disk
            file_size = 0
            async with aiofiles.open(file_path, 'wb') as buffer:
                while chunk := await file.read(1024 * 1024):  # 1MB chunks
                    await buffer.write(chunk)
                    file_size += len(chunk)
                    # Update progress (if content-length available)
                    if file.size:
                        progress = (file_size / file.size) * 100
                        self.active_downloads[download_id]["progress"] = progress
                        self.active_downloads[download_id]["size"] = file_size

            self.active_downloads[download_id]["status"] = "completed"
            self.active_downloads[download_id]["progress"] = 100

            logger.info(f"File saved: {file_path}")
            return str(file_path.absolute())

        except Exception as e:
            self.active_downloads[download_id]["status"] = "failed"
            self.active_downloads[download_id]["error"] = str(e)
            logger.error(f"Failed to save file {file.filename}: {e}")
            raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

    async def save_multiple_files(
        self,
        files: List[UploadFile],
        subdir: Optional[str] = None
    ) -> List[str]:
        """
        Save multiple files concurrently
        """
        tasks = [self.save_upload_file(file, subdir=subdir) for file in files]
        return await asyncio.gather(*tasks)

    def _sanitize_filename(self, filename: str) -> str:
        """Remove unsafe characters from filename"""
        import re
        # Remove path traversal attempts
        filename = os.path.basename(filename)
        # Remove unsafe characters
        filename = re.sub(r'[^\w\-\.]', '_', filename)
        return filename

    def get_download_status(self, download_id: str) -> Optional[Dict]:
        """Get status of a specific download"""
        return self.active_downloads.get(download_id)

    def cleanup_old_files(self, days: int = 7):
        """Remove files older than specified days"""
        cutoff = datetime.now().timestamp() - (days * 86400)
        for file_path in self.upload_dir.rglob("*"):
            if file_path.is_file() and file_path.stat().st_mtime < cutoff:
                try:
                    file_path.unlink()
                    logger.info(f"Cleaned up old file: {file_path}")
                except Exception as e:
                    logger.error(f"Failed to cleanup {file_path}: {e}")


# Initialize downloader service
downloader = DownloaderService()
