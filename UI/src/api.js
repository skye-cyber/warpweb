import axios from "axios";

// Create axios instance with base URL (use the full server URL without path prefix)
const api = axios.create({
  baseURL: "http://localhost:8008", // adjust to your server address
});

// Add request interceptor for auth tokens if needed
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ==================== Conversion Service ====================
export const conversionService = {
  /** Submit a conversion task */
  submit: (data, priority = "medium") =>
    api.post("/api/v1/conversion/submit", data, { params: { priority } }),

  /** List all supported conversion operations */
  listOperations: (category = null) =>
    api.get("/api/v1/conversion/operations", { params: { category } }),

  /** Get info about a specific operation */
  getOperationInfo: (operation) =>
    api.get(`/api/v1/conversion/operations/${operation}`),

  /** Get all operation categories */
  getCategories: () => api.get("/api/v1/conversion/categories"),

  /** Validate a conversion request without executing */
  validate: (data) => api.post("/api/v1/conversion/validate", data),

  /** Get all supported input/output formats by category */
  getSupportedFormats: () => api.get("/api/v1/conversion/formats"),

  /** Submit multiple conversion tasks in batch */
  batchSubmit: (requests, priority = "medium") =>
    api.post("/api/v1/conversion/batch", requests, { params: { priority } }),
};

// ==================== PDF Service ====================
export const pdfService = {
  /** Join multiple PDF files */
  join: (data, priority = "medium") =>
    api.post("/api/v1/pdf/join", data, { params: { priority } }),

  /** Extract specific pages from a PDF */
  extractPages: (data, priority = "medium") =>
    api.post("/api/v1/pdf/extract-pages", data, { params: { priority } }),

  /** Extract images from a PDF */
  extractImages: (pdfPath, outputDir = null, imageSize = null, priority = "medium") =>
    api.post("/api/v1/pdf/extract-images", null, {
      params: { pdf_path: pdfPath, output_dir: outputDir, image_size: imageSize, priority },
    }),

  /** Scan PDF and extract text */
  scan: (pdfPath, mode = "standard", separator = "\n", priority = "medium") =>
    api.post("/api/v1/pdf/scan", null, {
      params: { pdf_path: pdfPath, mode, separator, priority },
    }),

  /** Convert PDF to a single long image */
  toLongImage: (pdfPath, outputPath = null, priority = "medium") =>
    api.post("/api/v1/pdf/to-long-image", null, {
      params: { pdf_path: pdfPath, output_path: outputPath, priority },
    }),

  /** Get information about a PDF file */
  getInfo: (pdfPath) =>
    api.get("/api/v1/pdf/info", { params: { pdf_path: pdfPath } }),
};

// ==================== Audio Service ====================
export const audioService = {
  /** Convert audio files between formats */
  convert: (data, priority = "medium") =>
    api.post("/api/v1/audio/convert", data, { params: { priority } }),

  /** Extract audio from a video file */
  extractFromVideo: (videoPath, outputFormat = "mp3", outputPath = null, priority = "medium") =>
    api.post("/api/v1/audio/extract", null, {
      params: { video_path: videoPath, output_format: outputFormat, output_path: outputPath, priority },
    }),

  /** Join multiple audio files */
  join: (data, priority = "medium") =>
    api.post("/api/v1/audio/join", data, { params: { priority } }),

  /** Record audio from microphone */
  record: (duration = null, outputFormat = "wav", outputPath = null, priority = "medium") =>
    api.post("/api/v1/audio/record", null, {
      params: { duration, output_format: outputFormat, output_path: outputPath, priority },
    }),

  /** Apply effects to an audio file */
  applyEffects: (audioPath, effects, outputPath = null, priority = "medium") =>
    api.post("/api/v1/audio/effects", effects, {
      params: { audio_path: audioPath, output_path: outputPath, priority },
    }),

  /** Get supported audio formats */
  getFormats: () => api.get("/api/v1/audio/formats"),
};

// ==================== Video Service ====================
export const videoService = {
  /** Convert video files between formats */
  convert: (data, priority = "medium") =>
    api.post("/api/v1/video/convert", data, { params: { priority } }),

  /** Analyze video properties and metadata */
  analyze: (data, priority = "medium") =>
    api.post("/api/v1/video/analyze", data, { params: { priority } }),

  /** Extract frames from a video */
  extractFrames: (videoPath, frameRate = 1, outputDir = null, format = "jpg", priority = "medium") =>
    api.post("/api/v1/video/extract-frames", null, {
      params: { video_path: videoPath, frame_rate: frameRate, output_dir: outputDir, format, priority },
    }),

  /** Compress a video file */
  compress: (videoPath, targetSize = null, quality = 23, outputPath = null, priority = "medium") =>
    api.post("/api/v1/video/compress", null, {
      params: { video_path: videoPath, target_size: targetSize, quality, output_path: outputPath, priority },
    }),

  /** Get supported video formats */
  getFormats: () => api.get("/api/v1/video/formats"),
};

// ==================== Image Service ====================
export const imageService = {
  /** Convert images between formats */
  convert: (data, priority = "medium") =>
    api.post("/api/v1/image/convert", data, { params: { priority } }),

  /** Resize or compress an image */
  resize: (data, priority = "medium") =>
    api.post("/api/v1/image/resize", data, { params: { priority } }),

  /** Convert multiple images to a single PDF */
  toPdf: (imagePaths, outputPath = null, sort = false, walk = false, priority = "medium") =>
    api.post("/api/v1/image/to-pdf", imagePaths, {
      params: { output_path: outputPath, sort, walk, priority },
    }),

  /** Convert multiple images to a Word document */
  toWord: (imagePaths, outputPath = null, priority = "medium") =>
    api.post("/api/v1/image/to-word", imagePaths, {
      params: { output_path: outputPath, priority },
    }),

  /** Convert images to grayscale */
  toGrayscale: (imagePaths, outputDir = null, priority = "medium") =>
    api.post("/api/v1/image/grayscale", imagePaths, {
      params: { output_dir: outputDir, priority },
    }),

  /** Extract text from images using OCR */
  ocr: (data, priority = "medium") =>
    api.post("/api/v1/image/ocr", data, { params: { priority } }),

  /** Get supported image formats */
  getFormats: () => api.get("/api/v1/image/formats"),
};

// ==================== Document Service ====================
export const documentService = {
  /** Convert documents between formats */
  convert: (data, priority = "medium") =>
    api.post("/api/v1/document/convert", data, { params: { priority } }),

  /** Convert a document to images */
  toImage: (documentPath, outputFormat = "png", outputDir = null, priority = "medium") =>
    api.post("/api/v1/document/to-image", null, {
      params: { document_path: documentPath, output_format: outputFormat, output_dir: outputDir, priority },
    }),

  /** Convert HTML files to Word documents */
  htmlToWord: (htmlPaths, outputDir = null, priority = "medium") =>
    api.post("/api/v1/document/html2word", htmlPaths, {
      params: { output_dir: outputDir, priority },
    }),

  /** Convert styled text to Word document */
  textToWord: (data, priority = "medium") =>
    api.post("/api/v1/document/text2word", data, { params: { priority } }),

  /** Convert Markdown to Word document with Mermaid rendering */
  markdownToWord: (markdownPath, outputPath = null, priority = "medium") =>
    api.post("/api/v1/document/markdown2word", null, {
      params: { markdown_path: markdownPath, output_path: outputPath, priority },
    }),

  /** Get supported document formats */
  getFormats: () => api.get("/api/v1/document/formats"),
};

// ==================== OCR Service ====================
export const ocrService = {
  /** Extract text from images using OCR */
  extract: (data, priority = "medium") =>
    api.post("/api/v1/ocr/extract", data, { params: { priority } }),

  /** Upload images and extract text using OCR */
  uploadAndExtract: (files, language = "eng", separator = "\n", priority = "medium") => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return api.post("/api/v1/ocr/upload-extract", formData, {
      params: { language, separator, priority },
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /** Get supported OCR languages */
  getLanguages: () => api.post("/api/v1/ocr/languages"),
};

// ==================== System Service ====================
export const systemService = {
  /** Get system status and statistics */
  getStatus: () => api.get("/api/v1/system/status"),

  /** Get detailed system information */
  getInfo: () => api.get("/api/v1/system/info"),

  /** Simple health check */
  healthCheck: () => api.get("/api/v1/system/health"),

  /** Get API version information */
  getVersion: () => api.get("/api/v1/system/version"),

  /** Get detailed system metrics for monitoring */
  getMetrics: () => api.get("/api/v1/system/metrics"),

  /** Shutdown the server (admin only) */
  shutdown: (force = false) =>
    api.post("/api/v1/system/shutdown", null, { params: { force } }),

  /** Clean up old tasks and temporary files */
  cleanup: (days = 7) =>
    api.post("/api/v1/system/cleanup", null, { params: { days } }),

  /** Get recent log entries */
  getLogs: (level = "INFO", lines = 100) =>
    api.get("/api/v1/system/logs", { params: { level, lines } }),

  /** Get current system configuration */
  getConfig: () => api.get("/api/v1/system/config"),
};

// ==================== Tasks Service ====================
export const tasksService = {
  /** List all tasks with optional filtering */
  list: (status = null, taskType = null, operation = null, limit = 50, offset = 0) =>
    api.get("/api/v1/tasks", {
      params: { status, task_type: taskType, operation, limit, offset },
    }),

  /** Get detailed task information */
  get: (taskId) => api.get(`/api/v1/tasks/${taskId}`),

  /** Delete a task from history */
  delete: (taskId) => api.delete(`/api/v1/tasks/${taskId}`),

  /** Get task status (lightweight version) */
  getStatus: (taskId) => api.get(`/api/v1/tasks/${taskId}/status`),

  /** Cancel a running task */
  cancel: (taskId) => api.post(`/api/v1/tasks/${taskId}/cancel`),

  /** Retry a failed task */
  retry: (taskId) => api.post(`/api/v1/tasks/${taskId}/retry`),

  /** Get task logs */
  getLogs: (taskId, lines = 100) =>
    api.get(`/api/v1/tasks/${taskId}/logs`, { params: { lines } }),

  /** Clean up old tasks */
  cleanup: (days = 7, status = null) =>
    api.post("/api/v1/tasks/cleanup", null, { params: { days, status } }),

  /** Get task statistics summary */
  getStats: () => api.get("/api/v1/tasks/stats/summary"),

  /** Get task timeline for charts */
  getTimeline: (days = 7) =>
    api.get("/api/v1/tasks/stats/timeline", { params: { days } }),
};

// ==================== Formats Service ====================
export const formatsService = {
  /** List all supported file formats */
  listAll: (category = null) =>
    api.get("/api/v1/formats", { params: { category } }),

  /** Get all format categories */
  getCategories: () => api.get("/api/v1/formats/categories"),

  /** Get information about a specific format */
  getInfo: (formatKey) => api.get(`/api/v1/formats/${formatKey}`),

  /** Get compatible formats for a given format */
  getCompatible: (formatKey, direction = "output") =>
    api.get(`/api/v1/formats/${formatKey}/compatible`, { params: { direction } }),

  /** Validate if conversion between formats is supported */
  validateConversion: (inputFormat, outputFormat) =>
    api.post("/api/v1/formats/validate-conversion", null, {
      params: { input_format: inputFormat, output_format: outputFormat },
    }),

  /** Get all file extensions */
  getAllExtensions: (category = null) =>
    api.get("/api/v1/formats/extensions/all", { params: { category } }),

  /** Get all formats in a specific category */
  getByCategory: (category) => api.get(`/api/v1/formats/by-category/${category}`),

  /** Suggest an output format based on input */
  suggestOutputFormat: (inputFormat, preferred = null) =>
    api.get("/api/v1/formats/suggest-output/", {
      params: { input_format: inputFormat, preferred },
    }),

  /** Get conversion matrix for a category */
  getConversionMatrix: (category) => api.get(`/api/v1/formats/matrix/${category}`),

  /** Get MIME type for a file extension */
  getMimeType: (extension) => api.get(`/api/v1/formats/mime/${extension}`),

  /** Compare two formats */
  compare: (format1, format2) =>
    api.get("/api/v1/formats/compare", { params: { format1, format2 } }),
};

// ==================== Root Endpoints ====================
export const rootService = {
  /** Root endpoint with API information */
  getRoot: () => api.get("/"),

  /** Simple health check endpoint */
  healthCheck: () => api.get("/health"),
};

// Default export of the configured axios instance (optional)
export default api;
