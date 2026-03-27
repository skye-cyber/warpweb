import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { TOOLS as alltools, getToolsByCategory, InterfaceComponentMap } from "../../config/ToolSchema";
import { setActiveTab, setActiveTool } from "../../store/warpSlice";
import { toTitleCase } from "../../utils/extendJS";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MargicTool } from "../svg/core";
// import { DocumentTool } from "../Tools/DocumentTools/DocumentTool";
import { motion, AnimatePresence } from "framer-motion";

export const Converter = ({ }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { activeTool, ui } = useSelector((state) => state.warp);
    const [Tools, setTools] = React.useState(null)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const availableToolRef = React.useRef()
    const InterfaceComponent = React.useRef(null)

    React.useEffect(() => {
        if (ui.activeTab === 'dashboard') return navigate('/dashboard');

        const component = InterfaceComponentMap[ui.activeTab]
        if (component) InterfaceComponent.current = component

        const tools = getToolsByCategory(ui.activeTab);
        setTools(tools);
    }, [ui.activeTab, navigate]);

    const ToolSwitch = React.useCallback((tool) => {
        dispatch(setActiveTab(tool.category))
        dispatch(setActiveTool(tool))
        setIsMobileMenuOpen(false)
    })

    const ToolButton = ({ tool, index }) => {
        const isActive = activeTool?.id === tool.id;

        return (
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => ToolSwitch(tool)}
                className={`
                relative w-full text-left p-4 rounded-xl transition-all duration-300
                ${isActive
                        ? 'bg-gradient-to-r from-primary-500/10 to-primary-600/5 dark:from-primary-500/20 dark:to-primary-600/10 border-l-4 border-primary-500 shadow-lg'
                        : 'hover:bg-gray-50 dark:hover:bg-cyber-800/50 border-l-4 border-transparent hover:border-primary-500/30'
                    }
                `}
            >
                {/* Active indicator dot */}
                {isActive && (
                    <motion.div
                        layoutId="activeTool"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`
                    p-2 rounded-lg transition-all duration-300
                    ${isActive
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 dark:bg-cyber-800 text-gray-600 dark:text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30'
                            }
                    `}>
                            {/* Tool icon placeholder - you can add specific icons per tool */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {toTitleCase(tool.name)}
                        </span>
                    </div>
                    <ChevronRight className={`
                        w-5 h-5 transition-all duration-300
                        ${isActive
                            ? 'fill-primary-500 translate-x-1' :
                            'fill-gray-400 group-hover:translate-x-1'
                        }
                        `} />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 pl-11">
                    {tool.description}
                </p>

                {/* Hover gradient effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 to-primary-500/0 hover:from-primary-500/5 hover:to-transparent pointer-events-none transition-all duration-500" />
            </motion.button>
        );
    };

    return (
        <div className="h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-cyber-950 dark:to-secondary-950 overflow-hidden">
            {/* Mobile Menu Toggle */}
            <div className="sm:hidden fixed top-4 left-4 z-20">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-3 bg-white dark:bg-cyber-800 rounded-xl shadow-lg border border-gray-200 dark:border-cyber-700"
                >
                    <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </motion.button>
            </div>

            <div className="relative flex h-full">
                {/* Tools Navigation - Desktop */}
                <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`
            hidden sm:block w-80 bg-white/80 dark:bg-cyber-900/90 backdrop-blur-xl
            border-r border-gray-200 dark:border-cyber-800 shadow-2xl
            h-full overflow-hidden
            `}
                >
                    <div className="h-full flex flex-col">
                        {/* Header */}
                        <div className="sticky top-0 bg-inherit p-6 border-b border-gray-200 dark:border-cyber-800">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                Tools
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Select a tool to get started
                            </p>
                        </div>

                        {/* Tools List */}
                        <div className="flex-1 overflow-y-auto scrollbar-custom p-4 space-y-2">
                            <AnimatePresence mode="wait">
                                {Tools && Object.keys(alltools).map((toolkey, index) => {
                                    const tool = Tools[toolkey];
                                    return tool && <ToolButton key={toolkey} tool={tool} index={index} />;
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Footer Stats */}
                        <div className="sticky bottom-0 p-4 bg-gradient-to-t from-white/80 dark:from-cyber-900/80 via-white/80 dark:via-cyber-900/80 to-transparent backdrop-blur-sm border-t border-gray-200 dark:border-cyber-800">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">
                                    {Tools && Object.keys(Tools).length} tools available
                                </span>
                                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium">
                                    {ui.activeTab}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Mobile Tools Navigation */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 sm:hidden"
                            />
                            <motion.div
                                initial={{ x: -300 }}
                                animate={{ x: 0 }}
                                exit={{ x: -300 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-cyber-900 shadow-2xl z-40 sm:hidden overflow-hidden"
                            >
                                <div className="h-full flex flex-col">
                                    <div className="p-6 border-b border-gray-200 dark:border-cyber-800 flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Tools
                                        </h2>
                                        <button
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-cyber-800 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                        {Tools && Object.keys(alltools).map((toolkey, index) => {
                                            const tool = Tools[toolkey];
                                            return tool && <ToolButton key={toolkey} tool={tool} index={index} />;
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Tool Interface */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 h-full overflow-auto p-4 sm:p-6"
                >
                    <div className="min-h-full bg-white/90 dark:bg-cyber-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-cyber-800 overflow-hidden">
                        <div className="h-full p-6">
                            {activeTool && InterfaceComponent.current && activeTool.category !== 'dashboard' ? (
                                <motion.div
                                    key={activeTool.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <InterfaceComponent.current tool={activeTool} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center p-8"
                                >
                                    <div className="relative">
                                        {/* Animated background circles */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-full blur-3xl animate-pulse" />

                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{
                                                duration: 5,
                                                repeat: Infinity,
                                                repeatType: "reverse"
                                            }}
                                            className="relative mb-6"
                                        >
                                            <MargicTool className="w-24 h-24 text-primary-500 dark:text-primary-400" />
                                        </motion.div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                        Select a Tool
                                    </h3>

                                    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                                        Choose a tool from the sidebar to start converting, editing,
                                        and processing your files with powerful features.
                                    </p>

                                    {/* Quick tips */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                        {[
                                            { icon: '🚀', text: 'Fast Processing' },
                                            { icon: '🎨', text: 'High Quality' },
                                            { icon: '🔒', text: 'Secure' }
                                        ].map((tip, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * i }}
                                                className="p-4 bg-gray-50 dark:bg-cyber-800/50 rounded-xl border border-gray-200 dark:border-cyber-700"
                                            >
                                                <div className="text-2xl mb-2">{tip.icon}</div>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {tip.text}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
