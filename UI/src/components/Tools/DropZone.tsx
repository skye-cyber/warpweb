import { colorSystem, colorSystemType } from "./utils/utils";
import {
    Cloud,
    Trash2,
    Check,
} from "lucide-react"
import { motion } from 'framer-motion';
import { FileList } from "./FileList";
import { ChangeEventHandler, DragEvent, useRef } from "react";

// DropZone Component
export const DropZone = ({
    isDragging,
    files,
    onDrop,
    onFileChange,
    onClear,
    dropzoneText,
    dropzoneSubtext,
    color,
    accepts
}:
    {
        isDragging: boolean,
        files: Array<any>,
        onDrop: CallableFunction,
        onFileChange: ChangeEventHandler | CallableFunction,
        onClear: CallableFunction,
        dropzoneText: string,
        dropzoneSubtext: string,
        color: keyof colorSystemType,
        accepts: string

    }) => {
    const fileInputRef = useRef(null);
    const colors = colorSystem[color] || colorSystem.green;

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        onDrop?.(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        onDrop?.(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        onDrop?.(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        const onFileChangCallback: CallableFunction = onFileChange
        onFileChangCallback?.({ target: { files: droppedFiles } });
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
                onChange={onFileChange as ChangeEventHandler}
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
                                onClear?.(-1);
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
