import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
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
import { colorSystem, containerVariants, itemVariants, fileTypeIcons } from './utils/utils';
import { DropZone } from './DropZone';
import { conversionService } from '../../services/api';
import { pdfService } from '../../services/api';

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
        conversionService.submit(formData)
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
        console.log("Files:", files)
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
