import {
    FileText,
    Music,
    Video,
    Image as ImageIcon,
    FileImage,
    FileVideo,
    FileAudio,
    FileDigit,
} from 'lucide-react';

// Color system based on your palette
export const colorSystem = {
    green: {
        light: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-700',
            icon: 'text-green-600',
            badge: 'bg-green-100 text-green-700',
            button: 'bg-green-600 hover:bg-green-700',
            ring: 'ring-green-500/30',
            gradient: 'from-green-500 to-green-600',
            shadow: 'shadow-green-500/20',
            hover: 'hover:border-green-300',
            focus: 'focus:ring-green-500'
        },
        dark: {
            bg: 'dark:bg-green-950/30',
            border: 'dark:border-green-800',
            text: 'dark:text-green-400',
            icon: 'dark:text-green-400',
            badge: 'dark:bg-green-900/50 dark:text-green-300',
            button: 'dark:bg-green-600 dark:hover:bg-green-500',
            ring: 'dark:ring-green-400/30',
            gradient: 'dark:from-green-500 dark:to-green-400',
            hover: 'dark:hover:border-green-700',
            focus: 'dark:focus:ring-green-400'
        }
    },
    red: {
        light: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-700',
            icon: 'text-red-600',
            badge: 'bg-red-100 text-red-700',
            button: 'bg-red-600 hover:bg-red-700',
            ring: 'ring-red-500/30',
            gradient: 'from-red-500 to-red-600',
            shadow: 'shadow-red-500/20',
            hover: 'hover:border-red-300',
            focus: 'focus:ring-red-500'
        },
        dark: {
            bg: 'dark:bg-red-950/30',
            border: 'dark:border-red-800',
            text: 'dark:text-red-400',
            icon: 'dark:text-red-400',
            badge: 'dark:bg-red-900/50 dark:text-red-300',
            button: 'dark:bg-red-600 dark:hover:bg-red-500',
            ring: 'dark:ring-red-400/30',
            gradient: 'dark:from-red-500 dark:to-red-400',
            hover: 'dark:hover:border-red-700',
            focus: 'dark:focus:ring-red-400'
        }
    },
    blue: {
        light: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            icon: 'text-blue-600',
            badge: 'bg-blue-100 text-blue-700',
            button: 'bg-blue-600 hover:bg-blue-700',
            ring: 'ring-blue-500/30',
            gradient: 'from-blue-500 to-blue-600',
            shadow: 'shadow-blue-500/20',
            hover: 'hover:border-blue-300',
            focus: 'focus:ring-blue-500'
        },
        dark: {
            bg: 'dark:bg-blue-950/30',
            border: 'dark:border-blue-800',
            text: 'dark:text-blue-400',
            icon: 'dark:text-blue-400',
            badge: 'dark:bg-blue-900/50 dark:text-blue-300',
            button: 'dark:bg-blue-600 dark:hover:bg-blue-500',
            ring: 'dark:ring-blue-400/30',
            gradient: 'dark:from-blue-500 dark:to-blue-400',
            hover: 'dark:hover:border-blue-700',
            focus: 'dark:focus:ring-blue-400'
        }
    },
    purple: {
        light: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            icon: 'text-purple-600',
            badge: 'bg-purple-100 text-purple-700',
            button: 'bg-purple-600 hover:bg-purple-700',
            ring: 'ring-purple-500/30',
            gradient: 'from-purple-500 to-purple-600',
            shadow: 'shadow-purple-500/20',
            hover: 'hover:border-purple-300',
            focus: 'focus:ring-purple-500'
        },
        dark: {
            bg: 'dark:bg-purple-950/30',
            border: 'dark:border-purple-800',
            text: 'dark:text-purple-400',
            icon: 'dark:text-purple-400',
            badge: 'dark:bg-purple-900/50 dark:text-purple-300',
            button: 'dark:bg-purple-600 dark:hover:bg-purple-500',
            ring: 'dark:ring-purple-400/30',
            gradient: 'dark:from-purple-500 dark:to-purple-400',
            hover: 'dark:hover:border-purple-700',
            focus: 'dark:focus:ring-purple-400'
        }
    }
};


// Animation variants
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

export const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

// File type icon mapping
export const fileTypeIcons = {
    default: File,
        audio: FileAudio,
        image: FileImage,
        video: FileVideo,
        document: FileDigit
};

// Category icon mapping
export const categoryIcons = {
    audios: Music,
    images: ImageIcon,
    documents: FileText,
    videos: Video
};

