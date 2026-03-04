import React from 'react';

// Setting renderers by type
const settingRenderers = {
    // Audio settings
    format: ({ category }) => (
        <div key="format">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Format
            </label>
            <select
                name="target_format"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
                {category === 'audio' ? (
                    <>
                        <option value="mp3">MP3</option>
                        <option value="wav">WAV</option>
                        <option value="flac">FLAC</option>
                        <option value="m4a">M4A</option>
                        <option value="aac">AAC</option>
                    </>
                ) : category === 'video' ? (
                    <>
                        <option value="mp4">MP4</option>
                        <option value="avi">AVI</option>
                        <option value="mov">MOV</option>
                        <option value="mkv">MKV</option>
                        <option value="webm">WEBM</option>
                    </>
                ) : null}
            </select>
        </div>
    ),

    bitrate: () => (
        <div key="bitrate">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bitrate</label>
            <select name="bitrate" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="128">128 kbps</option>
                <option value="192">192 kbps</option>
                <option value="256">256 kbps</option>
                <option value="320">320 kbps</option>
            </select>
        </div>
    ),

    sampleRate: () => (
        <div key="sampleRate">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sample Rate</label>
            <select name="sample_rate" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="44100">44.1 kHz</option>
                <option value="48000">48 kHz</option>
                <option value="96000">96 kHz</option>
            </select>
        </div>
    ),

    // Image settings
    imageFormat: () => (
        <div key="imageFormat">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Format</label>
            <select name="target_format" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
                <option value="webp">WEBP</option>
                <option value="gif">GIF</option>
                <option value="bmp">BMP</option>
            </select>
        </div>
    ),

    quality: () => (
        <div key="quality">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quality</label>
            <input type="range" name="quality" min="1" max="100" defaultValue="85" className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>85%</span>
                <span>High</span>
            </div>
        </div>
    ),

    pageSize: () => (
        <div key="pageSize">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Size</label>
            <select name="page_size" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
            </select>
        </div>
    ),

    orientation: () => (
        <div key="orientation">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Orientation</label>
            <select name="orientation" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
            </select>
        </div>
    ),

    language: () => (
        <div key="language">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">OCR Language</label>
            <select name="language" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="eng">English</option>
                <option value="fra">French</option>
                <option value="deu">German</option>
                <option value="spa">Spanish</option>
            </select>
        </div>
    ),

    preserveFormatting: () => (
        <div key="preserveFormatting" className="flex items-center">
            <input type="checkbox" name="preserve_formatting" id="preserve_formatting" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
            <label htmlFor="preserve_formatting" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Preserve Formatting</label>
        </div>
    ),

    intensity: () => (
        <div key="intensity">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grayscale Intensity</label>
            <input type="range" name="intensity" min="0" max="100" defaultValue="100" className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
                <span>Light</span>
                <span>100%</span>
                <span>Dark</span>
            </div>
        </div>
    ),

    // Document settings
    docFormat: () => (
        <div key="docFormat">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Format</label>
            <select name="target_format" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="txt">TXT</option>
                <option value="rtf">RTF</option>
                <option value="odt">ODT</option>
            </select>
        </div>
    ),

    pageRange: () => (
        <div key="pageRange">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Range</label>
            <input type="text" name="page_range" placeholder="e.g., 1-5, 8, 11-13" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>
    ),

    mergeOrder: () => (
        <div key="mergeOrder">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Merge Order</label>
            <p className="text-xs text-gray-500 dark:text-gray-400">Files will be merged in the order they appear above</p>
        </div>
    ),

    compressionLevel: () => (
        <div key="compressionLevel">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Compression Level</label>
            <select name="compression_level" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="low">Low (Better Quality)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Smaller Size)</option>
            </select>
        </div>
    ),

    // Video settings
    videoFormat: () => (
        <div key="videoFormat">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Format</label>
            <select name="target_format" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="mp4">MP4</option>
                <option value="avi">AVI</option>
                <option value="mov">MOV</option>
                <option value="mkv">MKV</option>
                <option value="webm">WEBM</option>
            </select>
        </div>
    ),

    videoQuality: () => (
        <div key="videoQuality">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quality</label>
            <select name="quality" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="high">High (1080p)</option>
                <option value="medium">Medium (720p)</option>
                <option value="low">Low (480p)</option>
            </select>
        </div>
    ),

    resolution: () => (
        <div key="resolution">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resolution</label>
            <select name="resolution" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="1920x1080">1920x1080 (1080p)</option>
                <option value="1280x720">1280x720 (720p)</option>
                <option value="854x480">854x480 (480p)</option>
                <option value="640x360">640x360 (360p)</option>
            </select>
        </div>
    ),

    targetSize: () => (
        <div key="targetSize">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Size (MB)</label>
            <input type="number" name="target_size" min="1" max="100" defaultValue="50" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>
    )
};

// Advanced option renderers
const advancedRenderers = {
    resize: () => (
        <div key="resize" className="grid grid-cols-3 gap-4">
            <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Width</label>
                <input type="number" name="width" placeholder="Auto" className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Height</label>
                <input type="number" name="height" placeholder="Auto" className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Size Limit</label>
                <input type="text" name="size_limit" placeholder="2MB" className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
        </div>
    ),

    codec: () => (
        <div key="codec">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video Codec</label>
            <select name="codec" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="h264">H.264</option>
                <option value="h265">H.265 / HEVC</option>
                <option value="vp9">VP9</option>
                <option value="av1">AV1</option>
            </select>
        </div>
    ),

    fps: () => (
        <div key="fps">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frame Rate (FPS)</label>
            <select name="fps" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="60">60 FPS</option>
                <option value="30">30 FPS</option>
                <option value="24">24 FPS</option>
                <option value="original">Original</option>
            </select>
        </div>
    ),

    ocr: () => (
        <div key="ocr" className="flex items-center">
            <input type="checkbox" name="enable_ocr" id="enable_ocr" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="enable_ocr" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable OCR for scanned documents</label>
        </div>
    ),

    metadata: () => (
        <div key="metadata" className="flex items-center">
            <input type="checkbox" name="preserve_metadata" id="preserve_metadata" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="preserve_metadata" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Preserve document metadata</label>
        </div>
    )
};

// Main SettingsPanel component
export const SettingsPanel = ({ settings = [], category }) => {
    if (!settings.length) return null;

    const cols = settings.length > 2 ? 'md:grid-cols-3' : settings.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1';

    return (
        <div className={`grid grid-cols-1 ${cols} gap-6`}>
            {settings.map(setting => {
                const renderer = settingRenderers[setting];
                return renderer ? renderer({ category }) : null;
            })}
        </div>
    );
};

// AdvancedOptions component
export const AdvancedOptions = ({ advanced = [], category, isOpen, onToggle }) => {
    if (!advanced.length) return null;

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <button
                type="button"
                className="flex items-center justify-between w-full cursor-pointer"
                onClick={onToggle}
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Advanced Options
                </span>
                <ChevronIcon rotated={isOpen} />
            </button>
            {isOpen && (
                <div className="mt-3 space-y-4">
                    {advanced.map(option => {
                        const renderer = advancedRenderers[option];
                        return renderer ? renderer() : null;
                    })}
                </div>
            )}
        </div>
    );
};

// AudioEffects component
export const AudioEffects = ({ effects = [], isOpen, onToggle, color = 'green' }) => {
    if (!effects.length) return null;

    const effectLabels = {
        noiseReduce: 'Noise Reduce',
        normalize: 'Normalize',
        compressor: 'Compressor',
        equalizer: 'Equalizer'
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <button
                type="button"
                className="flex items-center justify-between w-full cursor-pointer"
                onClick={onToggle}
            >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Audio Effects
                </span>
                <ChevronIcon rotated={isOpen} />
            </button>
            {isOpen && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {effects.map((effect) => (
                        <label key={effect} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name={`effect_${effect}`}
                                className={`rounded border-gray-300 text-${color}-600 focus:ring-${color}-500`}
                            />
                            <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                                {effectLabels[effect]}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

// ChevronIcon component
const ChevronIcon = ({ rotated }) => (
    <svg
        className={`w-5 h-5 transform transition-transform ${rotated ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
