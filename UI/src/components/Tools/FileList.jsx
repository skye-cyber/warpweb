import { colorSystem } from "./utils/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { FileIcon } from "./FileIconHelper";

// File List Component
export const FileList = ({ files, onRemove, color }) => {
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
