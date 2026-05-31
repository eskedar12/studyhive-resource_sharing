export const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const validateFile = (file) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'File type not allowed. Allowed: PDF, images, PPT, Word docs';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File size must be under 10MB';
  }
  return null;
};

export const getFileIcon = (mimetype) => {
  if (mimetype?.includes('pdf')) return '📄';
  if (mimetype?.includes('image')) return '🖼️';
  if (mimetype?.includes('presentation') || mimetype?.includes('powerpoint')) return '📊';
  if (mimetype?.includes('word')) return '📝';
  return '📎';
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};