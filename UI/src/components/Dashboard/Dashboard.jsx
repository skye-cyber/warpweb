import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { motion } from "motion/react";
import {
    FileText,
    Music,
    Video,
    Image,
    ArrowRight,
    Clock,
    TrendingUp,
    Zap,
    Layers,
    Download,
    Share2,
    MoreHorizontal,
    Activity,
    FolderOpen,
    FileUp,
    Scissors,
    Combine,
    FileImage,
    Mic,
    Film,
    FileSignature
} from '@mui/icons-material';
import { countCategoryTools } from '../../config/ToolSchema';
import { setActiveTab, setActiveTool } from "../../store/warpSlice";
import { Footer } from "../Footer/Footer";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
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

const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    hover: {
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 }
    }
};

// Category configurations
const CATEGORIES = [
    {
        id: 'document',
        name: 'Document Tools',
        path: '/documents',
        color: 'blue',
        gradient: 'from-blue-500 to-blue-600',
        lightBg: 'bg-blue-50',
        icon: FileText,
        tools: [
            { id: 'convert_doc', name: 'Document Conversion', icon: FileUp, description: 'Convert between formats' },
            { id: 'pdf_join', name: 'PDF Joining', icon: Combine, description: 'Merge multiple PDFs' },
            { id: 'scan_pdf', name: 'Text Extraction', icon: FileSignature, description: 'Extract text from PDFs' }
        ]
    },
    {
        id: 'audio',
        name: 'Audio Tools',
        path: '/audios',
        color: 'green',
        gradient: 'from-green-500 to-green-600',
        lightBg: 'bg-green-50',
        icon: Music,
        tools: [
            { id: 'convert_audio', name: 'Audio Conversion', icon: FileUp, description: 'Convert audio formats' },
            { id: 'audio_join', name: 'Audio Join', icon: Combine, description: 'Merge audio files' },
            { id: 'extract_audio', name: 'Audio Extract', icon: Scissors, description: 'Extract from video' }
        ]
    },
    {
        id: 'video',
        name: 'Video Tools',
        path: '/videos',
        color: 'purple',
        gradient: 'from-purple-500 to-purple-600',
        lightBg: 'bg-purple-50',
        icon: Video,
        tools: [
            { id: 'convert_video', name: 'Video Conversion', icon: FileUp, description: 'Convert video formats' },
            { id: 'compress_video', name: 'Video Compress', icon: Download, description: 'Reduce file size' },
            { id: 'extract_audio', name: 'Audio Extract', icon: Mic, description: 'Extract audio track' }
        ]
    },
    {
        id: 'image',
        name: 'Image Tools',
        path: '/images',
        color: 'red',
        gradient: 'from-red-500 to-red-600',
        lightBg: 'bg-red-50',
        icon: Image,
        tools: [
            { id: 'convert_image', name: 'Image Conversion', icon: FileUp, description: 'Convert image formats' },
            { id: 'image2pdf', name: 'Image to PDF', icon: FileImage, description: 'Create PDF from images' },
            { id: 'ocr', name: 'OCR', icon: FileSignature, description: 'Extract text from images' }
        ]
    }
];

// Stat card configuration
const STATS = [
    { category: 'documents', icon: FileText, color: 'blue', label: 'Document Tools' },
    { category: 'audios', icon: Music, color: 'green', label: 'Audio Tools' },
    { category: 'videos', icon: Video, color: 'purple', label: 'Video Tools' },
    { category: 'images', icon: Image, color: 'red', label: 'Image Tools' }
];

export const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNavigate = (path, tool_id) => {
        try {
            const norm_path = path.replace('/', '');
            dispatch(setActiveTab(norm_path));
            dispatch(setActiveTool({
                id: tool_id,
                category: norm_path,
                name: tool_id,
                description: ''
            }));
            navigate(path);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

                {/* Welcome Header */}
                <motion.div
                    variants={itemVariants}
                    className="mb-10 text-center sm:text-left"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Welcome Back
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto sm:mx-0">
                        Transform your files with powerful, intuitive tools. Choose a category below to get started.
                    </p>
                </motion.div>

                {/* Quick Stats with Glassmorphism */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
                >
                    {STATS.map((stat, index) => (
                        <motion.div
                            key={stat.category}
                            variants={cardVariants}
                            whileHover="hover"
                            className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                            {/* Gradient overlay on hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/0 to-${stat.color}-500/0 group-hover:from-${stat.color}-500/10 group-hover:to-${stat.color}-500/5 transition-all duration-500`} />

                            <div className="relative p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {stat.label}
                                        </p>
                                        <motion.p
                                            key={countCategoryTools(stat.category)}
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="text-3xl font-bold text-gray-900 dark:text-white"
                                        >
                                            {countCategoryTools(stat.category)}
                                        </motion.p>
                                    </div>
                                </div>

                                {/* Decorative element */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Featured Tools Grid */}
                <motion.div
                    variants={itemVariants}
                    className="space-y-8 mb-12"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-500" />
                            Featured Tools
                        </h2>
                        <motion.button
                            whileHover={{ x: 5 }}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {CATEGORIES.map((category) => (
                            <motion.div
                                key={category.id}
                                variants={cardVariants}
                                whileHover="hover"
                                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Gradient header */}
                                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${category.gradient}`} />

                                <div className="p-6">
                                    {/* Category header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-3 rounded-xl bg-${category.color}-100 dark:bg-${category.color}-900/30`}>
                                                <category.icon className={`w-6 h-6 text-${category.color}-600 dark:text-${category.color}-400`} />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {category.name}
                                            </h3>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${category.color}-100 dark:bg-${category.color}-900/30 text-${category.color}-600 dark:text-${category.color}-400`}>
                                            {category.tools.length} tools
                                        </span>
                                    </div>

                                    {/* Tools grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {category.tools.map((tool) => (
                                            <motion.button
                                                key={tool.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleNavigate(category.path, tool.id)}
                                                className="group/btn relative overflow-hidden p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-all duration-300 text-left"
                                            >
                                                <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover/btn:opacity-5 transition-opacity duration-300`} />

                                                <tool.icon className={`w-5 h-5 mb-2 text-${category.color}-500`} />
                                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                    {tool.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {tool.description}
                                                </p>

                                                <ArrowRight className={`absolute bottom-3 right-3 w-4 h-4 text-${category.color}-500 opacity-0 group-hover/btn:opacity-100 transform translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300`} />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity with modern design */}
                <motion.div
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 p-8 mb-8"
                >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl" />
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Recent Activity
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                            >
                                View History
                            </motion.button>
                        </div>

                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                                className="mb-4"
                            >
                                <Clock className="w-16 h-16 text-white/30" />
                            </motion.div>
                            <p className="text-lg text-white/70 mb-2">No recent activity</p>
                            <p className="text-sm text-white/50 max-w-md">
                                Your recent file conversions and edits will appear here. Start using the tools to see your activity!
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleNavigate('/documents', 'convert_doc')}
                                className="mt-6 px-6 py-3 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                <FileUp className="w-5 h-5" />
                                Start Converting
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions Bar */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap gap-3 justify-center sm:justify-start"
                >
                    {[
                        { icon: Download, label: 'Downloads', color: 'blue' },
                        { icon: Share2, label: 'Share', color: 'green' },
                        { icon: Layers, label: 'Batch Process', color: 'purple' },
                        { icon: MoreHorizontal, label: 'More', color: 'gray' }
                    ].map((action) => (
                        <motion.button
                            key={action.label}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-xl bg-${action.color}-50 dark:bg-${action.color}-900/20 text-${action.color}-600 dark:text-${action.color}-400 hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/30 transition-colors flex items-center gap-2 text-sm font-medium`}
                        >
                            <action.icon className="w-4 h-4" />
                            {action.label}
                        </motion.button>
                    ))}
                </motion.div>
            </div>
            <Footer />
        </motion.section>
    );
};
