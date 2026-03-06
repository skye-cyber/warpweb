import os
import shutil
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict, Any
import hashlib
import mimetypes
import humanize
from warpapp.utils.logger import logger


class FileHandler:
    """
    Handles file operations, validation, and path management
    """

    def __init__(
        self, base_upload_dir: str = "uploads", base_output_dir: str = "outputs"
    ):
        self.base_upload_dir = Path(base_upload_dir)
        self.base_output_dir = Path(base_output_dir)
        self._ensure_directories()

    def _ensure_directories(self):
        """Ensure required directories exist"""
        self.base_upload_dir.mkdir(parents=True, exist_ok=True)
        self.base_output_dir.mkdir(parents=True, exist_ok=True)
        logger.info(
            f"File handler initialized with upload dir: {self.base_upload_dir}, output dir: {self.base_output_dir}"
        )

    def validate_path(
        self, path: str, check_read: bool = True, check_write: bool = False
    ) -> bool:
        """
        Validate that a path exists and has required permissions
        """
        try:
            p = Path(path).resolve()

            # Check if path exists
            if not p.exists():
                logger.debug(f"Path does not exist: {path}")
                return False

            # Check read permission
            if check_read and not os.access(p, os.R_OK):
                logger.debug(f"No read permission: {path}")
                return False

            # Check write permission (for parent directory if file doesn't exist)
            if check_write:
                target = p if p.exists() else p.parent
                if not os.access(target, os.W_OK):
                    logger.debug(f"No write permission: {target}")
                    return False

            return True

        except Exception as e:
            logger.error(f"Error validating path {path}: {e}")
            return False

    def validate_file_type(self, path: str, allowed_extensions: List[str]) -> bool:
        """
        Validate file type by extension
        """
        ext = Path(path).suffix.lower()
        return ext in allowed_extensions

    def get_file_info(self, path: str) -> Dict[str, Any]:
        """
        Get detailed file information
        """
        p = Path(path)

        if not p.exists():
            raise FileNotFoundError(f"File not found: {path}")

        stat = p.stat()
        mime_type, _ = mimetypes.guess_type(path)

        return {
            "name": p.name,
            "path": str(p.absolute()),
            "parent": str(p.parent),
            "size": stat.st_size,
            "size_human": humanize.naturalsize(stat.st_size),
            "created": datetime.fromtimestamp(stat.st_ctime).isoformat(),
            "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            "accessed": datetime.fromtimestamp(stat.st_atime).isoformat(),
            "extension": p.suffix.lower(),
            "mime_type": mime_type or "application/octet-stream",
            "is_file": p.is_file(),
            "is_directory": p.is_dir(),
            "is_symlink": p.is_symlink(),
            "permissions": oct(stat.st_mode)[-3:],
        }

    def generate_output_path(
        self,
        input_path: str,
        target_format: Optional[str] = None,
        suffix: str = "_converted",
    ) -> str:
        """
        Generate an output path based on input
        """
        input_path = Path(input_path)

        # Create date-based subdirectory
        date_dir = datetime.now().strftime("%Y%m%d")
        output_dir = self.base_output_dir / date_dir
        output_dir.mkdir(parents=True, exist_ok=True)

        if target_format:
            # Use target format for extension
            output_filename = f"{input_path.stem}{suffix}.{target_format}"
        else:
            # Keep original extension with suffix
            output_filename = f"{input_path.stem}{suffix}{input_path.suffix}"

        # Ensure unique filename
        output_path = output_dir / output_filename
        counter = 1
        while output_path.exists():
            output_path = (
                output_dir
                / f"{input_path.stem}{suffix}_{counter}{input_path.suffix if not target_format else '.' + target_format}"
            )
            counter += 1

        return str(output_path)

    def ensure_directory(self, path: str) -> bool:
        """
        Ensure directory exists, create if it doesn't
        """
        try:
            p = Path(path)
            p.mkdir(parents=True, exist_ok=True)
            return True
        except Exception as e:
            logger.error(f"Failed to create directory {path}: {e}")
            return False

    def copy_file(self, source: str, destination: str) -> bool:
        """
        Copy file from source to destination
        """
        try:
            # Ensure destination directory exists
            Path(destination).parent.mkdir(parents=True, exist_ok=True)

            shutil.copy2(source, destination)
            logger.info(f"Copied {source} to {destination}")
            return True
        except Exception as e:
            logger.error(f"Failed to copy {source} to {destination}: {e}")
            return False

    def move_file(self, source: str, destination: str) -> bool:
        """
        Move file from source to destination
        """
        try:
            # Ensure destination directory exists
            Path(destination).parent.mkdir(parents=True, exist_ok=True)

            shutil.move(source, destination)
            logger.info(f"Moved {source} to {destination}")
            return True
        except Exception as e:
            logger.error(f"Failed to move {source} to {destination}: {e}")
            return False

    def delete_file(self, path: str) -> bool:
        """
        Delete a file
        """
        try:
            p = Path(path)
            if p.is_file():
                p.unlink()
                logger.info(f"Deleted file: {path}")
                return True
            elif p.is_dir():
                shutil.rmtree(p)
                logger.info(f"Deleted directory: {path}")
                return True
        except Exception as e:
            logger.error(f"Failed to delete {path}: {e}")
            return False

    def get_file_hash(self, path: str, algorithm: str = "sha256") -> str:
        """
        Calculate file hash
        """
        hash_func = hashlib.new(algorithm)

        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_func.update(chunk)

        return hash_func.hexdigest()

    def list_directory(
        self, path: str, pattern: Optional[str] = None, recursive: bool = False
    ) -> List[Dict[str, Any]]:
        """
        List contents of a directory
        """
        p = Path(path)

        if not p.exists() or not p.is_dir():
            raise NotADirectoryError(f"Not a directory: {path}")

        if recursive:
            files = list(p.rglob(pattern)) if pattern else list(p.rglob("*"))
        else:
            files = list(p.glob(pattern)) if pattern else list(p.glob("*"))

        return [self.get_file_info(str(f)) for f in files]

    def get_temp_path(
        self, prefix: str = "tmp", extension: Optional[str] = None
    ) -> str:
        """
        Generate a temporary file path
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        filename = f"{prefix}_{timestamp}"

        if extension:
            if not extension.startswith("."):
                extension = f".{extension}"
            filename += extension

        return str(self.base_upload_dir / filename)

    def cleanup_old_files(self, directory: str, days: int = 1, pattern: str = "*"):
        """
        Delete files older than specified days
        """
        cutoff = datetime.now().timestamp() - (days * 24 * 3600)
        deleted = 0

        for file_path in Path(directory).glob(pattern):
            if file_path.is_file() and file_path.stat().st_mtime < cutoff:
                try:
                    file_path.unlink()
                    deleted += 1
                except Exception as e:
                    logger.error(f"Failed to delete {file_path}: {e}")

        logger.info(f"Cleaned up {deleted} old files from {directory}")
        return deleted
