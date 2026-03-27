import {
    FileImage,
    FileVideo,
    FileAudio,
    FileDigit,
    File,
} from "lucide-react"

// File Icon Helper
export const FileIcon = ({ file, className }: {file: typeof File, className: string}): JSX.Element => {
    const ext: string = file.name.split('.').pop()?.toLowerCase() || '';

    if (['mp3', 'wav', 'flac', 'm4a', 'aac'].includes(ext)) {
        return <FileAudio className={className} />;
    }
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext)) {
        return <FileVideo className={className} />;
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) {
        return <FileImage className={className} />;
    }
    if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext)) {
        return <FileDigit className={className} />;
    }
    return <File className={className} />;
};
