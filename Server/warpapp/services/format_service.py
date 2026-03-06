from typing import Dict, Any, Optional, List, Tuple
from warpapp.utils.logger import logger


class FormatService:
    """
    Service for managing file format information and validation
    """

    def __init__(self):
        self.format_registry = self._init_format_registry()

    def _init_format_registry(self) -> Dict[str, Dict[str, Any]]:
        """Initialize format registry with all supported formats"""
        return {
            # Document formats
            "pdf": {
                "name": "PDF",
                "category": "document",
                "extensions": [".pdf"],
                "mime_types": ["application/pdf"],
                "description": "Portable Document Format",
                "can_convert_to": [".docx", ".txt", ".jpg", ".png", ".html"],
                "can_convert_from": [".docx", ".doc", ".txt", ".html", ".jpg", ".png"],
            },
            "docx": {
                "name": "Word Document",
                "category": "document",
                "extensions": [".docx"],
                "mime_types": [
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ],
                "description": "Microsoft Word Document",
                "can_convert_to": [".pdf", ".txt", ".html", ".jpg", ".png"],
                "can_convert_from": [".pdf", ".txt", ".html", ".md"],
            },
            "doc": {
                "name": "Word Document (Legacy)",
                "category": "document",
                "extensions": [".doc"],
                "mime_types": ["application/msword"],
                "description": "Microsoft Word 97-2003 Document",
                "can_convert_to": [".pdf", ".docx", ".txt"],
                "can_convert_from": [".pdf", ".docx", ".txt"],
            },
            "txt": {
                "name": "Text File",
                "category": "document",
                "extensions": [".txt"],
                "mime_types": ["text/plain"],
                "description": "Plain Text File",
                "can_convert_to": [".pdf", ".docx", ".html"],
                "can_convert_from": [".pdf", ".docx", ".html"],
            },
            "html": {
                "name": "HTML",
                "category": "document",
                "extensions": [".html", ".htm"],
                "mime_types": ["text/html"],
                "description": "HyperText Markup Language",
                "can_convert_to": [".pdf", ".docx", ".txt"],
                "can_convert_from": [".md", ".txt"],
            },
            "md": {
                "name": "Markdown",
                "category": "document",
                "extensions": [".md", ".markdown"],
                "mime_types": ["text/markdown"],
                "description": "Markdown Document",
                "can_convert_to": [".html", ".pdf", ".docx"],
                "can_convert_from": [],
            },
            # Audio formats
            "mp3": {
                "name": "MP3 Audio",
                "category": "audio",
                "extensions": [".mp3"],
                "mime_types": ["audio/mpeg"],
                "description": "MPEG Audio Layer III",
                "can_convert_to": [".wav", ".ogg", ".flac", ".aac"],
                "can_convert_from": [
                    ".wav",
                    ".ogg",
                    ".flac",
                    ".aac",
                    ".mp4",
                    ".avi",
                    ".mkv",
                ],
            },
            "wav": {
                "name": "WAV Audio",
                "category": "audio",
                "extensions": [".wav"],
                "mime_types": ["audio/wav"],
                "description": "Waveform Audio File Format",
                "can_convert_to": [".mp3", ".ogg", ".flac", ".aac"],
                "can_convert_from": [
                    ".mp3",
                    ".ogg",
                    ".flac",
                    ".aac",
                    ".mp4",
                    ".avi",
                    ".mkv",
                ],
            },
            "ogg": {
                "name": "OGG Audio",
                "category": "audio",
                "extensions": [".ogg"],
                "mime_types": ["audio/ogg"],
                "description": "Ogg Vorbis Audio",
                "can_convert_to": [".mp3", ".wav", ".flac"],
                "can_convert_from": [".mp3", ".wav", ".flac"],
            },
            "flac": {
                "name": "FLAC Audio",
                "category": "audio",
                "extensions": [".flac"],
                "mime_types": ["audio/flac"],
                "description": "Free Lossless Audio Codec",
                "can_convert_to": [".mp3", ".wav", ".ogg"],
                "can_convert_from": [".mp3", ".wav", ".ogg"],
            },
            "aac": {
                "name": "AAC Audio",
                "category": "audio",
                "extensions": [".aac", ".m4a"],
                "mime_types": ["audio/aac", "audio/mp4"],
                "description": "Advanced Audio Coding",
                "can_convert_to": [".mp3", ".wav", ".ogg"],
                "can_convert_from": [".mp3", ".wav", ".ogg", ".mp4"],
            },
            # Video formats
            "mp4": {
                "name": "MP4 Video",
                "category": "video",
                "extensions": [".mp4"],
                "mime_types": ["video/mp4"],
                "description": "MPEG-4 Part 14",
                "can_convert_to": [".avi", ".mkv", ".mov", ".webm", ".gif"],
                "can_convert_from": [".avi", ".mkv", ".mov", ".webm"],
            },
            "avi": {
                "name": "AVI Video",
                "category": "video",
                "extensions": [".avi"],
                "mime_types": ["video/x-msvideo"],
                "description": "Audio Video Interleave",
                "can_convert_to": [".mp4", ".mkv", ".mov", ".webm"],
                "can_convert_from": [".mp4", ".mkv", ".mov", ".webm"],
            },
            "mkv": {
                "name": "MKV Video",
                "category": "video",
                "extensions": [".mkv"],
                "mime_types": ["video/x-matroska"],
                "description": "Matroska Video",
                "can_convert_to": [".mp4", ".avi", ".mov", ".webm"],
                "can_convert_from": [".mp4", ".avi", ".mov", ".webm"],
            },
            "mov": {
                "name": "MOV Video",
                "category": "video",
                "extensions": [".mov"],
                "mime_types": ["video/quicktime"],
                "description": "QuickTime Video",
                "can_convert_to": [".mp4", ".avi", ".mkv", ".webm"],
                "can_convert_from": [".mp4", ".avi", ".mkv", ".webm"],
            },
            "webm": {
                "name": "WebM Video",
                "category": "video",
                "extensions": [".webm"],
                "mime_types": ["video/webm"],
                "description": "WebM Video",
                "can_convert_to": [".mp4", ".avi", ".mkv", ".mov"],
                "can_convert_from": [".mp4", ".avi", ".mkv", ".mov"],
            },
            # Image formats
            "jpg": {
                "name": "JPEG Image",
                "category": "image",
                "extensions": [".jpg", ".jpeg"],
                "mime_types": ["image/jpeg"],
                "description": "JPEG Image",
                "can_convert_to": [".png", ".gif", ".bmp", ".tiff", ".webp", ".pdf"],
                "can_convert_from": [".png", ".gif", ".bmp", ".tiff", ".webp"],
            },
            "png": {
                "name": "PNG Image",
                "category": "image",
                "extensions": [".png"],
                "mime_types": ["image/png"],
                "description": "Portable Network Graphics",
                "can_convert_to": [".jpg", ".gif", ".bmp", ".tiff", ".webp", ".pdf"],
                "can_convert_from": [".jpg", ".gif", ".bmp", ".tiff", ".webp"],
            },
            "gif": {
                "name": "GIF Image",
                "category": "image",
                "extensions": [".gif"],
                "mime_types": ["image/gif"],
                "description": "Graphics Interchange Format",
                "can_convert_to": [".jpg", ".png", ".bmp"],
                "can_convert_from": [".jpg", ".png", ".bmp"],
            },
            "bmp": {
                "name": "BMP Image",
                "category": "image",
                "extensions": [".bmp"],
                "mime_types": ["image/bmp"],
                "description": "Bitmap Image",
                "can_convert_to": [".jpg", ".png", ".gif", ".tiff"],
                "can_convert_from": [".jpg", ".png", ".gif", ".tiff"],
            },
            "tiff": {
                "name": "TIFF Image",
                "category": "image",
                "extensions": [".tiff", ".tif"],
                "mime_types": ["image/tiff"],
                "description": "Tagged Image File Format",
                "can_convert_to": [".jpg", ".png", ".bmp"],
                "can_convert_from": [".jpg", ".png", ".bmp"],
            },
            "webp": {
                "name": "WebP Image",
                "category": "image",
                "extensions": [".webp"],
                "mime_types": ["image/webp"],
                "description": "WebP Image",
                "can_convert_to": [".jpg", ".png", ".bmp"],
                "can_convert_from": [".jpg", ".png", ".bmp"],
            },
            # SVG
            "svg": {
                "name": "SVG",
                "category": "svg",
                "extensions": [".svg"],
                "mime_types": ["image/svg+xml"],
                "description": "Scalable Vector Graphics",
                "can_convert_to": [".png", ".pdf"],
                "can_convert_from": [],
            },
        }

    def get_format_info(self, format_key: str) -> Optional[Dict[str, Any]]:
        """Get information about a specific format"""
        return self.format_registry.get(format_key.lower())

    def get_format_by_extension(self, extension: str) -> Optional[Dict[str, Any]]:
        """Get format info by file extension"""
        ext = extension.lower()
        if not ext.startswith("."):
            ext = f".{ext}"

        for fmt, info in self.format_registry.items():
            if ext in info["extensions"]:
                return info
        return None

    def list_formats(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """List all formats, optionally filtered by category"""
        formats = []

        for fmt, info in self.format_registry.items():
            if not category or info["category"] == category:
                formats.append(
                    {
                        "key": fmt,
                        "name": info["name"],
                        "category": info["category"],
                        "extensions": info["extensions"],
                        "description": info["description"],
                    }
                )

        return sorted(formats, key=lambda x: (x["category"], x["name"]))

    def get_categories(self) -> List[Dict[str, Any]]:
        """Get all format categories"""
        categories = {}

        for info in self.format_registry.values():
            cat = info["category"]
            if cat not in categories:
                categories[cat] = {"name": cat.capitalize(), "count": 0, "formats": []}
            categories[cat]["count"] += 1
            categories[cat]["formats"].append(info["name"])

        return [
            {"id": k, "name": v["name"], "count": v["count"]}
            for k, v in categories.items()
        ]

    def validate_conversion(
        self, input_format: str, output_format: str
    ) -> Tuple[bool, str]:
        """Validate if conversion between formats is supported"""
        input_info = self.get_format_by_extension(input_format) or self.get_format_info(
            input_format
        )
        output_info = self.get_format_by_extension(
            output_format
        ) or self.get_format_info(output_format)

        if not input_info:
            return False, f"Unsupported input format: {input_format}"

        if not output_info:
            return False, f"Unsupported output format: {output_format}"

        # Check if input can be converted to output
        output_ext = output_info["extensions"][0]
        if output_ext not in input_info.get("can_convert_to", []):
            return (
                False,
                f"Cannot convert from {input_info['name']} to {output_info['name']}",
            )

        return True, "Conversion supported"

    def get_compatible_formats(
        self, format_key: str, direction: str = "output"
    ) -> List[str]:
        """Get compatible formats for a given format"""
        info = self.get_format_info(format_key) or self.get_format_by_extension(
            format_key
        )

        if not info:
            return []

        if direction == "output":
            return info.get("can_convert_to", [])
        else:
            return info.get("can_convert_from", [])

    def suggest_output_format(
        self, input_format: str, preferred: Optional[str] = None
    ) -> Optional[str]:
        """Suggest an output format based on input"""
        info = self.get_format_by_extension(input_format) or self.get_format_info(
            input_format
        )

        if not info or not info.get("can_convert_to"):
            return None

        # If preferred format is valid, return it
        if preferred and preferred in info["can_convert_to"]:
            return preferred

        # Otherwise return the first available
        return info["can_convert_to"][0] if info["can_convert_to"] else None

    def get_category_for_format(self, format_key: str) -> Optional[str]:
        """Get category for a format"""
        info = self.get_format_info(format_key) or self.get_format_by_extension(
            format_key
        )
        return info["category"] if info else None

    def get_all_extensions(self, category: Optional[str] = None) -> List[str]:
        """Get all file extensions, optionally filtered by category"""
        extensions = []

        for info in self.format_registry.values():
            if not category or info["category"] == category:
                extensions.extend(info["extensions"])

        return sorted(extensions)
