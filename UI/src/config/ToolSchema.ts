import { MediaTool } from "../components/Tools/MediaTool";
import { ComponentType } from "react";

// ==================== Type Definitions ====================

export type ToolCategory = 'documents' | 'images' | 'audios' | 'videos' | 'batch';
export type ToolColor = 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'yellow';

export interface ToolSettings {
    name: string;
    type?: 'text' | 'number' | 'select' | 'checkbox' | 'range';
    label?: string;
    options?: string[];
    default?: any;
    min?: number;
    max?: number;
    step?: number;
}

export interface ToolAdvancedOptions extends ToolSettings {}
export interface ToolEffects extends ToolSettings {}

export interface ToolConfig {
    /** Tool category */
    category: ToolCategory;
    /** Unique tool identifier */
    id: string;
    /** Tool display name */
    name: string;
    /** Tool description */
    description: string;
    /** Tool title for UI */
    title?: string;
    /** Color theme for the tool */
    color?: ToolColor;
    /** Badge text for UI */
    badge?: string;
    /** Accepted file extensions (comma-separated) */
    accepts?: string;
    /** Dropzone text */
    dropzoneText?: string;
    /** Dropzone subtext */
    dropzoneSubtext?: string;
    /** Submit button text */
    submitText?: string;
    /** Settings configuration */
    settings?: string[];
    /** Advanced options configuration */
    advanced?: string[];
    /** Audio effects configuration */
    effects?: string[];
    /** Icon name for the tool */
    icon?: string;
    /** Submit button icon name */
    submitIcon?: string;
}

export interface ToolCategoryConfig {
    /** Category ID */
    id: ToolCategory;
    /** Category display name */
    name: string;
    /** Category icon name */
    icon: string;
    /** List of tool IDs in this category */
    tools: string[];
}

export interface InterfaceComponentMapType {
    documents: ComponentType<any>;
    videos: ComponentType<any>;
    audios: ComponentType<any>;
    images: ComponentType<any>;
    batch?: ComponentType<any>;
}

// ==================== Tool Definitions ====================

export const TOOLS: Record<string, ToolConfig> = {
    // Document Tools
    convert_doc: {
        category: 'documents',
        id: 'convert_doc',
        name: "convert",
        description: "convert documents",
        title: 'Document Conversion',
        color: 'blue',
        badge: 'PDF, DOCX, TXT',
        accepts: '.pdf,.docx,.doc,.txt,.rtf,.odt',
        dropzoneText: 'Drop your documents here',
        dropzoneSubtext: 'or click to browse (PDF, DOCX, TXT, RTF)',
        submitText: 'Convert Document',
        settings: ['docFormat', 'pageRange'],
        advanced: ['ocr', 'metadata'],
        icon: 'docConvert',
        submitIcon: 'convert'
    },
    merge_pdf: {
        category: 'documents',
        id: 'merge_pdf',
        name: 'pdf merge',
        description: "merge documents",
        title: 'Merge Documents',
        color: 'blue',
        badge: 'Combine PDFs',
        accepts: '.pdf,.docx,.doc',
        dropzoneText: 'Drop documents to merge',
        dropzoneSubtext: 'Files will be merged in the order you upload them',
        submitText: 'Merge Documents',
        settings: ['mergeOrder'],
        icon: 'docMerge',
        submitIcon: 'merge'
    },
    // compress_pdf: {
    //     category: 'documents',
    //     id: 'compress_pdf',
    //     title: 'Compress PDF',
    //     color: 'blue',
    //     badge: 'Reduce size',
    //     accepts: '.pdf',
    //     dropzoneText: 'Drop PDF files here',
    //     dropzoneSubtext: 'Compress PDFs while maintaining quality',
    //     submitText: 'Compress PDF',
    //     settings: ['compressionLevel'],
    //     icon: 'docCompress',
    //     submitIcon: 'compress'
    // },
    scan_pdf: {
        category: 'documents',
        id: 'scan_pdf',
        name: 'scan pdf',
        description: "scan pdf document",
        title: 'Scan PDF',
        color: 'blue',
        badge: 'OCR Scan',
        accepts: '.pdf',
        dropzoneText: 'Drop PDF files here',
        dropzoneSubtext: 'Extract text from scanned PDFs',
        submitText: 'Scan PDF',
        settings: ['language', 'ocrMode'],
        icon: 'docScan',
        submitIcon: 'scan'
    },
    doc_long_image: {
        category: 'documents',
        id: 'doc_long_image',
        name: "document to longimage",
        description: "convert to long image",
        title: 'Document to Long Image',
        color: 'blue',
        badge: 'Convert to Image',
        accepts: '.pdf,.docx,.doc,.txt',
        dropzoneText: 'Drop documents here',
        dropzoneSubtext: 'Convert entire document to a single long image',
        submitText: 'Convert to Long Image',
        settings: ['imageFormat', 'quality'],
        icon: 'docLongImage',
        submitIcon: 'image'
    },
    extract_pages: {
        category: 'documents',
        id: 'extract_pages',
        name: 'extract pages',
        description: "extract pages from document",
        title: 'Extract Pages',
        color: 'blue',
        badge: 'Page Extraction',
        accepts: '.pdf,.docx,.doc',
        dropzoneText: 'Drop documents here',
        dropzoneSubtext: 'Extract specific pages from your document',
        submitText: 'Extract Pages',
        settings: ['startPage', 'endPage'],
        icon: 'docExtract',
        submitIcon: 'extract'
    },
    doc2image: {
        category: 'documents',
        id: 'doc2image',
        name: 'doc to image',
        description: "convert document to image",
        title: 'Document to Image',
        color: 'blue',
        badge: 'Convert to Image',
        accepts: '.pdf,.docx,.doc,.txt',
        dropzoneText: 'Drop documents here',
        dropzoneSubtext: 'Convert each page to an image',
        submitText: 'Convert to Images',
        settings: ['imageFormat', 'quality', 'dpi'],
        icon: 'docToImage',
        submitIcon: 'image'
    },

    // Image Tools
    convert_image: {
        category: 'images',
        id: 'convert_image',
        name: "convert image",
        description: "convert image",
        title: 'Image Conversion',
        color: 'red',
        badge: 'PNG, JPG, WEBP',
        accepts: '.png,.jpg,.jpeg,.webp,.gif,.bmp',
        dropzoneText: 'Drop your images here',
        dropzoneSubtext: 'or click to browse (PNG, JPG, WEBP, GIF)',
        submitText: 'Convert Images',
        settings: ['imageFormat', 'quality'],
        advanced: ['resize'],
        icon: 'imageConvert',
        submitIcon: 'convert'
    },
    resize_image: {
        category: 'images',
        id: 'resize_image',
        name: "resize image",
        description: "resize",
        title: 'Resize Image',
        color: 'red',
        badge: 'Resize & Scale',
        accepts: '.png,.jpg,.jpeg,.webp,.gif,.bmp',
        dropzoneText: 'Drop images to resize',
        dropzoneSubtext: 'Resize images to your desired dimensions',
        submitText: 'Resize Images',
        settings: ['width', 'height', 'maintainAspectRatio'],
        icon: 'imageResize',
        submitIcon: 'resize'
    },
    image2pdf: {
        category: 'images',
        id: 'image2pdf',
        name: "image to pdf",
        description: "convert image to pdf",
        title: 'Image to PDF',
        color: 'red',
        badge: 'Images to PDF',
        accepts: '.png,.jpg,.jpeg,.webp,.gif,.bmp',
        dropzoneText: 'Drop images to convert',
        dropzoneSubtext: 'Images will be combined into a single PDF',
        submitText: 'Convert to PDF',
        settings: ['pageSize', 'orientation'],
        icon: 'imagePdf',
        submitIcon: 'pdf'
    },
    image2word: {
        category: 'images',
        id: 'image2word',
        name: "image to word",
        description: "convert image to word",
        title: 'Image to Word',
        color: 'red',
        badge: 'OCR to DOCX',
        accepts: '.png,.jpg,.jpeg,.webp,.gif,.bmp',
        dropzoneText: 'Drop images with text',
        dropzoneSubtext: 'Text will be extracted and converted to Word document',
        submitText: 'Extract to Word',
        settings: ['language', 'preserveFormatting'],
        icon: 'imageWord',
        submitIcon: 'word'
    },
    image2gray: {
        category: 'images',
        id: 'image2gray',
        name: "image to gray",
        description: "convert image to grayscale",
        title: 'Grayscale',
        color: 'red',
        badge: 'B&W Conversion',
        accepts: '.png,.jpg,.jpeg,.webp,.gif,.bmp',
        dropzoneText: 'Drop images to convert',
        dropzoneSubtext: 'Convert colorful images to grayscale/black & white',
        submitText: 'Convert to Grayscale',
        settings: ['intensity'],
        icon: 'imageGray',
        submitIcon: 'convert'
    },
    ocr: {
        category: 'images',
        id: 'ocr',
        name: "ocr",
        description: "perform text extraction on image",
        title: 'OCR Text Extraction',
        color: 'red',
        badge: 'Text Recognition',
        accepts: '.png,.jpg,.jpeg,.webp,.gif,.bmp',
        dropzoneText: 'Drop images with text',
        dropzoneSubtext: 'Extract text from images using OCR',
        submitText: 'Extract Text',
        settings: ['language', 'outputFormat'],
        icon: 'ocr',
        submitIcon: 'text'
    },

    // Audio Tools
    convert_audio: {
        category: 'audios',
        id: 'convert_audio',
        name: "convert audio",
        description: "convert audio",
        title: 'Audio Conversion',
        color: 'green',
        badge: 'MP3, WAV, FLAC',
        accepts: '.mp3,.wav,.flac,.m4a,.aac',
        dropzoneText: 'Drop your audio files here',
        dropzoneSubtext: 'or click to browse (MP3, WAV, FLAC, M4A)',
        submitText: 'Convert Audio',
        settings: ['format', 'bitrate', 'sampleRate'],
        effects: ['noiseReduce', 'normalize', 'compressor', 'equalizer'],
        icon: 'audioConvert',
        submitIcon: 'convert'
    },
    audio_join: {
        category: 'audios',
        id: 'audio_join',
        name: "join audio",
        description: "join audio files",
        title: 'Audio Join',
        color: 'green',
        badge: 'Join multiple files',
        accepts: '.mp3,.wav,.flac,.m4a,.aac',
        dropzoneText: 'Drop audio files to join',
        dropzoneSubtext: 'Files will be joined in the order you upload them',
        submitText: 'Join Audio',
        settings: [],
        effects: [],
        icon: 'audioJoin',
        submitIcon: 'join'
    },
    audio_effect: {
        category: 'audios',
        id: 'audio_effect',
        name: "create audio effects",
        description: "manipulate audio to create sound effects",
        title: 'Audio Effects',
        color: 'green',
        badge: 'Sound Effects',
        accepts: '.mp3,.wav,.flac,.m4a,.aac',
        dropzoneText: 'Drop audio files here',
        dropzoneSubtext: 'Apply effects to your audio',
        submitText: 'Apply Effects',
        settings: [],
        effects: ['reverb', 'echo', 'pitch', 'speed'],
        icon: 'audioEffect',
        submitIcon: 'effect'
    },

    // Video Tools
    convert_video: {
        category: 'videos',
        id: 'convert_video',
        name: "convert video",
        description: "convert video",
        title: 'Video Conversion',
        color: 'purple',
        badge: 'MP4, AVI, MOV',
        accepts: '.mp4,.avi,.mov,.mkv,.webm',
        dropzoneText: 'Drop your videos here',
        dropzoneSubtext: 'or click to browse (MP4, AVI, MOV, MKV)',
        submitText: 'Convert Video',
        settings: ['videoFormat', 'videoQuality', 'resolution'],
        advanced: ['codec', 'fps'],
        icon: 'videoConvert',
        submitIcon: 'convert'
    },
    // compress_video: {
    //     category: 'video',
    //     id: 'compress_video',
    //     title: 'Compress Video',
    //     color: 'purple',
    //     badge: 'Reduce size',
    //     accepts: '.mp4,.avi,.mov,.mkv',
    //     dropzoneText: 'Drop videos to compress',
    //     dropzoneSubtext: 'Reduce video file size while maintaining quality',
    //     submitText: 'Compress Video',
    //     settings: ['compressionLevel', 'targetSize'],
    //     icon: 'videoCompress',
    //     submitIcon: 'compress'
    // },
    analyze_video: {
        category: 'videos',
        id: 'analyze_video',
        name: "analyze video",
        description: "Obtain video metadata",
        title: 'Video Analysis',
        color: 'purple',
        badge: 'Metadata & Info',
        accepts: '.mp4,.avi,.mov,.mkv,.webm',
        dropzoneText: 'Drop videos to analyze',
        dropzoneSubtext: 'Get detailed information about your videos',
        submitText: 'Analyze Video',
        settings: ['extractMetadata', 'analyzeAudio'],
        icon: 'videoAnalyze',
        submitIcon: 'analyze'
    },
    extract_audio: {
        category: 'videos',
        id: 'extract_audio',
        name: "extract audio",
        description: "extract audio from video",
        title: 'Extract Audio',
        color: 'green',
        badge: 'From Video',
        accepts: '.mp4,.avi,.mov,.mkv,.webm',
        dropzoneText: 'Drop video files here',
        dropzoneSubtext: 'or click to browse (MP4, AVI, MOV, MKV)',
        submitText: 'Extract Audio',
        settings: ['format', 'bitrate', 'sampleRate'],
        effects: [],
        icon: 'audioExtract',
        submitIcon: 'extract'
    },

    // Batch Tools
    batch_dashboard: {
        category: 'batch',
        id: 'batch_dashboard',
        name: "dashboard batch ops",
        description: "dashboard batch ops",
        title: 'Batch Operations Dashboard',
        color: 'orange',
        badge: 'Batch Processing',
        accepts: '',
        dropzoneText: 'Select batch operations',
        dropzoneSubtext: 'Process multiple files at once',
        submitText: 'Execute Batch',
        settings: ['batchSize', 'outputDirectory'],
        icon: 'batchDashboard',
        submitIcon: 'batch'
    },
    batch_doc_convert: {
        category: 'batch',
        id: 'batch_doc_convert',
        name: "batch doc convert",
        description: "convert multiple documents",
        title: 'Batch Document Conversion',
        color: 'orange',
        badge: 'Bulk Convert',
        accepts: '.pdf,.docx,.doc,.txt,.rtf',
        dropzoneText: 'Drop multiple documents',
        dropzoneSubtext: 'Convert multiple documents at once',
        submitText: 'Convert All',
        settings: ['outputFormat', 'quality'],
        icon: 'batchDoc',
        submitIcon: 'convert'
    },
    folder_operations: {
        category: 'batch',
        id: 'folder_operations',
        name: "batch folder operation",
        description: "operate on folder",
        title: 'Folder Operations',
        color: 'orange',
        badge: 'Folder Processing',
        accepts: '',
        dropzoneText: 'Select a folder',
        dropzoneSubtext: 'Process entire folders of files',
        submitText: 'Process Folder',
        settings: ['recursive', 'filePattern'],
        icon: 'folder',
        submitIcon: 'process'
    },
    bulk_ocr: {
        category: 'batch',
        id: 'bulk_ocr',
        name: "bulk ocr",
        description: "bulk ocr operations",
        title: 'Bulk OCR',
        color: 'orange',
        badge: 'Mass OCR',
        accepts: '.png,.jpg,.jpeg,.pdf',
        dropzoneText: 'Drop images/documents for OCR',
        dropzoneSubtext: 'Extract text from multiple files at once',
        submitText: 'Process OCR',
        settings: ['language', 'outputFormat', 'preserveLayout'],
        icon: 'bulkOcr',
        submitIcon: 'ocr'
    }
};

// ==================== Tool Categories ====================

export const TOOL_CATEGORIES: Record<string, ToolCategoryConfig> = {
    audio: {
        id: 'audios',
        name: 'Audio Tools',
        icon: 'audio',
        tools: ['convert_audio', 'audio_join', 'extract_audio', 'audio_effect']
    },
    image: {
        id: 'images',
        name: 'Image Tools',
        icon: 'image',
        tools: ['convert_image', 'resize_image', 'image2pdf', 'image2word', 'image2gray', 'ocr']
    },
    documents: {
        id: 'documents',
        name: 'Document Tools',
        icon: 'document',
        tools: ['convert_doc', 'merge_pdf', 'scan_pdf', 'doc_long_image', 'extract_pages', 'doc2image']
    },
    video: {
        id: 'videos',
        name: 'Video Tools',
        icon: 'video',
        tools: ['convert_video', 'analyze_video', 'extract_audio']
    },
    batch: {
        id: 'batch',
        name: 'Batch Tools',
        icon: 'batch',
        tools: ['batch_dashboard', 'batch_doc_convert', 'folder_operations', 'bulk_ocr']
    }
};

// ==================== Component Map ====================

export const InterfaceComponentMap: InterfaceComponentMapType = {
    documents: MediaTool,
    videos: MediaTool,
    audios: MediaTool,
    images: MediaTool,
};

// ==================== Helper Functions ====================

/**
 * Get the component for a given tool ID
 */
export function getComponentById(id: string): ComponentType<any> | undefined {
    console.log(id, InterfaceComponentMap[id as keyof InterfaceComponentMapType]);
    return InterfaceComponentMap[id as keyof InterfaceComponentMapType];
}

/**
 * Get all tools filtered by category
 */
export function getToolsByCategory(category: ToolCategory = "documents"): Record<string, ToolConfig> {
    const keys = Object.keys(TOOLS);
    let filtered_tools: Record<string, ToolConfig> = {};

    keys.forEach((key) => {
        if (TOOLS[key].category === category) {
            filtered_tools = { ...filtered_tools, [key]: TOOLS[key] };
        }
    });

    return filtered_tools;
}

/**
 * Get the first tool in a category
 */
export function getFirstToolByCategory(category: ToolCategory = "documents"): Record<string, ToolConfig> | null {
    const keys = Object.keys(TOOLS);

    for (const key of keys) {
        if (TOOLS[key].category === category) {
            return { [key]: TOOLS[key] };
        }
    }
    return null;
}

/**
 * Sort tools by their categories
 */
export function sortToolsByCategory(): Record<string, Array<Record<string, ToolConfig>>> {
    const keys = Object.keys(TOOLS);
    const sortedTools: Record<string, Array<Record<string, ToolConfig>>> = {};

    keys.forEach((key) => {
        const category = TOOLS[key].category;
        if (!Object.keys(sortedTools).includes(category)) {
            sortedTools[category] = [{ [key]: TOOLS[key] }];
        } else {
            sortedTools[category].push({ [key]: TOOLS[key] });
        }
    });

    return sortedTools;
}

/**
 * Count the number of tools in a category
 */
export function countCategoryTools(category: ToolCategory): number {
    const tools = getToolsByCategory(category);
    return Object.keys(tools).length;
}

/**
 * Get a specific tool from a category by its ID
 */
export function getToolFromCategory(category: ToolCategory, tool_id: string): ToolConfig | undefined {
    const categoryTools = getToolsByCategory(category);
    let tool: ToolConfig | undefined;

    Object.keys(categoryTools).forEach((key) => {
        if (categoryTools[key].id === tool_id) {
            tool = categoryTools[key];
        }
    });

    return tool;
}

/**
 * Get all categories
 */
export function getAllCategories(): ToolCategory[] {
    return ['documents', 'images', 'audios', 'videos', 'batch'];
}

/**
 * Get tool by ID
 */
export function getToolById(toolId: string): ToolConfig | undefined {
    return TOOLS[toolId];
}

/**
 * Check if a tool exists
 */
export function toolExists(toolId: string): boolean {
    return toolId in TOOLS;
}

/**
 * Get all tool IDs
 */
export function getAllToolIds(): string[] {
    return Object.keys(TOOLS);
}
