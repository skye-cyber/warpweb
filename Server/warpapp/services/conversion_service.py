from typing import Dict, Any, Optional, List
from pathlib import Path
from ..core.task_manager import TaskManager
from ..core.file_handler import FileHandler
from ..models.requests import ConversionRequest, ConversionType
from ..models.tasks import TaskPriority
from warpapp.utils.logger import logger


class ConversionService:
    """
    Service layer for conversion operations
    Handles business logic and orchestrates between API and core modules
    """

    def __init__(self, task_manager: TaskManager, file_handler: FileHandler):
        self.task_manager = task_manager
        self.file_handler = file_handler
        self.supported_operations = self._init_supported_operations()

    def _init_supported_operations(self) -> Dict[str, Dict[str, Any]]:
        """Initialize supported operations with metadata"""
        return {
            # Document operations
            ConversionType.CONVERT_DOC.value: {
                "name": "Document Conversion",
                "category": "document",
                "input_formats": [".doc", ".docx", ".pdf", ".txt", ".rtf", ".odt"],
                "output_formats": [".pdf", ".docx", ".txt", ".html", ".jpg", ".png"],
                "requires_target_format": True,
                "supports_batch": True,
                "supports_directory": True,
                "description": "Convert documents between various formats",
            },
            ConversionType.CONVERT_DOC_ALT.value: {
                "name": "Document Conversion",
                "category": "document",
                "input_formats": [".doc", ".docx", ".pdf", ".txt", ".rtf", ".odt"],
                "output_formats": [".pdf", ".docx", ".txt", ".html", ".jpg", ".png"],
                "requires_target_format": True,
                "supports_batch": True,
                "supports_directory": True,
                "description": "Convert documents between various formats",
            },
            ConversionType.DOC_TO_IMAGE.value: {
                "name": "Document to Image",
                "category": "document",
                "input_formats": [".pdf", ".docx", ".doc", ".txt"],
                "output_formats": [".jpg", ".png", ".tiff", ".bmp"],
                "requires_target_format": True,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Convert documents to images",
            },
            ConversionType.HTML_TO_WORD.value: {
                "name": "HTML to Word",
                "category": "document",
                "input_formats": [".html", ".htm"],
                "output_formats": [".docx"],
                "requires_target_format": False,
                "supports_batch": True,
                "supports_directory": False,
                "description": "Convert HTML files to Word documents",
            },
            ConversionType.MARKDOWN_TO_DOCX.value: {
                "name": "Markdown to DOCX",
                "category": "document",
                "input_formats": [".md", ".markdown"],
                "output_formats": [".docx"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Convert Markdown to DOCX with Mermaid rendering",
            },
            # Audio operations
            ConversionType.CONVERT_AUDIO.value: {
                "name": "Audio Conversion",
                "category": "audio",
                "input_formats": [
                    ".mp3",
                    ".wav",
                    ".ogg",
                    ".flac",
                    ".m4a",
                    ".aac",
                    ".wma",
                ],
                "output_formats": [".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac"],
                "requires_target_format": True,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Convert audio files between formats",
            },
            ConversionType.JOIN_AUDIO.value: {
                "name": "Join Audio",
                "category": "audio",
                "input_formats": [".mp3", ".wav", ".ogg", ".flac", ".m4a"],
                "output_formats": [".mp3", ".wav", ".ogg", ".m4a"],
                "requires_target_format": False,
                "supports_batch": True,
                "supports_directory": False,
                "min_files": 2,
                "description": "Join multiple audio files into one",
            },
            ConversionType.AUDIO_EFFECTS.value: {
                "name": "Audio Effects",
                "category": "audio",
                "input_formats": [".mp3", ".wav", ".ogg", ".flac"],
                "output_formats": [".mp3", ".wav", ".ogg"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Apply effects to audio files",
            },
            ConversionType.RECORD.value: {
                "name": "Record Audio",
                "category": "audio",
                "input_formats": [],
                "output_formats": [".wav", ".mp3", ".ogg"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Record audio from microphone",
            },
            # Video operations
            ConversionType.CONVERT_VIDEO.value: {
                "name": "Video Conversion",
                "category": "video",
                "input_formats": [
                    ".mp4",
                    ".avi",
                    ".mkv",
                    ".mov",
                    ".flv",
                    ".wmv",
                    ".webm",
                ],
                "output_formats": [".mp4", ".avi", ".mkv", ".mov", ".webm", ".gif"],
                "requires_target_format": True,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Convert video files between formats",
            },
            ConversionType.EXTRACT_AUDIO.value: {
                "name": "Extract Audio",
                "category": "video",
                "input_formats": [".mp4", ".avi", ".mkv", ".mov", ".flv", ".webm"],
                "output_formats": [".mp3", ".wav", ".ogg", ".m4a"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Extract audio from video files",
            },
            ConversionType.ANALYZE_VIDEO.value: {
                "name": "Video Analysis",
                "category": "video",
                "input_formats": [
                    ".mp4",
                    ".avi",
                    ".mkv",
                    ".mov",
                    ".flv",
                    ".wmv",
                    ".webm",
                ],
                "output_formats": [],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Analyze video properties and metadata",
            },
            # Image operations
            ConversionType.CONVERT_IMAGE.value: {
                "name": "Image Conversion",
                "category": "image",
                "input_formats": [
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".gif",
                    ".bmp",
                    ".tiff",
                    ".webp",
                ],
                "output_formats": [".jpg", ".png", ".gif", ".bmp", ".tiff", ".webp"],
                "requires_target_format": True,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Convert images between formats",
            },
            ConversionType.RESIZE_IMAGE.value: {
                "name": "Resize Image",
                "category": "image",
                "input_formats": [
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".gif",
                    ".bmp",
                    ".tiff",
                    ".webp",
                ],
                "output_formats": [".jpg", ".png", ".gif", ".bmp", ".tiff", ".webp"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Resize or compress images",
            },
            ConversionType.IMAGES_TO_PDF.value: {
                "name": "Images to PDF",
                "category": "image",
                "input_formats": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],
                "output_formats": [".pdf"],
                "requires_target_format": False,
                "supports_batch": True,
                "supports_directory": True,
                "description": "Convert multiple images to a single PDF",
            },
            ConversionType.IMAGES_TO_WORD.value: {
                "name": "Images to Word",
                "category": "image",
                "input_formats": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],
                "output_formats": [".docx"],
                "requires_target_format": False,
                "supports_batch": True,
                "supports_directory": True,
                "description": "Convert images to Word document",
            },
            ConversionType.IMAGES_TO_GRAY.value: {
                "name": "Images to Grayscale",
                "category": "image",
                "input_formats": [
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".gif",
                    ".bmp",
                    ".tiff",
                    ".webp",
                ],
                "output_formats": [".jpg", ".png", ".bmp", ".tiff"],
                "requires_target_format": False,
                "supports_batch": True,
                "supports_directory": True,
                "description": "Convert images to grayscale",
            },
            # PDF operations
            ConversionType.PDF_JOIN.value: {
                "name": "Join PDFs",
                "category": "pdf",
                "input_formats": [".pdf"],
                "output_formats": [".pdf"],
                "requires_target_format": False,
                "supports_batch": True,
                "supports_directory": False,
                "min_files": 2,
                "description": "Join multiple PDF files into one",
            },
            ConversionType.EXTRACT_PAGES.value: {
                "name": "Extract Pages",
                "category": "pdf",
                "input_formats": [".pdf"],
                "output_formats": [".pdf"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Extract specific pages from PDF",
            },
            ConversionType.EXTRACT_IMAGES.value: {
                "name": "Extract Images",
                "category": "pdf",
                "input_formats": [".pdf"],
                "output_formats": [".jpg", ".png", ".tiff"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Extract images from PDF",
            },
            ConversionType.SCAN_PDF.value: {
                "name": "Scan PDF",
                "category": "pdf",
                "input_formats": [".pdf"],
                "output_formats": [".txt"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Extract text from PDF",
            },
            ConversionType.SCAN_AS_IMAGE.value: {
                "name": "Scan as Image",
                "category": "pdf",
                "input_formats": [".pdf"],
                "output_formats": [".txt"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Convert PDF to images then extract text",
            },
            ConversionType.SCAN_LONG.value: {
                "name": "Scan as Long Image",
                "category": "pdf",
                "input_formats": [".pdf", ".doc", ".docx"],
                "output_formats": [".txt"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Convert document to long image for text extraction",
            },
            ConversionType.PDF_TO_LONG_IMAGE.value: {
                "name": "PDF to Long Image",
                "category": "pdf",
                "input_formats": [".pdf"],
                "output_formats": [".jpg", ".png", ".tiff"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Convert PDF to a single long image",
            },
            # OCR
            ConversionType.OCR.value: {
                "name": "OCR",
                "category": "ocr",
                "input_formats": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"],
                "output_formats": [".txt"],
                "requires_target_format": False,
                "supports_batch": True,
                "supports_directory": True,
                "description": "Extract text from images using OCR",
            },
            # SVG
            ConversionType.CONVERT_SVG.value: {
                "name": "SVG Conversion",
                "category": "svg",
                "input_formats": [".svg"],
                "output_formats": [".png", ".pdf", ".svg"],
                "requires_target_format": True,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Convert SVG to PNG, PDF, or other formats",
            },
            # Text
            ConversionType.TEXT_TO_WORD.value: {
                "name": "Text to Word",
                "category": "text",
                "input_formats": [".txt"],
                "output_formats": [".docx"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Convert styled text to Word document",
            },
            # Voice
            ConversionType.VOICE_TYPE.value: {
                "name": "Voice Typing",
                "category": "voice",
                "input_formats": [],
                "output_formats": [".txt"],
                "requires_target_format": False,
                "supports_batch": False,
                "supports_directory": False,
                "description": "Use voice to type text",
            },
        }

    def submit_conversion(
        self, request: ConversionRequest, priority: TaskPriority = TaskPriority.MEDIUM
    ) -> str:
        """
        Submit a conversion task
        """
        # Validate operation
        if request.operation.value not in self.supported_operations:
            raise ValueError(f"Unsupported operation: {request.operation}")

        operation_info = self.supported_operations[request.operation.value]

        # Validate target format if required
        if (
            operation_info.get("requires_target_format", False)
            and not request.target_format
        ):
            raise ValueError(
                f"Target format required for operation: {request.operation.value}"
            )

        # Validate input count
        min_files = operation_info.get("min_files", 1)
        if len(request.input_paths) < min_files:
            raise ValueError(f"Operation requires at least {min_files} input file(s)")

        # Generate output path if not provided
        if not request.output_path and request.input_paths:
            request.output_path = self.file_handler.generate_output_path(
                request.input_paths[0], request.target_format
            )

        # Ensure output directory exists
        if request.output_path:
            self.file_handler.ensure_directory(str(Path(request.output_path).parent))

        # Create task
        task_id = self.task_manager.create_task(
            operation=request.operation.value, params=request.dict(), priority=priority
        )

        logger.info(
            f"Submitted {request.operation.value} task {task_id} with {len(request.input_paths)} input(s)"
        )

        return task_id

    def get_operation_info(self, operation: str) -> Optional[Dict[str, Any]]:
        """Get information about an operation"""
        return self.supported_operations.get(operation)

    def list_operations(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """List all supported operations, optionally filtered by category"""
        operations = []

        for op, info in self.supported_operations.items():
            if not category or info.get("category") == category:
                operations.append(
                    {
                        "operation": op,
                        "name": info["name"],
                        "category": info["category"],
                        "description": info["description"],
                        "input_formats": info["input_formats"],
                        "output_formats": info["output_formats"],
                        "supports_batch": info["supports_batch"],
                    }
                )

        return sorted(operations, key=lambda x: (x["category"], x["name"]))

    def get_categories(self) -> List[Dict[str, Any]]:
        """Get all operation categories with counts"""
        categories = {}

        for op, info in self.supported_operations.items():
            cat = info["category"]
            if cat not in categories:
                categories[cat] = {
                    "name": cat.capitalize(),
                    "count": 0,
                    "operations": [],
                }
            categories[cat]["count"] += 1
            categories[cat]["operations"].append(op)

        return [
            {"id": k, "name": v["name"], "count": v["count"]}
            for k, v in categories.items()
        ]

    def validate_input_files(self, paths: List[str], operation: str) -> List[str]:
        """Validate input files for an operation"""
        operation_info = self.get_operation_info(operation)
        if not operation_info:
            raise ValueError(f"Unknown operation: {operation}")

        valid_formats = operation_info["input_formats"]
        invalid_files = []

        for path in paths:
            if not self.file_handler.validate_path(path):
                invalid_files.append(f"{path} (not accessible)")
            elif valid_formats and not self.file_handler.validate_file_type(
                path, valid_formats
            ):
                invalid_files.append(
                    f"{path} (invalid format, expected: {', '.join(valid_formats)})"
                )

        return invalid_files

    def estimate_completion_time(
        self, operation: str, input_paths: List[str]
    ) -> Optional[float]:
        """Estimate completion time based on file sizes and operation type"""
        if not input_paths:
            return None

        # Get total size
        total_size = 0
        for path in input_paths:
            try:
                info = self.file_handler.get_file_info(path)
                total_size += info["size"]
            except:
                pass

        # Rough estimates based on operation type
        operation_info = self.get_operation_info(operation)
        if not operation_info:
            return None

        category = operation_info.get("category")

        # Rough estimates: 1MB = X seconds
        if category == "document":
            time_per_mb = 0.5  # 0.5 seconds per MB
        elif category == "audio":
            time_per_mb = 0.3  # 0.3 seconds per MB
        elif category == "video":
            time_per_mb = 1.0  # 1 second per MB
        elif category == "image":
            time_per_mb = 0.2  # 0.2 seconds per MB
        elif category == "pdf":
            time_per_mb = 0.4  # 0.4 seconds per MB
        else:
            time_per_mb = 0.5  # Default

        estimated_seconds = (total_size / (1024 * 1024)) * time_per_mb

        # Add base overhead
        estimated_seconds += 2.0

        return estimated_seconds
