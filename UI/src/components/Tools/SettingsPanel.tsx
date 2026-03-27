import { motion, AnimatePresence } from 'framer-motion';
import {
    Music,
    Waves,
    Gauge,
    Image,
    FileText,
    Video,
    Volume2,
    Languages,
    ChevronDown,
    Sliders,
    Mic,
    Box,
    Layers,
    Film,
    Combine,
    RotateCw,
    Sun,
    Sparkles,
    LucideProps
} from 'lucide-react';
import { ForwardRefExoticComponent, MouseEventHandler } from 'react';

interface colorMap {
    bg: string
    border: string
    text: string
    icon: string
    ring: string
    focus: string
    hover: string
}

interface themeMapType {
    light: colorMap
    dark: colorMap
}

interface colorSystemType {
    green: themeMapType
    red: themeMapType
    blue: themeMapType
    purple: themeMapType
}

// Color system (same as in MediaTool)
const colorSystem: colorSystemType = {
    green: {
        light: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-700',
            icon: 'text-green-600',
            ring: 'ring-green-500/30',
            focus: 'focus:ring-green-500',
            hover: 'hover:border-green-300'
        },
        dark: {
            bg: 'dark:bg-green-950/30',
            border: 'dark:border-green-800',
            text: 'dark:text-green-400',
            icon: 'dark:text-green-400',
            ring: 'dark:ring-green-400/30',
            focus: 'dark:focus:ring-green-400',
            hover: 'dark:hover:border-green-700'
        }
    },
    red: {
        light: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-700',
            icon: 'text-red-600',
            ring: 'ring-red-500/30',
            focus: 'focus:ring-red-500',
            hover: 'hover:border-red-300'
        },
        dark: {
            bg: 'dark:bg-red-950/30',
            border: 'dark:border-red-800',
            text: 'dark:text-red-400',
            icon: 'dark:text-red-400',
            ring: 'dark:ring-red-400/30',
            focus: 'dark:focus:ring-red-400',
            hover: 'dark:hover:border-red-700'
        }
    },
    blue: {
        light: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            icon: 'text-blue-600',
            ring: 'ring-blue-500/30',
            focus: 'focus:ring-blue-500',
            hover: 'hover:border-blue-300'
        },
        dark: {
            bg: 'dark:bg-blue-950/30',
            border: 'dark:border-blue-800',
            text: 'dark:text-blue-400',
            icon: 'dark:text-blue-400',
            ring: 'dark:ring-blue-400/30',
            focus: 'dark:focus:ring-blue-400',
            hover: 'dark:hover:border-blue-700'
        }
    },
    purple: {
        light: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            icon: 'text-purple-600',
            ring: 'ring-purple-500/30',
            focus: 'focus:ring-purple-500',
            hover: 'hover:border-purple-300'
        },
        dark: {
            bg: 'dark:bg-purple-950/30',
            border: 'dark:border-purple-800',
            text: 'dark:text-purple-400',
            icon: 'dark:text-purple-400',
            ring: 'dark:ring-purple-400/30',
            focus: 'dark:focus:ring-purple-400',
            hover: 'dark:hover:border-purple-700'
        }
    }
};

// Base input class generator
const getInputClass = (color = 'green') => {
    const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;
    return `
    w-full p-3 rounded-xl border
    ${colors.light.border} ${colors.dark.border}
    bg-white dark:bg-cyber-800
    text-gray-900 dark:text-white
    focus:ring-2 ${colors.light.ring} ${colors.dark.ring}
    focus:border-transparent
    outline-none transition-all duration-200
    `;
};

interface RendererSettingsType {
    format: (...args: any[]) => JSX.Element
    bitrate: (...args: any[]) => JSX.Element
    sampleRate: (...args: any[]) => JSX.Element
    imageFormat: (...args: any[]) => JSX.Element
    quality: (...args: any[]) => JSX.Element
    pageSize: (...args: any[]) => JSX.Element
    orientation: (...args: any[]) => JSX.Element
    language: (...args: any[]) => JSX.Element
    preserveFormatting: (...args: any[]) => JSX.Element
    intensity: (...args: any[]) => JSX.Element
    docFormat: (...args: any[]) => JSX.Element
    pageRange: (...args: any[]) => JSX.Element
    mergeOrder: (...args: any[]) => JSX.Element
    compressionLevel: (...args: any[]) => JSX.Element
    videoFormat: (...args: any[]) => JSX.Element
    videoQuality: (...args: any[]) => JSX.Element
    resolution: (...args: any[]) => JSX.Element
    targetSize: (...args: any[]) => JSX.Element
}

// Setting renderers
const settingRenderers: RendererSettingsType = {
    // Audio settings
    format: ({ category, color }: { category: string, color: string }) => (
        <motion.div
            key="format"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Music className="w-4 h-4 mr-2" />
                Target Format
            </label>
            <select name="target_format" className={getInputClass(color)}>
                {category === 'audios' && (
                    <>
                        <option value="mp3">MP3</option>
                        <option value="wav">WAV</option>
                        <option value="flac">FLAC</option>
                        <option value="m4a">M4A</option>
                        <option value="aac">AAC</option>
                    </>
                )}
                {category === 'videos' && (
                    <>
                        <option value="mp4">MP4</option>
                        <option value="avi">AVI</option>
                        <option value="mov">MOV</option>
                        <option value="mkv">MKV</option>
                        <option value="webm">WEBM</option>
                    </>
                )}
                {category === 'images' && (
                    <>
                        <option value="png">PNG</option>
                        <option value="jpg">JPG</option>
                        <option value="webp">WEBP</option>
                        <option value="gif">GIF</option>
                        <option value="bmp">BMP</option>
                    </>
                )}
                {category === 'documents' && (
                    <>
                        <option value="pdf">PDF</option>
                        <option value="docx">DOCX</option>
                        <option value="txt">TXT</option>
                        <option value="rtf">RTF</option>
                        <option value="odt">ODT</option>
                    </>
                )}
            </select>
        </motion.div>
    ),

    bitrate: ({ color }: { color: string }) => (
        <motion.div
            key="bitrate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Gauge className="w-4 h-4 mr-2" />
                Bitrate
            </label>
            <select name="bitrate" className={getInputClass(color)}>
                <option value="128">128 kbps</option>
                <option value="192">192 kbps</option>
                <option value="256">256 kbps</option>
                <option value="320">320 kbps</option>
            </select>
        </motion.div>
    ),

    sampleRate: ({ color }: { color: string }) => (
        <motion.div
            key="sampleRate"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Waves className="w-4 h-4 mr-2" />
                Sample Rate
            </label>
            <select name="sample_rate" className={getInputClass(color)}>
                <option value="44100">44.1 kHz</option>
                <option value="48000">48 kHz</option>
                <option value="96000">96 kHz</option>
            </select>
        </motion.div>
    ),

    // Image settings
    imageFormat: ({ color }: { color: string }) => (
        <motion.div
            key="imageFormat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Image className="w-4 h-4 mr-2" />
                Target Format
            </label>
            <select name="target_format" className={getInputClass(color)}>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WEBP</option>
                <option value="gif">GIF</option>
                <option value="bmp">BMP</option>
            </select>
        </motion.div>
    ),

    quality: ({ color }: { color: string }) => {
        const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;
        return (
            <motion.div
                key="quality"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Quality
                </label>
                <div className="space-y-2">
                    <input
                        type="range"
                        name="quality"
                        min="1"
                        max="100"
                        defaultValue="85"
                        className="w-full accent-current"
                        style={{ color: colors.light.icon }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Low</span>
                        <span>85%</span>
                        <span>High</span>
                    </div>
                </div>
            </motion.div>
        );
    },

    pageSize: ({ color }: { color: string }) => (
        <motion.div
            key="pageSize"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Layers className="w-4 h-4 mr-2" />
                Page Size
            </label>
            <select name="page_size" className={getInputClass(color)}>
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
            </select>
        </motion.div>
    ),

    orientation: ({ color }: { color: string }) => (
        <motion.div
            key="orientation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <RotateCw className="w-4 h-4 mr-2" />
                Orientation
            </label>
            <select name="orientation" className={getInputClass(color)}>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
            </select>
        </motion.div>
    ),

    language: ({ color }: { color: string }) => (
        <motion.div
            key="language"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Languages className="w-4 h-4 mr-2" />
                OCR Language
            </label>
            <select name="language" className={getInputClass(color)}>
                <option value="eng">English</option>
                <option value="fra">French</option>
                <option value="deu">German</option>
                <option value="spa">Spanish</option>
            </select>
        </motion.div>
    ),

    preserveFormatting: ({ color }: { color: string }) => {
        const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;
        return (
            <motion.div
                key="preserveFormatting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2"
            >
                <input
                    type="checkbox"
                    name="preserve_formatting"
                    id="preserve_formatting"
                    className={`
                w-4 h-4 rounded border-gray-300
                ${colors.light.focus} ${colors.dark.focus}
                `}
                />
                <label htmlFor="preserve_formatting" className="text-sm text-gray-700 dark:text-gray-300">
                    Preserve Formatting
                </label>
            </motion.div>
        );
    },

    intensity: ({ color }: { color: string }) => {
        const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;
        return (
            <motion.div
                key="intensity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Sun className="w-4 h-4 mr-2" />
                    Grayscale Intensity
                </label>
                <div className="space-y-2">
                    <input
                        type="range"
                        name="intensity"
                        min="0"
                        max="100"
                        defaultValue="100"
                        className="w-full accent-current"
                        style={{ color: colors.light.icon }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Light</span>
                        <span>100%</span>
                        <span>Dark</span>
                    </div>
                </div>
            </motion.div>
        );
    },

    // Document settings
    docFormat: ({ color }: { color: string }) => (
        <motion.div
            key="docFormat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4 mr-2" />
                Target Format
            </label>
            <select name="target_format" className={getInputClass(color)}>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="txt">TXT</option>
                <option value="rtf">RTF</option>
                <option value="odt">ODT</option>
            </select>
        </motion.div>
    ),

    pageRange: ({ color }: { color: string }) => (
        <motion.div
            key="pageRange"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Layers className="w-4 h-4 mr-2" />
                Page Range
            </label>
            <input
                type="text"
                name="page_range"
                placeholder="e.g., 1-5, 8, 11-13"
                className={getInputClass(color)}
            />
        </motion.div>
    ),

    mergeOrder: ({ color }: { color: string }) => {
        const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;
        return (
            <motion.div
                key="mergeOrder"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Combine className="w-4 h-4 mr-2" />
                    Merge Order
                </label>
                <p className={`text-xs ${colors.light.text} ${colors.dark.text} bg-opacity-10 p-2 rounded-lg`}>
                    Files will be merged in the order they appear above
                </p>
            </motion.div>
        );
    },

    compressionLevel: ({ color }: { color: string }) => (
        <motion.div
            key="compressionLevel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Box className="w-4 h-4 mr-2" />
                Compression Level
            </label>
            <select name="compression_level" className={getInputClass(color)}>
                <option value="low">Low (Better Quality)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Smaller Size)</option>
            </select>
        </motion.div>
    ),

    // Video settings
    videoFormat: ({ color }: { color: string }) => (
        <motion.div
            key="videoFormat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Video className="w-4 h-4 mr-2" />
                Target Format
            </label>
            <select name="target_format" className={getInputClass(color)}>
                <option value="mp4">MP4</option>
                <option value="avi">AVI</option>
                <option value="mov">MOV</option>
                <option value="mkv">MKV</option>
                <option value="webm">WEBM</option>
            </select>
        </motion.div>
    ),

    videoQuality: ({ color }: { color: string }) => (
        <motion.div
            key="videoQuality"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Sparkles className="w-4 h-4 mr-2" />
                Quality
            </label>
            <select name="quality" className={getInputClass(color)}>
                <option value="high">High (1080p)</option>
                <option value="medium">Medium (720p)</option>
                <option value="low">Low (480p)</option>
            </select>
        </motion.div>
    ),

    resolution: ({ color }: { color: string }) => (
        <motion.div
            key="resolution"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Film className="w-4 h-4 mr-2" />
                Resolution
            </label>
            <select name="resolution" className={getInputClass(color)}>
                <option value="1920x1080">1920x1080 (1080p)</option>
                <option value="1280x720">1280x720 (720p)</option>
                <option value="854x480">854x480 (480p)</option>
                <option value="640x360">640x360 (360p)</option>
            </select>
        </motion.div>
    ),

    targetSize: ({ color }: { color: string }) => (
        <motion.div
            key="targetSize"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
        >
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Box className="w-4 h-4 mr-2" />
                Target Size (MB)
            </label>
            <input
                type="number"
                name="target_size"
                min="1"
                max="100"
                defaultValue="50"
                className={getInputClass(color)}
            />
        </motion.div>
    )
};

// Main SettingsPanel component
export const SettingsPanel = ({ settings = [], category, color = 'green' }: { settings: Array<any>, category: string, color: string }) => {
    if (!settings.length) return null;

    const cols = settings.length > 2 ? 'md:grid-cols-3' : settings.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1';

    return (
        <div className={`grid grid-cols-1 ${cols} gap-6`}>
            {settings.map((setting: keyof RendererSettingsType) => {
                const renderer = settingRenderers[setting];
            return renderer ? renderer({category, color}) : null;
            })}
        </div>
    );
};

interface AdancedRenderType {
    resize: (...args: any[]) => JSX.Element
    codec: (...args: any[]) => JSX.Element
    fps: (...args: any[]) => JSX.Element
    ocr: (...args: any[]) => JSX.Element
    metadata: (...args: any[]) => JSX.Element
}

// Advanced option renderers
const advancedRenderers: AdancedRenderType = {
    resize: ({ color }: { color: string }) => {
        const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;
        return (
            <div key="resize" className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Width</label>
                    <input
                        type="number"
                        name="width"
                        placeholder="Auto"
                        className={`w-full p-2 text-sm rounded-lg border ${colors.light.border} ${colors.dark.border} bg-white dark:bg-cyber-800 text-gray-900 dark:text-white focus:ring-2 ${colors.light.ring} ${colors.dark.ring} focus:border-transparent outline-none transition-all`}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Height</label>
                    <input
                        type="number"
                        name="height"
                        placeholder="Auto"
                        className={`w-full p-2 text-sm rounded-lg border ${colors.light.border} ${colors.dark.border} bg-white dark:bg-cyber-800 text-gray-900 dark:text-white focus:ring-2 ${colors.light.ring} ${colors.dark.ring} focus:border-transparent outline-none transition-all`}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Size Limit</label>
                    <input
                        type="text"
                        name="size_limit"
                        placeholder="2MB"
                        className={`w-full p-2 text-sm rounded-lg border ${colors.light.border} ${colors.dark.border} bg-white dark:bg-cyber-800 text-gray-900 dark:text-white focus:ring-2 ${colors.light.ring} ${colors.dark.ring} focus:border-transparent outline-none transition-all`}
                    />
                </div>
            </div>
        );
    },

    codec: ({ color }: { color: string }) => (
        <div key="codec">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video Codec</label>
            <select name="codec" className={getInputClass(color)}>
                <option value="h264">H.264</option>
                <option value="h265">H.265 / HEVC</option>
                <option value="vp9">VP9</option>
                <option value="av1">AV1</option>
            </select>
        </div>
    ),

    fps: ({ color }: { color: string }) => (
        <div key="fps">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frame Rate (FPS)</label>
            <select name="fps" className={getInputClass(color)}>
                <option value="60">60 FPS</option>
                <option value="30">30 FPS</option>
                <option value="24">24 FPS</option>
                <option value="original">Original</option>
            </select>
        </div>
    ),

    ocr: ({ color }: { color: string }) => {
        const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;
        return (
            <div key="ocr" className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name="enable_ocr"
                    id="enable_ocr"
                    className={`
                w-4 h-4 rounded border-gray-300
                ${colors.light.focus} ${colors.dark.focus}
                `}
                />
                <label htmlFor="enable_ocr" className="text-sm text-gray-700 dark:text-gray-300">
                    Enable OCR for scanned documents
                </label>
            </div>
        );
    },

    metadata: ({ color }: { color: string }) => {
        const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;
        return (
            <div key="metadata" className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    name="preserve_metadata"
                    id="preserve_metadata"
                    className={`
                w-4 h-4 rounded border-gray-300
                ${colors.light.focus} ${colors.dark.focus}
                `}
                />
                <label htmlFor="preserve_metadata" className="text-sm text-gray-700 dark:text-gray-300">
                    Preserve document metadata
                </label>
            </div>
        );
    }
};

// AdvancedOptions component
export const AdvancedOptions = ({ advanced = [], category, isOpen, onToggle, color = 'green' }: { advanced: Array<any>, isOpen: boolean, onToggle: MouseEventHandler, category: string, color: string }) => {
    const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;

    if (!advanced.length) return null;

    return (
        <div className={`rounded-xl border ${colors.light.border} ${colors.dark.border} overflow-hidden`}>
            <button
                type="button"
                onClick={onToggle}
                className={`
            w-full px-4 py-3 flex items-center justify-between
            ${colors.light.bg} ${colors.dark.bg}
            hover:bg-opacity-80 transition-colors
            `}
            >
                <span className={`flex items-center text-sm font-medium ${colors.light.text} ${colors.dark.text}`}>
                    <Sliders className="w-4 h-4 mr-2" />
                    {category === 'images' ? 'Resize Options' : 'Advanced Options'}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${colors.light.icon} ${colors.dark.icon}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-white dark:bg-cyber-800/50 border-t border-gray-200 dark:border-cyber-700"
                    >
                        <div className="space-y-4">
                            {advanced.map((option: keyof AdancedRenderType) => {
                                const renderer = advancedRenderers[option];
                                return renderer ? renderer({ color }) : null;
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// AudioEffects component
export const AudioEffects = ({ effects = [], isOpen, onToggle, color = 'green' }: { effects: Array<any>, isOpen: boolean, onToggle: MouseEventHandler, color: string }) => {
    const colors = colorSystem[color as keyof colorSystemType] || colorSystem.green;

    if (!effects.length) return null;

    interface effectLabelType {
        noiseReduce: string
        normalize: string
        compressor: string
        equalizer: string
    }

    const effectLabels: effectLabelType = {
        noiseReduce: 'Noise Reduce',
        normalize: 'Normalize',
        compressor: 'Compressor',
        equalizer: 'Equalizer'
    };

    interface effectIconType {
        noiseReduce: ForwardRefExoticComponent<Omit<LucideProps, "ref">>
        normalize: ForwardRefExoticComponent<Omit<LucideProps, "ref">>
        compressor: ForwardRefExoticComponent<Omit<LucideProps, "ref">>
        equalizer: ForwardRefExoticComponent<Omit<LucideProps, "ref">>
    }

    const effectIcons: effectIconType = {
        noiseReduce: Mic,
        normalize: Waves,
        compressor: Gauge,
        equalizer: Mic, //Equalizer
    };

    return (
        <div className={`rounded-xl border ${colors.light.border} ${colors.dark.border} overflow-hidden`}>
            <button
                type="button"
                onClick={onToggle}
                className={`
            w-full px-4 py-3 flex items-center justify-between
            ${colors.light.bg} ${colors.dark.bg}
            hover:bg-opacity-80 transition-colors
            `}
            >
                <span className={`flex items-center text-sm font-medium ${colors.light.text} ${colors.dark.text}`}>
                    <Volume2 className="w-4 h-4 mr-2" />
                    Audio Effects
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${colors.light.icon} ${colors.dark.icon}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 bg-white dark:bg-cyber-800/50 border-t border-gray-200 dark:border-cyber-700"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {effects.map((effect: keyof effectIconType) => {
                                const Icon = effectIcons[effect];
                                return (
                                    <label key={effect} className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name={`effect_${effect}`}
                                            className={`
                            w-4 h-4 rounded border-gray-300
                            ${colors.light.focus} ${colors.dark.focus}
                            `}
                                        />
                                        {Icon && <Icon className={`w-3 h-3 ${colors.light.icon} ${colors.dark.icon} opacity-50 group-hover:opacity-100 transition-opacity`} />}
                                        <span className={`text-xs ${colors.light.text} ${colors.dark.text} group-hover:opacity-100 transition-opacity`}>
                                            {effectLabels[effect]}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
