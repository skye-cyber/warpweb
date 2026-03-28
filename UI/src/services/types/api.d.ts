// ==================== Enums ====================

export enum ConversionType {
    // Document conversions
    CONVERT_DOC = "convert-doc",
    CONVERT_DOC_ALT = "convert_doc",
    DOC_TO_IMAGE = "doc-to-image",
    DOC_TO_IMAGE_ALT = "doc_to_image",
    HTML_TO_WORD = "html2word",
    HTML_TO_WORD_ALT = "html_to_word",
    MARKDOWN_TO_DOCX = "markdown-to-docx",
    MARKDOWN_TO_DOCX_ALT = "markdown_to_docx",

    // Audio conversions
    CONVERT_AUDIO = "convert-audio",
    CONVERT_AUDIO_ALT = "convert_audio",
    EXTRACT_AUDIO = "extract-audio",
    EXTRACT_AUDIO_ALT = "extract_audio",
    JOIN_AUDIO = "join-audio",
    JOIN_AUDIO_ALT = "join_audio",
    AUDIO_EFFECTS = "audio-effects",
    AUDIO_EFFECTS_ALT = "audio_effects",
    RECORD = "record",

    // Video conversions
    CONVERT_VIDEO = "convert-video",
    CONVERT_VIDEO_ALT = "convert_video",
    ANALYZE_VIDEO = "analyze-video",
    ANALYZE_VIDEO_ALT = "analyze_video",

    // Image conversions
    CONVERT_IMAGE = "convert-image",
    CONVERT_IMAGE_ALT = "convert_image",
    RESIZE_IMAGE = "resize-image",
    RESIZE_IMAGE_ALT = "resize_image",
    IMAGES_TO_PDF = "images-to-pdf",
    IMAGES_TO_PDF_ALT = "images_to_pdf",
    IMAGES_TO_WORD = "images-to-word",
    IMAGES_TO_WORD_ALT = "images_to_word",
    IMAGES_TO_GRAY = "images-to-gray",
    IMAGES_TO_GRAY_ALT = "images_to_gray",

    // PDF operations
    PDF_JOIN = "pdf-join",
    PDF_JOIN_ALT = "pdf_join",
    EXTRACT_PAGES = "extract-pages",
    EXTRACT_PAGES_ALT = "extract_pages",
    EXTRACT_IMAGES = "extract-images",
    EXTRACT_IMAGES_ALT = "extract_images",
    SCAN_PDF = "scan-pdf",
    SCAN_PDF_ALT = "scan_pdf",
    SCAN_AS_IMAGE = "scan-as-image",
    SCAN_AS_IMAGE_ALT = "scan_as_image",
    SCAN_LONG = "scan-long",
    SCAN_LONG_ALT = "scan_long",
    PDF_TO_LONG_IMAGE = "pdf2long-image",
    PDF_TO_LONG_IMAGE_ALT = "pdf_to_long_image",

    // OCR
    OCR = "ocr",

    // Other
    CONVERT_SVG = "convert-svg",
    CONVERT_SVG_ALT = "convert_svg",
    TEXT_TO_WORD = "text2word",
    TEXT_TO_WORD_ALT = "text_to_word",
    VOICE_TYPE = "voice-type",
    VOICE_TYPE_ALT = "voice_type",
}

export enum TaskPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical",
}

export enum TaskStatus {
    PENDING = "pending",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled",
}

export enum TaskType {
    CONVERSION = "conversion",
    EXTRACTION = "extraction",
    ANALYSIS = "analysis",
    JOIN = "join",
    OCR = "ocr",
    RECORDING = "recording",
    SLICE = "slice",
}

export enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
}

export enum ScanMode {
    STANDARD = "standard",
    IMAGE = "image",
    LONG = "long",
}

export enum FormatDirection {
    INPUT = "input",
    OUTPUT = "output",
}

// ==================== Request Types ====================

export interface ConversionRequest {
    /** Conversion operation type */
    operation: ConversionType;

    /** Input file/directory paths */
    input_paths: string[];

    /** Output path (auto-generated if not provided) */
    output_path?: string | null;

    /** Target format for conversion */
    target_format?: string | null;

    /** Number of threads to use */
    threads?: number | null; // default: 3, min: 1, max: 10

    /** Don't resume previous operation */
    no_resume?: boolean | null; // default: false

    /** Operation-specific options */
    options?: Record<string, any>;
}

export interface AudioJoinRequest {
    /** Audio files to join */
    input_paths: string[];

    /** Output path */
    output_path?: string | null;
}

export interface PDFJoinRequest {
    /** PDF files to join */
    pdf_paths: string[];

    /** Output path */
    output_path?: string | null;

    /** Page order pattern */
    order?: string | null; // default: "AAB"
}

export interface PageExtractionRequest {
    /** Path to PDF file */
    pdf_path: string;

    /** Start page */
    start_page?: number | null; // default: 1, min: 0

    /** Stop page (last page) */
    stop_page?: number | null; // default: -1, min: -1

    /** Output path */
    output_path?: string | null;
}

export interface ImageResizeRequest {
    /** Path to image file */
    image_path: string;

    /** Target size (e.g., '2mb', '800x600', '50%') */
    target_size: string;

    /** Output format */
    output_format?: string | null;

    /** Output path */
    output_path?: string | null;
}

export interface OCRRequest {
    /** Images to process */
    image_paths: string[];

    /** OCR language */
    language?: string | null; // default: "eng"

    /** Text separator */
    separator?: string | null; // default: "\n"

    /** Output path */
    output_path?: string | null;
}

export interface TextToWordRequest {
    /** Path to text file */
    text_path: string;

    /** Font size */
    font_size?: number | null; // default: 12, min: 8, max: 72

    /** Font name */
    font_name?: string | null; // default: "Times New Roman"

    /** Output path */
    output_path?: string | null;
}

export interface VideoAnalysisRequest {
    /** Path to video file */
    video_path: string;

    /** Include audio analysis */
    analyze_audio?: boolean | null; // default: false

    /** Extract metadata */
    extract_metadata?: boolean | null; // default: true
}

export interface AudioEffectsRequest {
    /** Audio effects configuration */
    [key: string]: any;
}

export interface OCRRequest {
    image_paths: Array<string>
    language: string,
    separator: "\n" | "\r" | string,
    output_path: string
}

// ==================== Response Types ====================

export interface TaskResponse {
    /** Task ID */
    task_id: string;

    /** Task status */
    status: TaskStatus;

    /** Status message */
    message: string;

    /** Creation timestamp */
    created_at: string;
}

export interface TaskStatusResponse {
    /** Task ID */
    task_id: string;

    /** Task status */
    status: TaskStatus;

    /** Progress percentage (0-100) */
    progress: number;

    /** Status message */
    message: string;

    /** Task logs */
    logs: string[];

    /** Creation timestamp */
    created_at?: string | null;

    /** Start timestamp */
    started_at?: string | null;

    /** Completion timestamp */
    completed_at?: string | null;

    /** Task result data */
    result?: Record<string, any> | null;

    /** Error message if failed */
    error?: string | null;
}

export interface TaskSummary {
    /** Task ID */
    task_id: string;

    /** Task type */
    task_type: TaskType;

    /** Operation name */
    operation: string;

    /** Task status */
    status: string;

    /** Progress percentage */
    progress: number;

    /** Creation timestamp */
    created_at: string;

    /** Completion timestamp */
    completed_at?: string | null;
}

export interface SystemInfoResponse {
    /** System version */
    version: string;

    /** API version */
    api_version: string;

    /** System uptime */
    uptime: string;

    /** Number of active tasks */
    active_tasks: number;

    /** Number of completed tasks */
    completed_tasks: number;

    /** Number of failed tasks */
    failed_tasks: number;

    /** Total number of tasks */
    total_tasks: number;

    /** Detailed system information */
    system_info: Record<string, any>;
}

export interface ValidationResult {
    /** Whether validation passed */
    isValid: boolean;

    /** List of validation errors */
    errors: string[];

    /** List of validation warnings */
    warnings: string[];
}

export interface FormatInfo {
    /** Format key/identifier */
    key: string;

    /** Display name */
    name: string;

    /** File extensions */
    extensions: string[];

    /** MIME types */
    mime_types: string[];

    /** Format category */
    category: string;

    /** Whether it's a common format */
    common?: boolean;

    /** Additional metadata */
    metadata?: Record<string, any>;
}

export interface ConversionValidation {
    /** Whether conversion is supported */
    supported: boolean;

    /** Reason if not supported */
    reason?: string;

    /** Suggested alternative formats */
    suggestions?: string[];
}

// ==================== Validation Error Types ====================

export interface ValidationError {
    /** Location of the error (field path) */
    loc: (string | number)[];

    /** Error message */
    msg: string;

    /** Error type */
    type: string;
}

export interface HTTPValidationError {
    /** List of validation errors */
    detail?: ValidationError[];
}

// ==================== API Response Wrappers ====================

export interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}

// ==================== Query Parameters Types ====================

export interface TaskListParams {
    /** Filter by status */
    status?: TaskStatus[] | null;

    /** Filter by task type */
    task_type?: string | null;

    /** Filter by operation */
    operation?: string | null;

    /** Number of tasks to return */
    limit?: number; // default: 50, min: 1, max: 1000

    /** Pagination offset */
    offset?: number; // default: 0, min: 0
}

export interface SystemLogsParams {
    /** Log level filter */
    level?: LogLevel; // default: INFO

    /** Number of log lines */
    lines?: number; // default: 100, min: 10, max: 1000
}

export interface SystemCleanupParams {
    /** Delete tasks older than X days */
    days?: number; // default: 7, min: 1, max: 30
}

export interface TaskCleanupParams {
    /** Delete tasks older than X days */
    days?: number; // default: 7, min: 1, max: 30

    /** Delete only tasks with these statuses */
    status?: TaskStatus[] | null;
}

export interface TaskLogsParams {
    /** Number of log lines */
    lines?: number; // default: 100, min: 10, max: 1000
}

export interface FormatListParams {
    /** Filter by category */
    category?: string | null;
}

export interface FormatCompatibleParams {
    /** Conversion direction */
    direction?: FormatDirection; // default: "output"
}

export interface ConversionValidateParams {
    /** Input format */
    input_format: string;

    /** Output format */
    output_format: string;
}

export interface FormatCompareParams {
    /** First format to compare */
    format1: string;

    /** Second format to compare */
    format2: string;
}

export interface SuggestOutputFormatParams {
    /** Input format */
    input_format: string;

    /** Preferred output format */
    preferred?: string | null;
}

export interface TaskTimelineParams {
    /** Number of days to include */
    days?: number; // default: 7, min: 1, max: 30
}

// ==================== File Upload Types ====================

export interface FileUploadRequest {
    /** Files to upload */
    files: File[];

    /** OCR language */
    language?: string; // default: "eng"

    /** Text separator */
    separator?: string; // default: "\n"

    /** Task priority */
    priority?: TaskPriority; // default: "medium"
}

export interface UploadExtractResponse {
    /** Extracted text */
    text: string;

    /** Number of files processed */
    files_processed: number;

    /** Per-file results */
    results: Array<{
        filename: string;
        text: string;
        error?: string;
    }>;
}

// ==================== Health & System Types ====================

export interface HealthCheckResponse {
    /** Service status */
    status: "healthy" | "unhealthy";

    /** Timestamp */
    timestamp: string;

    /** Detailed health info */
    details?: Record<string, any>;
}

export interface VersionResponse {
    /** API version */
    version: string;

    /** API version (alternative) */
    api_version?: string;

    /** Build timestamp */
    build_date?: string;

    /** Git commit hash */
    commit?: string;
}

export interface MetricsResponse {
    /** System metrics */
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;

    /** Task metrics */
    active_tasks: number;
    queue_size: number;
    tasks_per_minute: number;

    /** Performance metrics */
    average_task_duration: number;
    success_rate: number;

    /** Additional metrics */
    [key: string]: any;
}

export interface ConfigResponse {
    /** System configuration */
    [key: string]: any;
}

// ==================== Operation Info Types ====================

export interface OperationInfo {
    /** Operation name */
    name: string;

    /** Operation description */
    description: string;

    /** Input formats */
    input_formats: string[];

    /** Output formats */
    output_formats: string[];

    /** Required parameters */
    required_params: string[];

    /** Optional parameters with defaults */
    optional_params: Record<string, any>;

    /** Whether batch processing is supported */
    supports_batch: boolean;

    /** Category */
    category: string;

    /** Example usage */
    example?: Record<string, any>;
}

export interface CategoryInfo {
    /** Category name */
    name: string;

    /** Category description */
    description: string;

    /** Operations in this category */
    operations: string[];
}

// ==================== Statistics Types ====================

export interface TaskStatistics {
    /** Total tasks */
    total: number;

    /** Completed tasks */
    completed: number;

    /** Failed tasks */
    failed: number;

    /** Running tasks */
    running: number;

    /** Pending tasks */
    pending: number;

    /** Cancelled tasks */
    cancelled: number;

    /** Success rate */
    success_rate: number;

    /** Average duration in seconds */
    average_duration: number;

    /** Tasks by type */
    by_type: Record<string, number>;

    /** Tasks by operation */
    by_operation: Record<string, number>;
}

export interface TimelinePoint {
    /** Timestamp */
    timestamp: string;

    /** Tasks submitted */
    submitted: number;

    /** Tasks completed */
    completed: number;

    /** Tasks failed */
    failed: number;

    /** Average duration */
    avg_duration: number;
}

export interface TaskTimeline {
    /** Timeline data points */
    timeline: TimelinePoint[];

    /** Total tasks in period */
    total: number;

    /** Period in days */
    period_days: number;
}

// ==================== Format Matrix Types ====================

export interface ConversionMatrix {
    /** Category name */
    category: string;

    /** Matrix data (input_format -> output_format -> supported) */
    matrix: Record<string, Record<string, boolean>>;

    /** All formats in this category */
    formats: string[];
}

export interface MimeTypeResponse {
    /** File extension */
    extension: string;

    /** MIME type */
    mime_type: string;

    /** Format category */
    category?: string;
}

export interface FormatComparison {
    /** First format */
    format1: string;

    /** Second format */
    format2: string;

    /** Similarity score */
    similarity: number;

    /** Common properties */
    common_properties: string[];

    /** Unique properties */
    unique_to_format1: string[];
    unique_to_format2: string[];

    /** Conversion support */
    conversion_to_format1_supported: boolean;
    conversion_to_format2_supported: boolean;
}

// ==================== Utility Types ====================

export type PaginatedResponse<T> = {
    items: T[];
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
};

// File upload status interface
export interface FileUploadStatus {
    id: string;
    file: File;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'failed';
    serverPath?: string;
    error?: string;
}

export type BatchSubmitResponse = TaskResponse[];

export type SupportedFormatsResponse = Record<string, string[]>;

export type FormatCategoriesResponse = string[];

export type OperationCategoriesResponse = CategoryInfo[];

export type OperationListResponse = OperationInfo[];

export type LanguagesResponse = string[];
