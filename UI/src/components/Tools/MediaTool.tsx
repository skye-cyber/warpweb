/// <referenc="../../../types/*"
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, Variants } from 'framer-motion';
import {
    FileText,
    X,
    Upload,
    RefreshCw,
    Sliders,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { TOOLS } from '../../config/ToolSchema';
import { SettingsPanel, AdvancedOptions, AudioEffects } from './SettingsPanel';
import { getFirstToolByCategory } from '../../config/ToolSchema';
import { categoryIconType, colorSystem, containerVariants, itemVariants } from './utils/utils';
import { DropZone } from './DropZone';
import {
    conversionService,
    pdfService,
    audioService,
    videoService,
    imageService,
    documentService
} from '../../services/api';
import { categoryIcons } from './utils/utils';
import type {
    ConversionRequest,
    AudioJoinRequest,
    PDFJoinRequest,
    PageExtractionRequest,
    ImageResizeRequest,
    OCRRequest,
    TextToWordRequest,
    VideoAnalysisRequest,
    TaskPriority as TaskPriorityType
} from '../../services/types/api';
import { ConversionType, TaskPriority } from '../../services/types/api.d';
import { colorSystemType } from './utils/utils';

// Map tool IDs to API operations
const toolToOperationMap: Record<string, ConversionType> = {
    // PDF operations
    'pdf-join': ConversionType.PDF_JOIN,
    'pdf-extract': ConversionType.EXTRACT_PAGES,
    'pdf-extract-images': ConversionType.EXTRACT_IMAGES,
    'pdf-scan': ConversionType.SCAN_PDF,
    'pdf-to-long-image': ConversionType.PDF_TO_LONG_IMAGE,

    // Audio operations
    'audio-convert': ConversionType.CONVERT_AUDIO,
    'audio-extract': ConversionType.EXTRACT_AUDIO,
    'audio-join': ConversionType.JOIN_AUDIO,
    'audio-record': ConversionType.RECORD,
    'audio-effects': ConversionType.AUDIO_EFFECTS,

    // Video operations
    'video-convert': ConversionType.CONVERT_VIDEO,
    'video-analyze': ConversionType.ANALYZE_VIDEO,
    'video-extract-frames': 'extract-frames' as ConversionType,
    'video-compress': 'compress-video' as ConversionType,

    // Image operations
    'image-convert': ConversionType.CONVERT_IMAGE,
    'image-resize': ConversionType.RESIZE_IMAGE,
    'image-to-pdf': ConversionType.IMAGES_TO_PDF,
    'image-to-word': ConversionType.IMAGES_TO_WORD,
    'image-grayscale': ConversionType.IMAGES_TO_GRAY,
    'image-ocr': ConversionType.OCR,

    // Document operations
    'document-convert': ConversionType.CONVERT_DOC,
    'document-to-image': ConversionType.DOC_TO_IMAGE,
    'html-to-word': ConversionType.HTML_TO_WORD,
    'text-to-word': ConversionType.TEXT_TO_WORD,
    'markdown-to-word': ConversionType.MARKDOWN_TO_DOCX,
};

// Map categories to their respective services
export const categoryServiceMap = {
    pdf: pdfService,
    audios: audioService,
    videos: videoService,
    images: imageService,
    documents: documentService,
};

// Main MediaTool Component
export const MediaTool = () => {
    const { activeTool, ui } = useSelector((state: any) => state.warp);
    const toolId = activeTool?.id || (ui?.activeTab && getFirstToolByCategory(ui.activeTab));
    const config = toolId ? TOOLS[toolId] : null;

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);

    if (!config) return null;

    const {
        category,
        color = 'green',
        title,
        badge,
        accepts,
        dropzoneText,
        dropzoneSubtext,
        submitText,
        settings = [],
        effects = [],
        advanced = [],
//         icon,
//         submitIcon
    } = config;

    const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;
    const CategoryIcon = categoryIcons[category as keyof categoryIconType] || FileText;

    // Prepare form data for submission
    const prepareRequestData = (formData: FormData): any => {
        const operation = toolToOperationMap[toolId];
        const inputPaths = files.map((file: any) => file.path || URL.createObjectURL(file));
        const settings = formData

        // Get settings from form
        const settingsData: Record<string, any> = {};
        settings.forEach((setting: any) => {
            const value = formData.get(setting.name);
            if (value) {
                settingsData[setting.name] = setting.type === 'number' ? Number(value) : value;
            }
        });

        // Get advanced options
        const advancedData: Record<string, any> = {};
        advanced.forEach((option: any) => {
            const value = formData.get(option.name);
            if (value) {
                advancedData[option.name] = option.type === 'number' ? Number(value) : value;
            }
        });

        // Get audio effects
        const effectsData: Record<string, any> = {};
        effects.forEach((effect: any) => {
            const value = formData.get(effect.name);
            if (value) {
                effectsData[effect.name] = effect.type === 'number' ? Number(value) : value;
            }
        });

        // Base request structure
        const baseRequest: ConversionRequest = {
            operation,
            input_paths: inputPaths,
            options: {
                ...settingsData,
                ...advancedData,
                ...effectsData
            }
        };

        // Handle specific operations
        switch (toolId) {
            case 'pdf-join':
                return {
                    pdf_paths: inputPaths,
                    output_path: formData.get('output_path') || null,
                    order: formData.get('order') || 'AAB'
                } as PDFJoinRequest;

            case 'pdf-extract':
                return {
                    pdf_path: inputPaths[0],
                    start_page: formData.get('start_page') ? Number(formData.get('start_page')) : 1,
                    stop_page: formData.get('stop_page') ? Number(formData.get('stop_page')) : -1,
                    output_path: formData.get('output_path') || null
                } as PageExtractionRequest;

            case 'pdf-extract-images':
                return {
                    pdf_path: inputPaths[0],
                    output_dir: formData.get('output_dir') || null,
                    image_size: formData.get('image_size') || null
                };

            case 'pdf-scan':
                return {
                    pdf_path: inputPaths[0],
                    mode: formData.get('mode') || 'standard',
                    separator: formData.get('separator') || '\n'
                };

            case 'audio-join':
                return {
                    input_paths: inputPaths,
                    output_path: formData.get('output_path') || null
                } as AudioJoinRequest;

            case 'audio-record':
                return {
                    duration: formData.get('duration') ? Number(formData.get('duration')) : null,
                    output_format: formData.get('output_format') || 'wav',
                    output_path: formData.get('output_path') || null
                };

            case 'audio-effects':
                return effectsData;

            case 'image-resize':
                return {
                    image_path: inputPaths[0],
                    target_size: formData.get('target_size') || '50%',
                    output_format: formData.get('output_format') || null,
                    output_path: formData.get('output_path') || null
                } as ImageResizeRequest;

            case 'image-ocr':
                return {
                    image_paths: inputPaths,
                    language: formData.get('language') || 'eng',
                    separator: formData.get('separator') || '\n',
                    output_path: formData.get('output_path') || null
                } as OCRRequest;

            case 'image-to-pdf':
                return {
                    image_paths: inputPaths,
                    output_path: formData.get('output_path') || null,
                    sort: formData.get('sort') === 'true',
                    walk: formData.get('walk') === 'true'
                };

            case 'image-to-word':
                return {
                    image_paths: inputPaths,
                    output_path: formData.get('output_path') || null
                };

            case 'text-to-word':
                return {
                    text_path: inputPaths[0],
                    font_size: formData.get('font_size') ? Number(formData.get('font_size')) : 12,
                    font_name: formData.get('font_name') || 'Times New Roman',
                    output_path: formData.get('output_path') || null
                } as TextToWordRequest;

            case 'video-analyze':
                return {
                    video_path: inputPaths[0],
                    analyze_audio: formData.get('analyze_audio') === 'true',
                    extract_metadata: formData.get('extract_metadata') !== 'false'
                } as VideoAnalysisRequest;

            case 'video-extract-frames':
                return {
                    video_path: inputPaths[0],
                    frame_rate: formData.get('frame_rate') ? Number(formData.get('frame_rate')) : 1,
                    output_dir: formData.get('output_dir') || null,
                    format: formData.get('format') || 'jpg'
                };

            case 'video-compress':
                return {
                    video_path: inputPaths[0],
                    target_size: formData.get('target_size') || null,
                    quality: formData.get('quality') ? Number(formData.get('quality')) : 23,
                    output_path: formData.get('output_path') || null
                };

            default:
                // For generic conversions (convert, etc.)
                baseRequest.target_format = formData.get('target_format')?.toString() || null;
                baseRequest.threads = formData.get('threads') ? Number(formData.get('threads')) : 3;
                baseRequest.no_resume = formData.get('no_resume') === 'true';
                return baseRequest;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);
        setProgress(0);

        try {
            const formData = new FormData(e.currentTarget);
            const requestData = prepareRequestData(formData);
            const priority = (formData.get('priority') as TaskPriorityType) || TaskPriority.MEDIUM;

            console.log('Submitting to API:', {
                toolId,
                category,
                operation: toolToOperationMap[toolId],
                requestData
            });

            let response;

            // Route to appropriate service based on category and operation
            switch (category as string) {
                case 'pdf':
                    if (toolId === 'pdf-join') {
                        response = await pdfService.join(requestData, priority);
                    } else if (toolId === 'pdf-extract') {
                        response = await pdfService.extractPages(requestData, priority);
                    } else if (toolId === 'pdf-extract-images') {
                        const { pdf_path, output_dir, image_size } = requestData;
                        response = await pdfService.extractImages(pdf_path, output_dir, image_size, priority);
                    } else if (toolId === 'pdf-scan') {
                        const { pdf_path, mode, separator } = requestData;
                        response = await pdfService.scan(pdf_path, mode, separator, priority);
                    } else if (toolId === 'pdf-to-long-image') {
                        const { pdf_path, output_path } = requestData;
                        response = await pdfService.toLongImage(pdf_path, output_path, priority);
                    } else {
                        // Use conversion service for generic PDF operations
                        response = await conversionService.submit(requestData, priority);
                    }
                    break;

                case 'audios':
                    if (toolId === 'audio-convert') {
                        response = await audioService.convert(requestData, priority);
                    } else if (toolId === 'audio-extract') {
                        const { video_path, output_format, output_path } = requestData;
                        response = await audioService.extractFromVideo(video_path, output_format, output_path, priority);
                    } else if (toolId === 'audio-join') {
                        response = await audioService.join(requestData, priority);
                    } else if (toolId === 'audio-record') {
                        const { duration, output_format, output_path } = requestData;
                        response = await audioService.record(duration, output_format, output_path, priority);
                    } else if (toolId === 'audio-effects') {
                        const { audio_path, effects, output_path } = requestData;
                        response = await audioService.applyEffects(audio_path, effects, output_path, priority);
                    } else {
                        response = await conversionService.submit(requestData, priority);
                    }
                    break;

                case 'videos':
                    if (toolId === 'video-convert') {
                        response = await videoService.convert(requestData, priority);
                    } else if (toolId === 'video-analyze') {
                        response = await videoService.analyze(requestData, priority);
                    } else if (toolId === 'video-extract-frames') {
                        const { video_path, frame_rate, output_dir, format } = requestData;
                        response = await videoService.extractFrames(video_path, frame_rate, output_dir, format, priority);
                    } else if (toolId === 'video-compress') {
                        const { video_path, target_size, quality, output_path } = requestData;
                        response = await videoService.compress(video_path, target_size, quality, output_path, priority);
                    } else {
                        response = await conversionService.submit(requestData, priority);
                    }
                    break;

                case 'images':
                    if (toolId === 'image-convert') {
                        response = await imageService.convert(requestData, priority);
                    } else if (toolId === 'image-resize') {
                        response = await imageService.resize(requestData, priority);
                    } else if (toolId === 'image-to-pdf') {
                        const { image_paths, output_path, sort, walk } = requestData;
                        response = await imageService.toPdf(image_paths, output_path, sort, walk, priority);
                    } else if (toolId === 'image-to-word') {
                        const { image_paths, output_path } = requestData;
                        response = await imageService.toWord(image_paths, output_path, priority);
                    } else if (toolId === 'image-grayscale') {
                        const { image_paths, output_dir } = requestData;
                        response = await imageService.toGrayscale(image_paths, output_dir, priority);
                    } else if (toolId === 'image-ocr') {
                        response = await imageService.ocr(requestData, priority);
                    } else {
                        response = await conversionService.submit(requestData, priority);
                    }
                    break;

                case 'documents':
                    if (toolId === 'document-convert') {
                        response = await documentService.convert(requestData, priority);
                    } else if (toolId === 'document-to-image') {
                        const { document_path, output_format, output_dir } = requestData;
                        response = await documentService.toImage(document_path, output_format, output_dir, priority);
                    } else if (toolId === 'html-to-word') {
                        const { html_paths, output_dir } = requestData;
                        response = await documentService.htmlToWord(html_paths, output_dir, priority);
                    } else if (toolId === 'text-to-word') {
                        response = await documentService.textToWord(requestData, priority);
                    } else if (toolId === 'markdown-to-word') {
                        const { markdown_path, output_path } = requestData;
                        response = await documentService.markdownToWord(markdown_path, output_path, priority);
                    } else {
                        response = await conversionService.submit(requestData, priority);
                    }
                    break;

                default:
                    // Use generic conversion service
                    response = await conversionService.submit(requestData, priority);
            }

            console.log('API Response:', response.data);

            // Start polling for task status if task_id is returned
            if (response.data?.task_id) {
                pollTaskStatus(response.data.task_id);
            }

            // Clear form on success
            clearForm();

            // Show success message (you can add a toast notification here)
            alert('Task submitted successfully! Task ID: ' + response.data.task_id);

        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.response?.data?.detail || err.message || 'Failed to submit task');

            // Show error message
            alert('Error: ' + (err.response?.data?.detail || err.message));
        } finally {
            setIsProcessing(false);
        }
    };

    const pollTaskStatus = async (taskId: string) => {
        // Import tasks service dynamically to avoid circular dependencies
        const { tasksService } = await import('../../services/api');

        const interval = setInterval(async () => {
            try {
                const response = await tasksService.getStatus(taskId);
                const status = response.data;

                setProgress(status.progress);

                if (status.status === 'completed') {
                    clearInterval(interval);
                    setProgress(100);
                    alert('Task completed successfully!');
                } else if (status.status === 'failed') {
                    clearInterval(interval);
                    setError(status.error || 'Task failed');
                    alert('Task failed: ' + (status.error || 'Unknown error'));
                }
            } catch (err) {
                console.error('Error polling task status:', err);
                clearInterval(interval);
            }
        }, 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...newFiles]);
        setError(null);
    };

    const handleRemoveFile = (index?: number) => {
        if (index === undefined || index === -1) {
            setFiles([]);
        } else {
            setFiles(prev => prev.filter((_, i) => i !== index));
        }
        setError(null);
    };

    const clearForm = () => {
        setFiles([]);
        setShowAdvanced(false);
        setError(null);
        setProgress(0);
    };

    const getUploadLabel = () => {
        switch (category) {
            case 'audios': return 'Upload Audio Files';
            case 'images': return 'Upload Images';
            case 'documents': return 'Upload Documents';
            case 'videos': return 'Upload Videos';
            default: return 'Upload Files';
        }
    };

    return (
        <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-4xl mx-auto px-4 py-6"
        >
            <motion.div
                variants={itemVariants as any}
                className="bg-white dark:bg-cyber-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-cyber-800 overflow-hidden"
            >
                {/* Header with Gradient */}
                <div className={`relative px-6 py-5 bg-gradient-to-r ${colors.light.gradient} ${colors.dark.gradient}`}>
                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />

                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                                className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
                            >
                                <CategoryIcon className="w-6 h-6 text-white" />
                            </motion.div>

                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                                    <span>{title}</span>
                                    <Sparkles className="w-5 h-5 text-white/80" />
                                </h1>
                                <p className="text-white/80 text-sm mt-1">
                                    {category.charAt(0).toUpperCase() + category.slice(1)} Processing Tool
                                </p>
                            </div>
                        </div>

                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30`}
                        >
                            <span className="text-sm font-medium text-white">{badge}</span>
                        </motion.div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* File Upload Section */}
                    <motion.div variants={itemVariants as Variants}>
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            <Upload className="w-4 h-4 mr-2" />
                            {getUploadLabel()}
                        </label>

                        <DropZone
                            isDragging={isDragging}
                            files={files}
                            onDrop={setIsDragging}
                            onFileChange={handleFileChange}
                            onClear={handleRemoveFile}
                            dropzoneText={dropzoneText as string}
                            dropzoneSubtext={dropzoneSubtext as string}
                            color={color as keyof colorSystemType}
                            accepts={accepts as string}
                        />
                    </motion.div>

                    {/* Settings Section */}
                    {settings.length > 0 && (
                        <motion.div variants={itemVariants as Variants} className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Sliders className={`w-4 h-4 ${colors.light.icon} ${colors.dark.icon}`} />
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Settings
                                </h3>
                            </div>
                            <SettingsPanel settings={settings} category={category} color={color} />
                        </motion.div>
                    )}

                    {/* Audio Effects */}
                    {category === 'audios' && effects.length > 0 && (
                        <motion.div variants={itemVariants as Variants}>
                            <AudioEffects
                                effects={effects}
                                isOpen={showAdvanced}
                                onToggle={() => setShowAdvanced(!showAdvanced)}
                                color={color}
                            />
                        </motion.div>
                    )}

                    {/* Advanced Options */}
                    {(category === 'images' || category === 'videos' || category === 'documents') && advanced.length > 0 && (
                        <motion.div variants={itemVariants as Variants}>
                            <AdvancedOptions
                                advanced={advanced}
                                category={category}
                                isOpen={showAdvanced}
                                onToggle={() => setShowAdvanced(!showAdvanced)}
                                color={color}
                            />
                        </motion.div>
                    )}

                    {/* Error Display */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                        >
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </motion.div>
                    )}

                    {/* Progress Display */}
                    {isProcessing && progress > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>Processing...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-cyber-700 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className={`h-full bg-gradient-to-r ${colors.light.gradient} ${colors.dark.gradient}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div variants={itemVariants as Variants} className="flex space-x-4 pt-4">
                        <motion.button
                            type="submit"
                            disabled={files.length === 0 || isProcessing}
                            whileHover={files.length > 0 ? { scale: 1.02 } : {}}
                            whileTap={files.length > 0 ? { scale: 0.98 } : {}}
                            className={`
            flex-1 relative overflow-hidden group
            ${files.length === 0 || isProcessing
                                    ? 'bg-gray-300 dark:bg-cyber-700 cursor-not-allowed'
                                    : `${colors.light.button} ${colors.dark.button} shadow-lg ${colors.light.shadow}`
                                }
            text-white font-medium py-3 px-6 rounded-xl
            transition-all duration-300
            flex items-center justify-center space-x-2
            `}
                        >
                            {isProcessing ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <ArrowRight className="w-5 h-5" />
                                    <span>{submitText}</span>
                                </>
                            )}

                            {files.length > 0 && !isProcessing && (
                                <motion.div
                                    className="absolute inset-0 bg-white/20"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={clearForm}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-cyber-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-cyber-800 transition-all duration-300 font-medium flex items-center space-x-2"
                        >
                            <X className="w-4 h-4" />
                            <span>Clear</span>
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.section>
    );
};
