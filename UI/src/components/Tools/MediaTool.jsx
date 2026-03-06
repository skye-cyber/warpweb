import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Music,
    Video,
    Image as ImageIcon,
    FileUp,
    FileDown,
    Combine,
    Scissors,
    Wand2,
    Settings2,
    ChevronDown,
    X,
    Check,
    Upload,
    Cloud,
    File,
    Trash2,
    RefreshCw,
    Download,
    Maximize2,
    Minimize2,
    Sliders,
    AudioLines,
    FileImage,
    FileVideo,
    FileAudio,
    FileDigit,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { TOOLS } from '../../config/ToolSchema';
import { SettingsPanel, AdvancedOptions, AudioEffects } from './SettingsPanel';
import { getFirstToolByCategory } from '../../config/ToolSchema';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

// Color system based on your palette
const colorSystem = {
    green: {
        light: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-700',
            icon: 'text-green-600',
            badge: 'bg-green-100 text-green-700',
            button: 'bg-green-600 hover:bg-green-700',
            ring: 'ring-green-500/30',
            gradient: 'from-green-500 to-green-600',
            shadow: 'shadow-green-500/20',
            hover: 'hover:border-green-300',
            focus: 'focus:ring-green-500'
        },
        dark: {
            bg: 'dark:bg-green-950/30',
            border: 'dark:border-green-800',
            text: 'dark:text-green-400',
            icon: 'dark:text-green-400',
            badge: 'dark:bg-green-900/50 dark:text-green-300',
            button: 'dark:bg-green-600 dark:hover:bg-green-500',
            ring: 'dark:ring-green-400/30',
            gradient: 'dark:from-green-500 dark:to-green-400',
            hover: 'dark:hover:border-green-700',
            focus: 'dark:focus:ring-green-400'
        }
    },
    red: {
        light: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-700',
            icon: 'text-red-600',
            badge: 'bg-red-100 text-red-700',
            button: 'bg-red-600 hover:bg-red-700',
            ring: 'ring-red-500/30',
            gradient: 'from-red-500 to-red-600',
            shadow: 'shadow-red-500/20',
            hover: 'hover:border-red-300',
            focus: 'focus:ring-red-500'
        },
        dark: {
            bg: 'dark:bg-red-950/30',
            border: 'dark:border-red-800',
            text: 'dark:text-red-400',
            icon: 'dark:text-red-400',
            badge: 'dark:bg-red-900/50 dark:text-red-300',
            button: 'dark:bg-red-600 dark:hover:bg-red-500',
            ring: 'dark:ring-red-400/30',
            gradient: 'dark:from-red-500 dark:to-red-400',
            hover: 'dark:hover:border-red-700',
            focus: 'dark:focus:ring-red-400'
        }
    },
    blue: {
        light: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            icon: 'text-blue-600',
            badge: 'bg-blue-100 text-blue-700',
            button: 'bg-blue-600 hover:bg-blue-700',
            ring: 'ring-blue-500/30',
            gradient: 'from-blue-500 to-blue-600',
            shadow: 'shadow-blue-500/20',
            hover: 'hover:border-blue-300',
            focus: 'focus:ring-blue-500'
        },
        dark: {
            bg: 'dark:bg-blue-950/30',
            border: 'dark:border-blue-800',
            text: 'dark:text-blue-400',
            icon: 'dark:text-blue-400',
            badge: 'dark:bg-blue-900/50 dark:text-blue-300',
            button: 'dark:bg-blue-600 dark:hover:bg-blue-500',
            ring: 'dark:ring-blue-400/30',
            gradient: 'dark:from-blue-500 dark:to-blue-400',
            hover: 'dark:hover:border-blue-700',
            focus: 'dark:focus:ring-blue-400'
        }
    },
    purple: {
        light: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            icon: 'text-purple-600',
            badge: 'bg-purple-100 text-purple-700',
            button: 'bg-purple-600 hover:bg-purple-700',
            ring: 'ring-purple-500/30',
            gradient: 'from-purple-500 to-purple-600',
            shadow: 'shadow-purple-500/20',
            hover: 'hover:border-purple-300',
            focus: 'focus:ring-purple-500'
        },
        dark: {
            bg: 'dark:bg-purple-950/30',
            border: 'dark:border-purple-800',
            text: 'dark:text-purple-400',
            icon: 'dark:text-purple-400',
            badge: 'dark:bg-purple-900/50 dark:text-purple-300',
            button: 'dark:bg-purple-600 dark:hover:bg-purple-500',
            ring: 'dark:ring-purple-400/30',
            gradient: 'dark:from-purple-500 dark:to-purple-400',
            hover: 'dark:hover:border-purple-700',
            focus: 'dark:focus:ring-purple-400'
        }
    }
};

// Category icon mapping
const categoryIcons = {
    audios: Music,
    images: ImageIcon,
    documents: FileText,
    videos: Video
};

// File type icon mapping
const fileTypeIcons = {
    default: File,
    audio: FileAudio,
    image: FileImage,
    video: FileVideo,
    document: FileDigit
};

// File List Component
const FileList = ({ files, onRemove, color }) => {
    const colors = colorSystem[color] || colorSystem.green;

    return (
        <motion.div
            className="mt-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <AnimatePresence>
                {files.map((file, idx) => (
                    <motion.div
                        key={`${file.name}-${idx}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`
                group relative flex items-center justify-between p-3 rounded-xl
                ${colors.light.bg} ${colors.dark.bg}
                border ${colors.light.border} ${colors.dark.border}
                hover:shadow-md transition-all duration-300
                `}
                    >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className={`p-2 rounded-lg ${colors.light.bg} ${colors.dark.bg} bg-opacity-50`}>
                                <FileIcon file={file} className={`w-5 h-5 ${colors.light.icon} ${colors.dark.icon}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {file.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => onRemove(idx)}
                            className={`
                    p-1.5 rounded-lg opacity-0 group-hover:opacity-100
                    hover:bg-gray-200 dark:hover:bg-cyber-700
                    text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                    transition-all duration-200
                    `}
                        >
                            <X className="w-4 h-4" />
                        </motion.button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

// File Icon Helper
const FileIcon = ({ file, className }) => {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (['mp3', 'wav', 'flac', 'm4a', 'aac'].includes(ext)) {
        return <FileAudio className={className} />;
    }
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext)) {
        return <FileVideo className={className} />;
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) {
        return <FileImage className={className} />;
    }
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) {
        return <FileDigit className={className} />;
    }
    return <File className={className} />;
};

// DropZone Component
const DropZone = ({
    isDragging,
    files,
    onDrop,
    onFileChange,
    onClear,
    dropzoneText,
    dropzoneSubtext,
    color,
    accepts
}) => {
    const fileInputRef = useRef(null);
    const colors = colorSystem[color] || colorSystem.green;

    const handleDragOver = (e) => {
        e.preventDefault();
        onDrop?.(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        onDrop?.(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        onDrop?.(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        onFileChange?.({ target: { files: droppedFiles } });
    };

    return (
        <div
            ref={fileInputRef}
            onClick={() => !files.length && document.getElementById('file-input')?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
            relative group cursor-pointer rounded-2xl border-2 border-dashed
            transition-all duration-300 overflow-hidden
            ${isDragging
                    ? `${colors.light.border} ${colors.dark.border} scale-[1.02] ${colors.light.bg} ${colors.dark.bg}`
                    : 'border-gray-300 dark:border-cyber-700 hover:border-gray-400 dark:hover:border-cyber-600'
                }
            ${files.length > 0 ? 'p-4' : 'p-8'}
            `}
        >
            <input
                id="file-input"
                type="file"
                multiple
                accept={accepts}
                className="hidden"
                onChange={onFileChange}
            />

            {files.length === 0 ? (
                <motion.div
                    className="text-center"
                    animate={{ y: isDragging ? -5 : 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <motion.div
                        animate={{
                            scale: isDragging ? 1.1 : 1,
                            rotate: isDragging ? [0, -5, 5, -5, 0] : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center mb-4"
                    >
                        <Cloud className={`w-16 h-16 ${isDragging ? colors.light.icon : 'text-gray-400 dark:text-gray-600'}`} />
                    </motion.div>

                    <p className={`text-lg font-medium mb-2 transition-colors ${isDragging ? colors.light.text : 'text-gray-700 dark:text-gray-300'}`}>
                        {dropzoneText}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {dropzoneSubtext}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        or click to browse
                    </p>
                </motion.div>
            ) : (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className={`p-1.5 rounded-lg ${colors.light.bg} ${colors.dark.bg}`}>
                                <Check className={`w-4 h-4 ${colors.light.icon} ${colors.dark.icon}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {files.length} file{files.length > 1 ? 's' : ''} selected
                            </span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear?.();
                            }}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors flex items-center gap-1"
                        >
                            <Trash2 className="w-3 h-3" />
                            Clear all
                        </motion.button>
                    </div>

                    <FileList files={files} onRemove={onClear} color={color} />

                    <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
                        Click or drag to add more files
                    </p>
                </div>
            )}
        </div>
    );
};

// Main MediaTool Component
export const MediaTool = () => {
    const { activeTool, ui } = useSelector((state) => state.warp);
    const toolId = activeTool?.id || (ui?.activeTab && getFirstToolByCategory(ui.activeTab));
    const config = toolId ? TOOLS[toolId] : null;

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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
        icon,
        submitIcon
    } = config;

    const colors = colorSystem[color] || colorSystem.green;
    const CategoryIcon = categoryIcons[category] || FileText;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const formData = new FormData(e.target);
        console.log('Submitting:', toolId, Object.fromEntries(formData));

        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
        }, 2000);
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...newFiles]);
    };

    const handleRemoveFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const clearForm = () => {
        setFiles([]);
        setShowAdvanced(false);
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
                variants={itemVariants}
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
                    <motion.div variants={itemVariants}>
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
                            dropzoneText={dropzoneText}
                            dropzoneSubtext={dropzoneSubtext}
                            color={color}
                            accepts={accepts}
                        />
                    </motion.div>

                    {/* Settings Section */}
                    {settings.length > 0 && (
                        <motion.div variants={itemVariants} className="space-y-4">
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
                        <motion.div variants={itemVariants}>
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
                        <motion.div variants={itemVariants}>
                            <AdvancedOptions
                                advanced={advanced}
                                category={category}
                                isOpen={showAdvanced}
                                onToggle={() => setShowAdvanced(!showAdvanced)}
                                color={color}
                            />
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div variants={itemVariants} className="flex space-x-4 pt-4">
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

            {/* Styles */}
            <style jsx>{`
                .bg-grid-pattern {
                    background-image:
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
                }
                `}</style>
        </motion.section>
    );
};
