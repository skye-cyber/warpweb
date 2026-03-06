import importlib
from typing import Dict, Any, Callable
from pathlib import Path
import sys
import os
from warpapp.utils.logger import logger


class OperationInterpreter:
    """
    Maps API requests to actual FileWarp operations
    Supports both direct module imports and CLI-style execution
    """

    def __init__(self, path: Path = Path(__file__).parent.parent.parent / "filewarp"):
        # Add filewarp to path if needed
        self.filewarp_path = Path(path).absolute()
        if self.filewarp_path.exists():
            # sys.path.insert(0, str(self.filewarp_path.parent))
            self._add_to_path()

        self._load_modules()
        self._build_operation_map()

    def _add_to_path(self):
        """Add FileWarp to Python path if provided"""
        if self.filewarp_path and self.filewarp_path not in sys.path:
            sys.path.insert(0, self.filewarp_path)
            logger.info(f"Added {self.filewarp_path} to Python path")

    def _load_modules_v1(self):
        """Import required FileWarp modules"""
        try:
            from filewarp.core.document import DocumentConverter
            from filewarp.core.pdf.core import (
                PageExtractor,
                PDFCombine,
                PDF2LongImageConverter,
            )
            from filewarp.core.audio.core import (
                AudioConverter,
                AudioExtracter,
                AudioJoiner,
            )
            from filewarp.core.video.core import VideoConverter
            from filewarp.core.image.core import (
                ImageConverter,
                ImageCompressor,
                ImagePdfConverter,
            )
            from filewarp.core.ocr import ExtractText
            from filewarp.core.svg.core import SVGConverter
            from filewarp.core.text.core import StyledText
            from filewarp.converter import MethodMappingEngine, DirectoryConverter

            self.modules = {
                "document": {
                    "converter": DocumentConverter,
                    "engine": MethodMappingEngine,
                    "directory": DirectoryConverter,
                },
                "pdf": {
                    "extractor": PageExtractor,
                    "combine": PDFCombine,
                    "long_image": PDF2LongImageConverter,
                },
                "audio": {
                    "converter": AudioConverter,
                    "extractor": AudioExtracter,
                    "joiner": AudioJoiner,
                },
                "video": {"converter": VideoConverter},
                "image": {
                    "converter": ImageConverter,
                    "compressor": ImageCompressor,
                    "pdf_converter": ImagePdfConverter,
                },
                "ocr": {"extractor": ExtractText},
                "svg": {"converter": SVGConverter},
                "text": {"converter": StyledText},
            }
        except ImportError as e:
            raise RuntimeError(f"Failed to load FileWarp modules: {e}")

    def _load_modules(self):
        """Import required FileWarp modules with fallbacks"""
        self.module_imports = {
            "document": [
                ("filewarp.core.document", "DocumentConverter"),
                ("filewarp.cli.converter", "MethodMappingEngine"),
                ("filewarp.cli.converter", "DirectoryConverter"),
                ("filewarp.cli.converter", "Batch_Audiofy"),
            ],
            "pdf": [
                ("filewarp.core.pdf.core", "PageExtractor"),
                ("filewarp.core.pdf.core", "PDFCombine"),
                ("filewarp.core.pdf.core", "PDF2LongImageConverter"),
                ("filewarp.core.pdf.core", "run"),
            ],
            "audio": [
                ("filewarp.core.audio.core", "AudioConverter"),
                ("filewarp.core.audio.core", "AudioExtracter"),
                ("filewarp.core.audio.core", "AudioJoiner"),
            ],
            "video": [("filewarp.core.video.core", "VideoConverter")],
            "image": [
                ("filewarp.core.image.core", "ImageConverter"),
                ("filewarp.core.image.core", "ImageCompressor"),
                ("filewarp.core.image.core", "ImagePdfConverter"),
                ("filewarp.core.image.core", "ImageDocxConverter"),
                ("filewarp.core.image.core", "GrayscaleConverter"),
                ("filewarp.core.image.extractor", "process_files"),
            ],
            "ocr": [("filewarp.core.ocr", "ExtractText")],
            "svg": [("filewarp.core.svg.core", "SVGConverter")],
            "text": [("filewarp.core.text.core", "StyledText")],
            "html": [("filewarp.core.html", "HTML2Word")],
            "recorder": [("filewarp.core.recorder", "SoundRecorder")],
            "voice": [("voice.VoiceType", "VoiceTypeEngine")],
            "utils": [("filewarp.utils.file_utils", "generate_filename")],
        }

        for category, imports in self.module_imports.items():
            self.module_imports[category] = {}
            for module_path, class_name in imports:
                try:
                    module = importlib.import_module(module_path)
                    if hasattr(module, class_name):
                        self.module_imports[category][class_name] = getattr(module, class_name)
                        logger.debug(f"Loaded {class_name} from {module_path}")
                except ImportError as e:
                    logger.warning(
                        f"Failed to import {class_name} from {module_path}: {e}"
                    )
                    self.module_imports[category][class_name] = None

    def _build_operation_map(self):
        """Build mapping of operations to their handler functions"""
        self.operation_map = {
            # Document operations
            "convert-doc": self._handle_doc_conversion,
            "convert_doc": self._handle_doc_conversion,
            "doc-to-image": self._handle_doc_to_image,
            "doc_to_image": self._handle_doc_to_image,
            "html2word": self._handle_html_to_word,
            "html_to_word": self._handle_html_to_word,
            "markdown-to-docx": self._handle_markdown_to_docx,
            "markdown_to_docx": self._handle_markdown_to_docx,
            # Audio operations
            "convert-audio": self._handle_audio_conversion,
            "convert_audio": self._handle_audio_conversion,
            "extract-audio": self._handle_audio_extraction,
            "extract_audio": self._handle_audio_extraction,
            "join-audio": self._handle_audio_join,
            "join_audio": self._handle_audio_join,
            "audio-effects": self._handle_audio_effects,
            "audio_effects": self._handle_audio_effects,
            "record": self._handle_recording,
            # Video operations
            "convert-video": self._handle_video_conversion,
            "convert_video": self._handle_video_conversion,
            "analyze-video": self._handle_video_analysis,
            "analyze_video": self._handle_video_analysis,
            # Image operations
            "convert-image": self._handle_image_conversion,
            "convert_image": self._handle_image_conversion,
            "resize-image": self._handle_image_resize,
            "resize_image": self._handle_image_resize,
            "images-to-pdf": self._handle_images_to_pdf,
            "images_to_pdf": self._handle_images_to_pdf,
            "images-to-word": self._handle_images_to_word,
            "images_to_word": self._handle_images_to_word,
            "images-to-gray": self._handle_images_to_grayscale,
            "images_to_gray": self._handle_images_to_grayscale,
            # PDF operations
            "pdf-join": self._handle_pdf_join,
            "pdf_join": self._handle_pdf_join,
            "extract-pages": self._handle_extract_pages,
            "extract_pages": self._handle_extract_pages,
            "extract-images": self._handle_extract_images,
            "extract_images": self._handle_extract_images,
            "scan-pdf": self._handle_scan_pdf,
            "scan_pdf": self._handle_scan_pdf,
            "pdf2long-image": self._handle_pdf_to_long_image,
            "pdf_to_long_image": self._handle_pdf_to_long_image,
            "scan-as-image": self._handle_scan_as_image,
            "scan_as_image": self._handle_scan_as_image,
            "scan-long": self._handle_scan_long,
            "scan_long": self._handle_scan_long,
            # OCR
            "ocr": self._handle_ocr,
            # SVG
            "convert-svg": self._handle_svg_conversion,
            "convert_svg": self._handle_svg_conversion,
            # Text
            "text2word": self._handle_text_to_word,
            "text_to_word": self._handle_text_to_word,
            # Voice
            "voice-type": self._handle_voice_type,
            "voice_type": self._handle_voice_type,
        }

    def interpret(self, operation: Dict[str, Any]) -> Callable:
        """Return the appropriate handler for the request"""
        if operation not in self.operation_map:
            raise ValueError(f"Unsupported operation: {operation}")
        return self.operation_map[operation]

    def _get_module_attr(self, category: str, attr: str, default=None):
        """Safely get module attribute with fallback"""
        try:
            return self.module_imports.get(category, {}).get(attr, default)
        except Exception:
            return default

    # ==================== Document Handlers ====================

    def _handle_doc_conversion(self, params: Dict[str, Any], progress_callback=None):
        """Handle document conversion"""
        input_paths = params.get("input_paths", [])
        target_format = params.get("target_format")
        options = params.get("options", {})

        MethodMappingEngine = self._get_module_attr("document", "MethodMappingEngine")
        DirectoryConverter = self._get_module_attr("document", "DirectoryConverter")
        Batch_Audiofy = self._get_module_attr("document", "Batch_Audiofy")

        if not MethodMappingEngine:
            raise ImportError("Document conversion modules not available")

        results = []
        total = len(input_paths)

        for i, path in enumerate(input_paths):
            if progress_callback:
                progress_callback(
                    int((i / total) * 100), f"Processing {Path(path).name}"
                )

            if os.path.isdir(path):
                if DirectoryConverter:
                    converter = DirectoryConverter(
                        path,
                        target_format,
                        params.get("no_resume", False),
                        params.get("threads", 3),
                        options.get("isolate"),
                    )
                    result = converter._unbundle_dir_()
                else:
                    raise ImportError("DirectoryConverter not available")
            else:
                if MethodMappingEngine:
                    ev = MethodMappingEngine(path, target_format)
                    result = ev.document_eval()
                else:
                    raise ImportError("MethodMappingEngine not available")

            results.append(
                {"input": path, "success": True, "output": result if result else None}
            )

        return {"results": results, "total": len(results)}

    def _handle_doc_to_image(self, params: Dict[str, Any], progress_callback=None):
        """Handle document to image conversion"""
        input_path = params.get("input_paths", [])[0]
        target_format = params.get("target_format", "png")

        DocumentConverter = self._get_module_attr("document", "DocumentConverter")
        if not DocumentConverter:
            raise ImportError("DocumentConverter not available")

        if progress_callback:
            progress_callback(10, "Initializing document to image conversion")

        conv = DocumentConverter(input_path)
        result = conv.doc2image(target_format)

        if progress_callback:
            progress_callback(100, "Document to image conversion complete")

        return {"output": result, "format": target_format}

    def _handle_html_to_word(self, params: Dict[str, Any], progress_callback=None):
        """Handle HTML to Word conversion"""
        input_paths = params.get("input_paths", [])

        HTML2Word = self._get_module_attr("html", "HTML2Word")
        generate_filename = self._get_module_attr("utils", "generate_filename")

        if not HTML2Word:
            raise ImportError("HTML2Word not available")

        converter = HTML2Word()
        results = []

        for i, html_file in enumerate(input_paths):
            if progress_callback:
                progress_callback(
                    int((i / len(input_paths)) * 100),
                    f"Converting {Path(html_file).name}",
                )

            output = (
                generate_filename(ext="docx", basedir=Path(html_file))
                if generate_filename
                else None
            )
            result = converter.convert_file(html_file, output)
            results.append(
                {"input": html_file, "output": str(output) if output else result}
            )

        return {"results": results}

    def _handle_markdown_to_docx(self, params: Dict[str, Any], progress_callback=None):
        """Handle Markdown to DOCX conversion"""
        # Placeholder - implement based on actual FileWarp functionality
        return {"message": "Markdown to DOCX conversion not fully implemented"}

    # ==================== Audio Handlers ====================

    def _handle_audio_conversion(self, params: Dict[str, Any], progress_callback=None):
        """Handle audio conversion"""
        input_path = params.get("input_paths", [])[0]
        target_format = params.get("target_format")

        AudioConverter = self._get_module_attr("audio", "AudioConverter")
        if not AudioConverter:
            raise ImportError("AudioConverter not available")

        if progress_callback:
            progress_callback(
                20, f"Converting {Path(input_path).name} to {target_format}"
            )

        converter = AudioConverter(input_path, target_format)
        result = converter.pydub_conv()

        if progress_callback:
            progress_callback(100, "Audio conversion complete")

        return {"output": result, "format": target_format}

    def _handle_audio_extraction(self, params: Dict[str, Any], progress_callback=None):
        """Handle audio extraction from video"""
        input_path = params.get("input_paths", [])[0]

        AudioExtracter = self._get_module_attr("audio", "AudioExtracter")
        if not AudioExtracter:
            raise ImportError("AudioExtracter not available")

        if progress_callback:
            progress_callback(30, f"Extracting audio from {Path(input_path).name}")

        extractor = AudioExtracter(input_path)
        result = extractor.moviepyextract()

        if progress_callback:
            progress_callback(100, "Audio extraction complete")

        return {"output": result}

    def _handle_audio_join(self, params: Dict[str, Any], progress_callback=None):
        """Handle audio joining"""
        input_paths = params.get("input_paths", [])

        AudioJoiner = self._get_module_attr("audio", "AudioJoiner")
        if not AudioJoiner:
            raise ImportError("AudioJoiner not available")

        if progress_callback:
            progress_callback(10, f"Joining {len(input_paths)} audio files")

        joiner = AudioJoiner(input_paths)
        result = joiner.worker()

        if progress_callback:
            progress_callback(100, "Audio joining complete")

        return {"output": result, "files_joined": len(input_paths)}

    def _handle_audio_effects(self, params: Dict[str, Any], progress_callback=None):
        """Handle audio effects"""
        # This would typically call audiobot_cli
        return {"message": "Audio effects processing - requires audiobot module"}

    def _handle_recording(self, params: Dict[str, Any], progress_callback=None):
        """Handle audio recording"""
        SoundRecorder = self._get_module_attr("recorder", "SoundRecorder")
        if not SoundRecorder:
            raise ImportError("SoundRecorder not available")

        if progress_callback:
            progress_callback(10, "Starting recording")

        recorder = SoundRecorder()
        # Note: This would typically run in a separate thread
        result = recorder.run()

        return {"message": "Recording completed", "output": result}

    # ==================== Video Handlers ====================

    def _handle_video_conversion(self, params: Dict[str, Any], progress_callback=None):
        """Handle video conversion"""
        input_path = params.get("input_paths", [])[0]
        target_format = params.get("target_format")

        VideoConverter = self._get_module_attr("video", "VideoConverter")
        if not VideoConverter:
            raise ImportError("VideoConverter not available")

        if progress_callback:
            progress_callback(
                20, f"Converting {Path(input_path).name} to {target_format}"
            )

        converter = VideoConverter(input_path, target_format)
        result = converter.CONVERT_VIDEO()

        if progress_callback:
            progress_callback(100, "Video conversion complete")

        return {"output": result, "format": target_format}

    def _handle_video_analysis(self, params: Dict[str, Any], progress_callback=None):
        """Handle video analysis"""
        from ..miscellaneous.video_analyzer import SimpleAnalyzer

        input_path = params.get("input_paths", [])[0]

        if progress_callback:
            progress_callback(20, f"Analyzing {Path(input_path).name}")

        analyzer = SimpleAnalyzer(input_path)
        result = analyzer.SimpleAnalyzer()

        if progress_callback:
            progress_callback(100, "Video analysis complete")

        return {"analysis": result}

    # ==================== Image Handlers ====================

    def _handle_image_conversion(self, params: Dict[str, Any], progress_callback=None):
        """Handle image conversion"""
        input_path = params.get("input_paths", [])[0]
        target_format = params.get("target_format")

        ImageConverter = self._get_module_attr("image", "ImageConverter")
        if not ImageConverter:
            raise ImportError("ImageConverter not available")

        if progress_callback:
            progress_callback(
                30, f"Converting {Path(input_path).name} to {target_format}"
            )

        converter = ImageConverter(input_path, target_format)
        result = converter.convert_image()

        if progress_callback:
            progress_callback(100, "Image conversion complete")

        return {"output": result, "format": target_format}

    def _handle_image_resize(self, params: Dict[str, Any], progress_callback=None):
        """Handle image resizing"""
        input_path = params.get("input_paths", [])[0]
        target_size = params.get("options", {}).get("target_size")

        ImageCompressor = self._get_module_attr("image", "ImageCompressor")
        if not ImageCompressor:
            raise ImportError("ImageCompressor not available")

        if progress_callback:
            progress_callback(20, f"Resizing {Path(input_path).name} to {target_size}")

        compressor = ImageCompressor(input_path)
        result = compressor.resize_image(target_size)

        if progress_callback:
            progress_callback(100, "Image resize complete")

        return {"output": result, "size": target_size}

    def _handle_images_to_pdf(self, params: Dict[str, Any], progress_callback=None):
        """Handle images to PDF conversion"""
        input_paths = params.get("input_paths", [])
        options = params.get("options", {})

        ImagePdfConverter = self._get_module_attr("image", "ImagePdfConverter")
        if not ImagePdfConverter:
            raise ImportError("ImagePdfConverter not available")

        if progress_callback:
            progress_callback(10, f"Converting {len(input_paths)} images to PDF")

        if len(input_paths) > 1 or os.path.isfile(os.path.abspath(input_paths[0])):
            converter = ImagePdfConverter(image_list=input_paths)
        else:
            converter = ImagePdfConverter(
                input_dir=input_paths[0],
                order=options.get("sort", False),
                base=options.get("base", False),
                walk=options.get("walk", False),
                clean=options.get("clean", False),
            )

        result = converter.run()

        if progress_callback:
            progress_callback(100, "PDF creation complete")

        return {"output": result, "images_processed": len(input_paths)}

    def _handle_images_to_word(self, params: Dict[str, Any], progress_callback=None):
        """Handle images to Word conversion"""
        input_paths = params.get("input_paths", [])

        ImageDocxConverter = self._get_module_attr("image", "ImageDocxConverter")
        if not ImageDocxConverter:
            raise ImportError("ImageDocxConverter not available")

        if progress_callback:
            progress_callback(10, f"Converting {len(input_paths)} images to Word")

        if len(input_paths) > 1:
            converter = ImageDocxConverter(image_list=input_paths)
        else:
            converter = ImageDocxConverter(input_dir=input_paths[0])

        result = converter.run()

        if progress_callback:
            progress_callback(100, "Word document creation complete")

        return {"output": result}

    def _handle_images_to_grayscale(
        self, params: Dict[str, Any], progress_callback=None
    ):
        """Handle images to grayscale conversion"""
        input_paths = params.get("input_paths", [])

        GrayscaleConverter = self._get_module_attr("image", "GrayscaleConverter")
        if not GrayscaleConverter:
            raise ImportError("GrayscaleConverter not available")

        if progress_callback:
            progress_callback(10, f"Converting {len(input_paths)} images to grayscale")

        converter = GrayscaleConverter(
            input_paths[0] if len(input_paths) == 1 else input_paths
        )
        result = converter.run()

        if progress_callback:
            progress_callback(100, "Grayscale conversion complete")

        return {"output": result}

    # ==================== PDF Handlers ====================

    def _handle_pdf_join(self, params: Dict[str, Any], progress_callback=None):
        """Handle PDF joining"""
        input_paths = params.get("input_paths", [])
        order = params.get("options", {}).get("order", "AAB")

        PDFCombine = self._get_module_attr("pdf", "PDFCombine")
        if not PDFCombine:
            raise ImportError("PDFCombine not available")

        if progress_callback:
            progress_callback(10, f"Joining {len(input_paths)} PDF files")

        combiner = PDFCombine(input_paths, None, None, order)
        result = combiner.controller()

        if progress_callback:
            progress_callback(100, "PDF joining complete")

        return {"output": result, "files_joined": len(input_paths)}

    def _handle_extract_pages(self, params: Dict[str, Any], progress_callback=None):
        """Handle page extraction from PDF"""
        input_path = params.get("input_paths", [])[0]
        pages = params.get("options", {}).get("pages", [])
        start = params.get("start_page", 1)
        stop = params.get("stop_page", -1)

        PageExtractor = self._get_module_attr("pdf", "PageExtractor")
        if not PageExtractor:
            raise ImportError("PDF page extraction not available")

        if progress_callback:
            progress_callback(
                20, f"Extracting pages {pages} from {Path(input_path).name}"
            )

        # args = [input_path]  + [str(p) for p in pages]
        result = PageExtractor(input_path, int(start), int(stop)).getPages()

        if progress_callback:
            progress_callback(100, "Page extraction complete")

        return {"output": result, "pages_extracted": len(pages)}

    def _handle_extract_images(self, params: Dict[str, Any], progress_callback=None):
        """Handle image extraction from PDF"""
        input_path = params.get("input_paths", [])[0]
        size = params.get("options", {}).get("size")

        process_files = self._get_module_attr("image", "process_files")
        if not process_files:
            raise ImportError("Image extraction not available")

        if progress_callback:
            progress_callback(20, f"Extracting images from {Path(input_path).name}")

        if size:
            size_tuple = tuple([int(x) for x in size.lower().split("x")])
            result = process_files([input_path], tsize=size_tuple)
        else:
            result = process_files([input_path])

        if progress_callback:
            progress_callback(100, "Image extraction complete")

        return {"output": result}

    def _handle_scan_pdf(self, params: Dict[str, Any], progress_callback=None):
        """Handle PDF text extraction"""
        input_path = params.get("input_paths", [])[0]

        PageExtractor = self._get_module_attr("pdf", "PageExtractor")
        if not PageExtractor:
            raise ImportError("PageExtractor not available")

        if progress_callback:
            progress_callback(20, f"Scanning {Path(input_path).name}")

        extractor = PageExtractor(input_path)
        result = extractor.scanPDF()

        if progress_callback:
            progress_callback(100, "PDF scanning complete")

        return {"text": result}

    def _handle_scan_as_image(self, params: Dict[str, Any], progress_callback=None):
        """Handle PDF scanning as images"""
        input_path = params.get("input_paths", [])[0]

        PageExtractor = self._get_module_attr("pdf", "PageExtractor")
        if not PageExtractor:
            raise ImportError("PageExtractor not available")

        if progress_callback:
            progress_callback(20, f"Scanning {Path(input_path).name} as images")

        extractor = PageExtractor(input_path)
        result = extractor.scanAsImgs()

        if progress_callback:
            progress_callback(100, "PDF image scanning complete")

        return {"text": result}

    def _handle_scan_long(self, params: Dict[str, Any], progress_callback=None):
        """Handle PDF scanning as long image"""
        input_path = params.get("input_paths", [])[0]
        separator = params.get("options", {}).get("separator", "\n")

        PageExtractor = self._get_module_attr("pdf", "PageExtractor")
        if not PageExtractor:
            raise ImportError("PageExtractor not available")

        if progress_callback:
            progress_callback(20, f"Scanning {Path(input_path).name} as long image")

        extractor = PageExtractor(input_path, separator)
        result = extractor.scanAsLongImg()

        if progress_callback:
            progress_callback(100, "Long image scanning complete")

        return {"text": result}

    def _handle_pdf_to_long_image(self, params: Dict[str, Any], progress_callback=None):
        """Handle PDF to long image conversion"""
        input_path = params.get("input_paths", [])[0]

        PDF2LongImageConverter = self._get_module_attr("pdf", "PDF2LongImageConverter")
        if not PDF2LongImageConverter:
            raise ImportError("PDF2LongImageConverter not available")

        if progress_callback:
            progress_callback(20, f"Converting {Path(input_path).name} to long image")

        converter = PDF2LongImageConverter(input_path)
        result = converter.preprocess()

        if progress_callback:
            progress_callback(100, "Long image conversion complete")

        return {"output": result}

    # ==================== OCR Handlers ====================

    def _handle_ocr(self, params: Dict[str, Any], progress_callback=None):
        """Handle OCR on images"""
        input_paths = params.get("input_paths", [])
        separator = params.get("options", {}).get("separator", "\n")

        ExtractText = self._get_module_attr("ocr", "ExtractText")
        if not ExtractText:
            raise ImportError("OCR module not available")

        if progress_callback:
            progress_callback(10, f"Starting OCR on {len(input_paths)} images")

        ocr = ExtractText(input_paths, separator)
        result = ocr.run()

        if progress_callback:
            progress_callback(100, "OCR complete")

        return {"text": result}

    # ==================== SVG Handlers ====================

    def _handle_svg_conversion(self, params: Dict[str, Any], progress_callback=None):
        """Handle SVG conversion"""
        input_path = params.get("input_paths", [])[0]
        target_format = params.get("target_format")

        SVGConverter = self._get_module_attr("svg", "SVGConverter")
        generate_filename = self._get_module_attr("utils", "generate_filename")

        if not SVGConverter:
            raise ImportError("SVGConverter not available")

        if progress_callback:
            progress_callback(
                30, f"Converting {Path(input_path).name} to {target_format}"
            )

        converter = SVGConverter()
        converters = {
            "png": converter.to_png,
            "pdf": converter.to_pdf,
            "svg": converter.to_svg,
        }

        convert_func = converters.get(target_format)
        if not convert_func:
            raise ValueError(f"Unsupported SVG target format: {target_format}")

        output = (
            generate_filename(ext=target_format, basedir=Path(input_path))
            if generate_filename
            else None
        )

        result = convert_func(
            input_svg=input_path,
            output_path=str(output) if output else None,
            is_string=False,
        )

        if progress_callback:
            progress_callback(100, "SVG conversion complete")

        return {"output": str(output) if output else result}

    # ==================== Text Handlers ====================

    def _handle_text_to_word(self, params: Dict[str, Any], progress_callback=None):
        """Handle text to Word conversion"""
        input_path = params.get("input_paths", [])[0]
        font_size = params.get("options", {}).get("font_size", 12)
        font_name = params.get("options", {}).get("font_name", "Times New Roman")

        StyledText = self._get_module_attr("text", "StyledText")
        if not StyledText:
            raise ImportError("StyledText not available")

        if progress_callback:
            progress_callback(30, f"Converting {Path(input_path).name} to Word")

        converter = StyledText(input_path, None, font_size, font_name)
        result = converter.text_to_word()

        if progress_callback:
            progress_callback(100, "Text to Word conversion complete")

        return {"output": result}

    # ==================== Voice Handlers ====================

    def _handle_voice_type(self, params: Dict[str, Any], progress_callback=None):
        """Handle voice typing"""
        VoiceTypeEngine = self._get_module_attr("voice", "VoiceTypeEngine")
        if not VoiceTypeEngine:
            raise ImportError("VoiceTypeEngine not available")

        if progress_callback:
            progress_callback(10, "Starting voice typing")

        engine = VoiceTypeEngine()
        # This would typically run in a separate thread
        result = engine.start()

        return {"message": "Voice typing completed", "text": result}
