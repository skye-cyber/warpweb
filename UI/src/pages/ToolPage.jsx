import React from 'react';
import { useSelector } from 'react-redux';
import { MediaTool } from '../components/tools/MediaTool';
import { TOOL_METADATA } from '../config/tools';

export const ToolPage = () => {
    const { activeTool, ui } = useSelector((state) => state.warp);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Tool metadata display */}
            {activeTool && (
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Category:</span> {activeTool.category} |
                    <span className="font-medium ml-2">Tool:</span> {activeTool.name} |
                    <span className="font-medium ml-2">{activeTool.description}</span>
                </div>
            )}

            {/* Dynamic MediaTool that renders based on activeTool */}
            <MediaTool />
        </div>
    );
};
