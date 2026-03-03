import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { getFirstToolByCategory } from '../Tools/schema';
import { setActiveTab, setActiveTool } from "../../store/warpSlice";

export const Footer = ({ }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleNavigate = (path) => {
        try {
            const norm_path = path.replace('/', '')
            dispatch(setActiveTab(norm_path))
            dispatch(setActiveTool(getFirstToolByCategory(norm_path)))
            navigate(path)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <footer className="bg-white dark:bg-cyber-950 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto py-6 px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">FileWarp</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Comprehensive file management suite with conversion, analysis, and processing tools.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tools</h3>
                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => handleNavigate("/documents")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Document Converter</button>
                            <button onClick={() => handleNavigate("/audios")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Audio Effects</button>
                            <button onClick={() => handleNavigate("/videos")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Video Analysis</button>
                            <button onClick={() => handleNavigate("/images")} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Image Processing</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Support</h3>
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-600 dark:text-gray-400">Help & Documentation</p>
                            <p className="text-gray-600 dark:text-gray-400">Contact Support</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 mt-6 pt-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        &copy; 2026 Warp. All rights reserved. Version 0.1.0
                    </p>
                </div>
            </div>
        </footer>
    )
}
