from typing import Optional, List, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field, validator
from pathlib import Path
import os


class TaskResponse(BaseModel):
    task_id: str
    status: str
    message: str
    created_at: str


class OperationResult(BaseModel):
    success: bool
    message: str
    output_path: Optional[str]
    metadata: Optional[Dict[str, Any]]


class ConversionType(str, Enum):
    """All supported conversion operations"""

    # Document operations
    CONVERT_DOC = "convert-doc"
    CONVERT_DOC_ALT = "convert_doc"
    DOC_TO_IMAGE = "doc-to-image"
    DOC_TO_IMAGE_ALT = "doc_to_image"
    HTML_TO_WORD = "html-to-word"
    HTML_TO_WORD_ALT = "html_to_word"
    MARKDOWN_TO_DOCX = "markdown-to-docx"
    MARKDOWN_TO_DOCX_ALT = "markdown_to_docx"

    # Audio operations
    CONVERT_AUDIO = "convert-audio"
    CONVERT_AUDIO_ALT = "convert_audio"
    EXTRACT_AUDIO = "extract-audio"
    EXTRACT_AUDIO_ALT = "extract_audio"
    JOIN_AUDIO = "join-audio"
    JOIN_AUDIO_ALT = "join_audio"
    AUDIO_EFFECTS = "audio-effects"
    AUDIO_EFFECTS_ALT = "audio_effects"
    RECORD = "record"

    # Video operations
    CONVERT_VIDEO = "convert-video"
    CONVERT_VIDEO_ALT = "convert_video"
    ANALYZE_VIDEO = "analyze-video"
    ANALYZE_VIDEO_ALT = "analyze_video"

    # Image operations
    CONVERT_IMAGE = "convert-image"
    CONVERT_IMAGE_ALT = "convert_image"
    RESIZE_IMAGE = "resize-image"
    RESIZE_IMAGE_ALT = "resize_image"
    IMAGES_TO_PDF = "images-to-pdf"
    IMAGES_TO_PDF_ALT = "images_to_pdf"
    IMAGES_TO_WORD = "images-to-word"
    IMAGES_TO_WORD_ALT = "images_to_word"
    IMAGES_TO_GRAY = "images-to-gray"
    IMAGES_TO_GRAY_ALT = "images_to_gray"

    # PDF operations
    PDF_JOIN = "pdf-join"
    PDF_JOIN_ALT = "pdf_join"
    EXTRACT_PAGES = "extract-pages"
    EXTRACT_PAGES_ALT = "extract_pages"
    EXTRACT_IMAGES = "extract-images"
    EXTRACT_IMAGES_ALT = "extract_images"
    SCAN_PDF = "scan-pdf"
    SCAN_PDF_ALT = "scan_pdf"
    SCAN_AS_IMAGE = "scan-as-image"
    SCAN_AS_IMAGE_ALT = "scan_as_image"
    SCAN_LONG = "scan-long"
    SCAN_LONG_ALT = "scan_long"
    PDF_TO_LONG_IMAGE = "pdf-to-long-image"
    PDF_TO_LONG_IMAGE_ALT = "pdf_to_long_image"

    # OCR
    OCR = "ocr"

    # SVG
    CONVERT_SVG = "convert-svg"
    CONVERT_SVG_ALT = "convert_svg"

    # Text
    TEXT_TO_WORD = "text-to-word"
    TEXT_TO_WORD_ALT = "text_to_word"

    # Voice
    VOICE_TYPE = "voice-type"
    VOICE_TYPE_ALT = "voice_type"


class ConversionRequest(BaseModel):
    """Base request model for all conversion operations"""

    operation: ConversionType
    input_paths: List[str] = Field(
        ..., description="Input file/directory paths", min_items=1
    )
    output_path: Optional[str] = Field(
        None, description="Output path (auto-generated if not provided)"
    )
    target_format: Optional[str] = Field(
        None, description="Target format for conversion"
    )

    # Common options
    threads: Optional[int] = Field(
        3, description="Number of threads to use", ge=1, le=10
    )
    no_resume: Optional[bool] = Field(
        False, description="Don't resume previous operation"
    )

    # Operation-specific options (will be validated in respective handlers)
    options: Dict[str, Any] = Field(
        default_factory=dict, description="Operation-specific options"
    )

    @validator("input_paths")
    def validate_input_paths(cls, v):
        """Validate that input paths exist"""
        for path in v:
            if not os.path.exists(path):
                raise ValueError(f"Path does not exist: {path}")
        return v

    class Config:
        schema_extra = {
            "example": {
                "operation": "convert-doc",
                "input_paths": ["/home/user/document.docx"],
                "target_format": "pdf",
                "threads": 3,
                "options": {"use_extras": False, "isolate": None},
            }
        }


class DocumentConversionRequest(ConversionRequest):
    """Document-specific conversion request"""

    options: Dict[str, Any] = Field(
        default_factory=lambda: {"use_extras": False, "isolate": None}
    )


class AudioConversionRequest(ConversionRequest):
    """Audio-specific conversion request"""

    options: Dict[str, Any] = Field(
        default_factory=lambda: {"bitrate": None, "sample_rate": None}
    )


class AudioJoinRequest(BaseModel):
    """Request model for joining audio files"""

    input_paths: List[str] = Field(..., description="Audio files to join", min_items=2)
    output_path: Optional[str] = None

    @validator("input_paths")
    def validate_audio_files(cls, v):
        valid_extensions = [".mp3", ".wav", ".ogg", ".flac", ".m4a", ".aac"]
        for path in v:
            if not os.path.exists(path):
                raise ValueError(f"File does not exist: {path}")
            ext = Path(path).suffix.lower()
            if ext not in valid_extensions:
                raise ValueError(f"Unsupported audio format: {ext}")
        return v


class VideoAnalysisRequest(BaseModel):
    """Request model for video analysis"""

    video_path: str = Field(..., description="Path to video file")
    analyze_audio: Optional[bool] = Field(False, description="Include audio analysis")
    extract_metadata: Optional[bool] = Field(True, description="Extract metadata")

    @validator("video_path")
    def validate_video(cls, v):
        if not os.path.exists(v):
            raise ValueError(f"Video file does not exist: {v}")
        valid_extensions = [".mp4", ".avi", ".mkv", ".mov", ".flv", ".wmv", ".webm"]
        ext = Path(v).suffix.lower()
        if ext not in valid_extensions:
            raise ValueError(f"Unsupported video format: {ext}")
        return v


class ImageResizeRequest(BaseModel):
    """Request model for image resizing"""

    image_path: str = Field(..., description="Path to image file")
    target_size: str = Field(
        ..., description="Target size (e.g., '2mb', '800x600', '50%')"
    )
    output_format: Optional[str] = Field(None, description="Output format")
    output_path: Optional[str] = None

    @validator("target_size")
    def validate_target_size(cls, v):
        import re

        # Pattern for: 2mb, 800x600, 50%, 1024x768
        patterns = [
            r"^\d+(\.\d+)?\s*(mb|kb|gb)$",  # Size with unit
            r"^\d+\s*x\s*\d+$",  # Dimensions
            r"^\d+(\.\d+)?%$",  # Percentage
        ]
        if not any(re.match(p, v.lower()) for p in patterns):
            raise ValueError(f"Invalid size format: {v}. Use format: 2mb, 800x600, 50%")
        return v


class PDFJoinRequest(BaseModel):
    """Request model for joining PDFs"""

    pdf_paths: List[str] = Field(..., description="PDF files to join", min_items=2)
    output_path: Optional[str] = None
    order: Optional[str] = Field("AAB", description="Page order pattern")

    @validator("pdf_paths")
    def validate_pdfs(cls, v):
        for path in v:
            if not os.path.exists(path):
                raise ValueError(f"PDF does not exist: {path}")
            if not path.lower().endswith(".pdf"):
                raise ValueError(f"Not a PDF file: {path}")
        return v


class PageExtractionRequest(BaseModel):
    """Request model for extracting pages from PDF"""

    pdf_path: str = Field(..., description="Path to PDF file")
    pages: List[int] = Field(..., description="Page numbers to extract", min_items=1)
    output_path: Optional[str] = None

    @validator("pages")
    def validate_pages(cls, v):
        for page in v:
            if page < 1:
                raise ValueError(f"Page numbers must be >= 1, got: {page}")
        return v


class OCRRequest(BaseModel):
    """Request model for OCR operations"""

    image_paths: List[str] = Field(..., description="Images to process", min_items=1)
    language: Optional[str] = Field("eng", description="OCR language")
    separator: Optional[str] = Field("\n", description="Text separator")
    output_path: Optional[str] = None

    @validator("image_paths")
    def validate_images(cls, v):
        valid_extensions = [".png", ".jpg", ".jpeg", ".tiff", ".bmp", ".gif"]
        for path in v:
            if not os.path.exists(path):
                raise ValueError(f"Image does not exist: {path}")
            ext = Path(path).suffix.lower()
            if ext not in valid_extensions:
                raise ValueError(f"Unsupported image format: {ext}")
        return v


class TextToWordRequest(BaseModel):
    """Request model for text to Word conversion"""

    text_path: str = Field(..., description="Path to text file")
    font_size: Optional[int] = Field(12, description="Font size", ge=8, le=72)
    font_name: Optional[str] = Field("Times New Roman", description="Font name")
    output_path: Optional[str] = None

    @validator("text_path")
    def validate_text_file(cls, v):
        if not os.path.exists(v):
            raise ValueError(f"Text file does not exist: {v}")
        if not v.lower().endswith(".txt"):
            raise ValueError(f"Not a text file: {v}")
        return v
