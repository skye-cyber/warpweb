// Updated MediaTool component with blob upload handling
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
    Sparkles,
    CheckCircle,
    AlertCircle
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
    documentService,
    blobUploadService
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
import { TaskPriority } from '../../services/types/api.d';
import { colorSystemType } from './utils/utils';
import { toolToOperationMap } from '../../config/ToolSchema';
import { FileUploadStatus } from '../../services/types/api';


// Main MediaTool Component
export const MediaTool = () => {
    const { activeTool, ui } = useSelector((state: any) => state.warp);
    const toolId = activeTool?.id || (ui?.activeTab && getFirstToolByCategory(ui.activeTab));
    const config = toolId ? TOOLS[toolId] : null;

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [fileUploadStatuses, setFileUploadStatuses] = useState<Map<string, FileUploadStatus>>(new Map());
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [taskId, setTaskId] = useState<string | null>(null);

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
    } = config;

    const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;
    const CategoryIcon = categoryIcons[category as keyof categoryIconType] || FileText;

    // Prepare form data for submission (modified to work with file paths)
    const prepareRequestData = async (uploadedPaths: string[], formData: FormData): Promise<any> => {
        const operation = toolToOperationMap[toolId];

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
            input_paths: uploadedPaths, // Use uploaded server paths instead of blob URLs
            options: {
                ...settingsData,
                ...advancedData,
                ...effectsData
            }
        };

        // Handle specific operations
        switch (toolId) {
            case 'merge_pdf':
                return {
                    pdf_paths: uploadedPaths,
                    output_path: formData.get('output_path') || null,
                    order: formData.get('order') || 'AAB'
                } as PDFJoinRequest;

            case 'extract_pdf_pages':
                return {
                    pdf_path: uploadedPaths[0],
                    start_page: formData.get('start_page') ? Number(formData.get('start_page')) : 1,
                    stop_page: formData.get('stop_page') ? Number(formData.get('stop_page')) : -1,
                    output_path: formData.get('output_path') || null
                } as PageExtractionRequest;

            case 'pdf-extract-images':
                return {
                    pdf_path: uploadedPaths[0],
                    output_dir: formData.get('output_dir') || null,
                    image_size: formData.get('image_size') || null
                };

            case 'scan_pdf':
                return {
                    pdf_path: uploadedPaths[0],
                    mode: formData.get('mode') || 'standard',
                    separator: formData.get('separator') || '\n'
                };

            case 'audio_join':
                return {
                    input_paths: uploadedPaths,
                    output_path: formData.get('output_path') || null
                } as AudioJoinRequest;

            case 'audio-record':
                return {
                    duration: formData.get('duration') ? Number(formData.get('duration')) : null,
                    output_format: formData.get('output_format') || 'wav',
                    output_path: formData.get('output_path') || null
                };

            case 'audio-effects':
                return {
                    audio_path: uploadedPaths[0],
                    effects: effectsData,
                    output_path: formData.get('output_path') || null
                };

            case 'resize_image':
                return {
                    image_path: uploadedPaths[0],
                    target_size: formData.get('target_size') || '50%',
                    output_format: formData.get('output_format') || null,
                    output_path: formData.get('output_path') || null
                } as ImageResizeRequest;

            case 'ocr':
                return {
                    image_paths: uploadedPaths,
                    language: formData.get('language') || 'eng',
                    separator: formData.get('separator') || '\n',
                    output_path: formData.get('output_path') || null
                } as OCRRequest;

            case 'image2pdf':
                return {
                    image_paths: uploadedPaths,
                    output_path: formData.get('output_path') || null,
                    sort: formData.get('sort') === 'true',
                    walk: formData.get('walk') === 'true'
                };

            case 'image2word':
                return {
                    image_paths: uploadedPaths,
                    output_path: formData.get('output_path') || null
                };

            case 'text2word':
                return {
                    text_path: uploadedPaths[0],
                    font_size: formData.get('font_size') ? Number(formData.get('font_size')) : 12,
                    font_name: formData.get('font_name') || 'Times New Roman',
                    output_path: formData.get('output_path') || null
                } as TextToWordRequest;

            case 'analyze_video':
                return {
                    video_path: uploadedPaths[0],
                    analyze_audio: formData.get('analyze_audio') === 'true',
                    extract_metadata: formData.get('extract_metadata') !== 'false'
                } as VideoAnalysisRequest;

            case 'video-extract-frames':
                return {
                    video_path: uploadedPaths[0],
                    frame_rate: formData.get('frame_rate') ? Number(formData.get('frame_rate')) : 1,
                    output_dir: formData.get('output_dir') || null,
                    format: formData.get('format') || 'jpg'
                };

            case 'compress_video':
                return {
                    video_path: uploadedPaths[0],
                    target_size: formData.get('target_size') || null,
                    quality: formData.get('quality') ? Number(formData.get('quality')) : 23,
                    output_path: formData.get('output_path') || null
                };

            default:
                // For generic conversions
                baseRequest.target_format = formData.get('target_format')?.toString() || null;
                baseRequest.threads = formData.get('threads') ? Number(formData.get('threads')) : 3;
                return baseRequest;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);
        setProgress(0);
        setUploadProgress(0);
        setTaskId(null);

        try {
            const formData = new FormData(e.currentTarget);

            // Step 1: Upload files to server and get file paths
            console.log('Uploading files to server...');
            const uploadedPaths = await uploadFilesWithProgress(files);
            console.log('Files uploaded:', uploadedPaths);

            // Step 2: Prepare request with uploaded paths
            const requestData = await prepareRequestData(uploadedPaths, formData);
            const priority = (formData.get('priority') as TaskPriorityType) || TaskPriority.MEDIUM;

            console.log('Submitting conversion request:', requestData);
            console.log(toolId, category)
            // Step 3: Submit conversion request
            let response;

            // Route to appropriate service based on category and operation
            switch (category as string) {
                // case 'pdf':
                //     response = await handlePdfOperation(toolId, requestData, priority);
                //     break;
                case 'audios':
                    response = await handleAudioOperation(toolId, requestData, priority);
                    break;
                case 'videos':
                    response = await handleVideoOperation(toolId, requestData, priority);
                    break;
                case 'images':
                    response = await handleImageOperation(toolId, requestData, priority);
                    break;
                case 'documents':
                    response = await handleDocumentOperation(toolId, requestData, priority);
                    break;
                default:
                    response = await conversionService.submit(requestData, priority);
            }

            console.log('API Response:', response.data);

            // Start polling for task status if task_id is returned
            if (response.data?.task_id) {
                setTaskId(response.data.task_id);
                pollTaskStatus(response.data.task_id);
                setProgress(50); // After upload, conversion started
            } else {
                setProgress(100);
            }

            // Show success message
            alert('Task submitted successfully! ' + (response.data?.task_id ? `Task ID: ${response.data.task_id}` : ''));

        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to submit task');
        } finally {
            setIsProcessing(false);
        }
    };

    // Helper function to upload files with progress tracking
    const uploadFilesWithProgress = async (filesToUpload: File[]): Promise<string[]> => {
        const formData = new FormData();
        filesToUpload.forEach(file => {
            formData.append('files', file);
        });

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    console.log("Progress:", e.loaded)
                    const percent = (e.loaded / e.total) * 100;
                    setUploadProgress(percent);
                    setProgress(percent * 0.5); // Upload is first 50% of total progress
                }
            });

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    if (result.success) {
                        console.log(result)
                        setUploadProgress(100);
                        resolve(result.files);
                    } else {
                        reject(new Error(result.error || 'Upload failed'));
                    }
                } else {
                    reject(new Error(`Upload failed: ${xhr.status}`));
                }
            };

            xhr.onerror = () => reject(new Error('Network error during upload'));

            blobUploadService.open(xhr, formData)
            // xhr.open('POST', '/api/v1/upload');
            // xhr.send(formData);
        });
    };

    // Operation handlers
    const handlePdfOperation = async (toolId: string, requestData: any, priority: TaskPriorityType) => {
        if (toolId === 'merge_pdf') {
            return await pdfService.join(requestData, priority);
        } else if (toolId === 'pdf-extract') {
            return await pdfService.extractPages(requestData, priority);
        } else if (toolId === 'pdf-extract-images') {
            return await pdfService.extractImages(requestData.pdf_path, requestData.output_dir, requestData.image_size, priority);
        } else if (toolId === 'pdf-scan') {
            return await pdfService.scan(requestData.pdf_path, requestData.mode, requestData.separator, priority);
        } else if (toolId === 'pdf-to-long-image') {
            return await pdfService.toLongImage(requestData.pdf_path, requestData.output_path, priority);
        } else {
            return await conversionService.submit(requestData, priority);
        }
    };

    const handleAudioOperation = async (toolId: string, requestData: any, priority: TaskPriorityType) => {
        if (toolId === 'audio-convert') {
            return await audioService.convert(requestData, priority);
        } else if (toolId === 'audio-extract') {
            return await audioService.extractFromVideo(requestData.video_path, requestData.output_format, requestData.output_path, priority);
        } else if (toolId === 'audio-join') {
            return await audioService.join(requestData, priority);
        } else if (toolId === 'audio-record') {
            return await audioService.record(requestData.duration, requestData.output_format, requestData.output_path, priority);
        } else if (toolId === 'audio-effects') {
            return await audioService.applyEffects(requestData.audio_path, requestData.effects, requestData.output_path, priority);
        } else {
            return await conversionService.submit(requestData, priority);
        }
    };

    const handleVideoOperation = async (toolId: string, requestData: any, priority: TaskPriorityType) => {
        if (toolId === 'video-convert') {
            return await videoService.convert(requestData, priority);
        } else if (toolId === 'video-analyze') {
            return await videoService.analyze(requestData, priority);
        } else if (toolId === 'video-extract-frames') {
            return await videoService.extractFrames(requestData.video_path, requestData.frame_rate, requestData.output_dir, requestData.format, priority);
        } else if (toolId === 'video-compress') {
            return await videoService.compress(requestData.video_path, requestData.target_size, requestData.quality, requestData.output_path, priority);
        } else {
            return await conversionService.submit(requestData, priority);
        }
    };

    const handleImageOperation = async (toolId: string, requestData: any, priority: TaskPriorityType) => {
        if (toolId === 'image-convert') {
            return await imageService.convert(requestData, priority);
        } else if (toolId === 'merge_pdf') {
            return await pdfService.join(requestData, priority);
        } else if (toolId === 'image-resize') {
            return await imageService.resize(requestData, priority);
        } else if (toolId === 'image-to-pdf') {
            return await imageService.toPdf(requestData.image_paths, requestData.output_path, requestData.sort, requestData.walk, priority);
        } else if (toolId === 'image-to-word') {
            return await imageService.toWord(requestData.image_paths, requestData.output_path, priority);
        } else if (toolId === 'image-grayscale') {
            return await imageService.toGrayscale(requestData.image_paths, requestData.output_dir, priority);
        } else if (toolId === 'image-ocr') {
            return await imageService.ocr(requestData, priority);
        } else {
            return await conversionService.submit(requestData, priority);
        }
    };

    const handleDocumentOperation = async (toolId: string, requestData: any, priority: TaskPriorityType) => {
        if (toolId === 'document-convert') {
            return await documentService.convert(requestData, priority);
        } else if (toolId === 'document-to-image') {
            return await documentService.toImage(requestData.document_path, requestData.output_format, requestData.output_dir, priority);
        } else if (toolId === 'merge_pdf') {
            return await pdfService.join(requestData, priority);
        } else if (toolId === 'pdf-extract') {
            return await pdfService.extractPages(requestData, priority);
        } else if (toolId === 'pdf-extract-images') {
            return await pdfService.extractImages(requestData.pdf_path, requestData.output_dir, requestData.image_size, priority);
        } else if (toolId === 'pdf-scan') {
            return await pdfService.scan(requestData.pdf_path, requestData.mode, requestData.separator, priority);
        } else if (toolId === 'pdf-to-long-image') {
            return await pdfService.toLongImage(requestData.pdf_path, requestData.output_path, priority);
        } else if (toolId === 'pdf-to-long-image') {
            return await pdfService.toLongImage(requestData.pdf_path, requestData.output_path, priority);
        } else if (toolId === 'html-to-word') {
            return await documentService.htmlToWord(requestData.html_paths, requestData.output_dir, priority);
        } else if (toolId === 'text-to-word') {
            return await documentService.textToWord(requestData, priority);
        } else if (toolId === 'markdown-to-word') {
            return await documentService.markdownToWord(requestData.markdown_path, requestData.output_path, priority);
        } else {
            return await conversionService.submit(requestData, priority);
        }
    };

    const pollTaskStatus = async (taskId: string) => {
        const { tasksService } = await import('../../services/api');

        const interval = setInterval(async () => {
            try {
                const response = await tasksService.getStatus(taskId);
                const status = response.data;

                // Calculate overall progress (50% for upload, 50% for conversion)
                const conversionProgress = (status.progress || 0) * 0.5;
                const overallProgress = 50 + conversionProgress;
                setProgress(overallProgress);

                if (status.status === 'completed') {
                    clearInterval(interval);
                    setProgress(100);
                    console.log('Task completed successfully!');
                } else if (status.status === 'failed') {
                    clearInterval(interval);
                    setError(status.error || 'Task failed');
                    console.log('Task failed: ' + (status.error || 'Unknown error'));
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

        // Initialize upload statuses for new files
        const newStatuses = new Map(fileUploadStatuses);
        newFiles.forEach(file => {
            newStatuses.set(file.name, {
                id: `${Date.now()}_${file.name}`,
                file,
                progress: 0,
                status: 'pending'
            });
        });
        setFileUploadStatuses(newStatuses);
    };

    const handleRemoveFile = (index?: number) => {
        if (index === undefined || index === -1) {
            setFiles([]);
            setFileUploadStatuses(new Map());
        } else {
            const fileToRemove = files[index];
            setFiles(prev => prev.filter((_, i) => i !== index));
            setFileUploadStatuses(prev => {
                const newMap = new Map(prev);
                newMap.delete(fileToRemove.name);
                return newMap;
            });
        }
        setError(null);
    };

    const clearForm = () => {
        setFiles([]);
        setFileUploadStatuses(new Map());
        setShowAdvanced(false);
        setError(null);
        setProgress(0);
        setUploadProgress(0);
        setTaskId(null);
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

                        {/* File upload statuses */}
                        {fileUploadStatuses.size > 0 && (
                            <div className="mt-3 space-y-2">
                                {Array.from(fileUploadStatuses.values()).map(status => (
                                    <div key={status.id} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                                            {status.file.name}
                                        </span>
                                        {status.status === 'uploading' && (
                                            <span className="text-blue-500">Uploading...</span>
                                        )}
                                        {status.status === 'completed' && (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        )}
                                        {status.status === 'failed' && (
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
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
                    {(isProcessing || progress > 0) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-2"
                        >
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                <span>
                                    {uploadProgress > 0 && uploadProgress < 100
                                        ? `Uploading... ${Math.round(uploadProgress)}%`
                                        : taskId
                                            ? `Converting... ${Math.round(progress)}%`
                                            : 'Processing...'}
                                </span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-cyber-700 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className={`h-full bg-gradient-to-r ${colors.light.gradient} ${colors.dark.gradient}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            {taskId && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Task ID: {taskId}
                                </p>
                            )}
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
                                    <span>{uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Processing...'}</span>
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
