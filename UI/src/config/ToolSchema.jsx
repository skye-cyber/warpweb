import { MediaTool } from "../components/Tools/MediaTool";

export const TOOLS = {
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
//     compress_pdf: {
//         category: 'documents',
//         id: 'compress_pdf',
//         title: 'Compress PDF',
//         color: 'blue',
//         badge: 'Reduce size',
//         accepts: '.pdf',
//         dropzoneText: 'Drop PDF files here',
//         dropzoneSubtext: 'Compress PDFs while maintaining quality',
//         submitText: 'Compress PDF',
//         settings: ['compressionLevel'],
//         icon: 'docCompress',
//         submitIcon: 'compress'
//     },
    scan_pdf: {
        category: 'documents',
        id: 'scan_pdf',
        name: 'scan pdf',
        description: "scan pdf document"
    },
    doc_long_image: {
        category: 'documents',
        id: 'doc_long_image',
        name: "document to longimage",
        description: "convert to long image"
    },
    extract_pages: {
        category: 'documents',
        id: 'extract_pages',
        name: 'extract pages',
        description: "extract pages from document"
    },
    doc2image: {
        category: 'documents',
        id: 'doc2image',
        name: 'doc to image',
        description: "convert document to image"
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
        description: "resize"
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
        description: "perform text extraction on image"
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
        description: "manipulate audio to create sound effects"
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
//     compress_video: {
//         category: 'video',
//         id: 'compress_video',
//         title: 'Compress Video',
//         color: 'purple',
//         badge: 'Reduce size',
//         accepts: '.mp4,.avi,.mov,.mkv',
//         dropzoneText: 'Drop videos to compress',
//         dropzoneSubtext: 'Reduce video file size while maintaining quality',
//         submitText: 'Compress Video',
//         settings: ['compressionLevel', 'targetSize'],
//         icon: 'videoCompress',
//         submitIcon: 'compress'
//     },
    analyze_video: {
        category: 'videos',
        id: 'analyze_video',
        name: "analyze video",
        description: "Obtain video metadata"
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
        description: "dashboard batch ops"
    },
    batch_doc_convert: {
        category: 'batch',
        id: 'batch_doc_convert',
        name: "batch doc convert",
        description: "convert multiple documents"
    },
    folder_operations: {
        category: 'batch',
        id: 'folder_operations',
        name: "batch folder operation",
        description: "operate on folder"
    },
    bulk_ocr: {
        category: 'batch',
        id: 'bulk_ocr',
        name: "bulk ocr",
        descritpion: "bulk ocr operations"
    }
}

export const TOOL_CATEGORIES = {
    audio: {
        id: 'audio',
        name: 'Audio Tools',
        icon: 'audio',
        tools: ['convert_audio', 'audio_join', 'extract_audio']
    },
    image: {
        id: 'image',
        name: 'Image Tools',
        icon: 'image',
        tools: ['convert_image', 'image2pdf', 'image2word', 'image2gray']
    },
    documents: {
        id: 'documents',
        name: 'Document Tools',
        icon: 'document',
        tools: ['convert_doc', 'merge_docs', 'compress_pdf']
    },
    video: {
        id: 'video',
        name: 'Video Tools',
        icon: 'video',
        tools: ['convert_video', 'compress_video']
    }
};

export const InterfaceComponentMap = {
    documents: MediaTool,
    videos: MediaTool,
    audios: MediaTool,
    images: MediaTool,
}

export function getComponentById(id){
    console.log(id, InterfaceComponentMap[id])
    return InterfaceComponentMap[id]
}

export function getToolsByCategory(category = "documents") {
    const keys = Object.keys(TOOLS)
    let filtered_tools = {}

    keys.forEach((key) => TOOLS[key].category === category ? filtered_tools = { ...filtered_tools, [key]: TOOLS[key] } : '')
    return filtered_tools
}

export function getFirstToolByCategory(category = "documents") {
    const keys = Object.keys(TOOLS)

    for (const key of keys) {
        if (TOOLS[key].category === category) {
            return { [key]: TOOLS[key] }
        }
    }
    return null
}

export function sortToolsByCategory() {
    const keys = Object.keys(TOOLS)
    //const categories = ['documents', 'images', 'videos', 'audio', 'batch', 'misceleneous']
    let sortedTools = {}

    keys.forEach((key) => {
        const category = TOOLS[key].category
        if (!Object.keys(sortedTools).includes(category)) {
            sortedTools = {
                ...sortedTools,
                [category]: [{ [key]: TOOLS[key] }]
            }
        } else {
            sortedTools[category].push({ [key]: TOOLS[key] })
        }
    })
    return sortedTools
}

export function countCategoryTools(category) {
    const tools = getToolsByCategory(category)
    return Object.keys(tools).length
}

export function getToolFromCategory(category, tool_id) {
    const categoryTools = getToolsByCategory(category)
    let tool

    Object.keys(categoryTools).forEach((key) => {
        if (categoryTools[key].id === tool_id) {
            tool = categoryTools[key]
        }
    })
    return tool
}
