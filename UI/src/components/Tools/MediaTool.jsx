import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TOOLS } from '../../config/ToolSchema';
import { IconFactory } from './IconFactory';
import { SettingsPanel, AdvancedOptions, AudioEffects } from './SettingsPanel';
import { CloudIcon, UploadIcon } from '../svg/core';
import { getFirstToolByCategory } from '../../config/ToolSchema';


// Color classes mapping
const colorClasses = {
    green: {
        badge: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
        button: 'bg-green-600 hover:bg-green-700',
        checkbox: 'text-green-600 focus:ring-green-500',
        hover: 'hover:border-green-500 dark:hover:border-green-400'
    },
    red: {
        badge: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
        button: 'bg-red-600 hover:bg-red-700',
        checkbox: 'text-red-600 focus:ring-red-500',
        hover: 'hover:border-red-500 dark:hover:border-red-400'
    },
    blue: {
        badge: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700',
        checkbox: 'text-blue-600 focus:ring-blue-500',
        hover: 'hover:border-blue-500 dark:hover:border-blue-400'
    },
    purple: {
        badge: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
        button: 'bg-purple-600 hover:bg-purple-700',
        checkbox: 'text-purple-600 focus:ring-purple-500',
        hover: 'hover:border-purple-500 dark:hover:border-purple-400'
    }
};

export const MediaTool = () => {
    // Get active tool and UI state from Redux
    const { activeTool, ui } = useSelector((state) => state.warp);

    // Determine which tool to show based on activeTool or ui.activeTab
    const toolId = activeTool?.id || (ui?.activeTab && getFirstToolByCategory(ui.activeTab));

    // Get tool configuration
    const config = toolId ? TOOLS[toolId] : null;

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [files, setFiles] = useState([]);

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

    const colors = colorClasses[color] || colorClasses.green;

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log('Submitting:', toolId, Object.fromEntries(formData));
        // API call based on toolId
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const clearForm = () => {
        setFiles([]);
        setShowAdvanced(false);
    };

    const getUploadLabel = () => {
        switch (category) {
            case 'audio': return 'Upload Audio Files';
            case 'image': return 'Upload Images';
            case 'documents': return 'Upload Documents';
            case 'video': return 'Upload Videos';
            default: return 'Upload Files';
        }
    };

    return (
        <section className="mt-8 w-full sm:w-fit sm:min-w-[70%] sm:max-w-full">
            <div className="tool-interface">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="flex gap-2 text-xl font-semibold text-gray-900 dark:text-white items-center">
                        <IconFactory name={icon} color={color} />
                        {title}
                    </h3>
                    <span className={`${colors.badge} text-xs px-2 py-1 rounded`}>
                        {badge}
                    </span>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* File Upload */}
                    <div>
                        <label className="flex text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 items-center">
                            <UploadIcon />
                            {getUploadLabel()}
                        </label>
                        <div
                            className={`file-drop-zone rounded-lg p-6 text-center cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 ${colors.hover} transition-colors`}
                            onClick={() => document.querySelector('input[type="file"]').click()}
                        >
                            <div className="drop-placeholder">
                                <span className="flex justify-center">
                                    <CloudIcon />
                                </span>
                                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                                    {dropzoneText}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {dropzoneSubtext}
                                </p>
                            </div>
                            {files.length > 0 && (
                                <div className="file-list mt-4 space-y-2">
                                    {files.map((file, idx) => (
                                        <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded flex justify-between items-center">
                                            <span className="truncate max-w-[300px]">{file.name}</span>
                                            <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            name="files"
                            multiple
                            accept={accepts}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Dynamic Settings */}
                    <SettingsPanel settings={settings} category={category} />

                    {/* Category-specific options */}
                    {category === 'audio' && effects.length > 0 && (
                        <AudioEffects
                            effects={effects}
                            isOpen={showAdvanced}
                            onToggle={() => setShowAdvanced(!showAdvanced)}
                            color={color}
                        />
                    )}

                    {(category === 'image' || category === 'video' || category === 'documents') && advanced.length > 0 && (
                        <AdvancedOptions
                            advanced={advanced}
                            category={category}
                            isOpen={showAdvanced}
                            onToggle={() => setShowAdvanced(!showAdvanced)}
                        />
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className={`flex-1 ${colors.button} text-white font-medium py-3 px-6 rounded-lg transition-colors flex justify-center items-center gap-2`}
                        >
                            <IconFactory name={submitIcon} color="white" />
                            {submitText}
                        </button>
                        <button
                            type="button"
                            onClick={clearForm}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

