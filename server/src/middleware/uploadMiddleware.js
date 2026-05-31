const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isImage = file.mimetype.startsWith('image/');
    return {
      folder: 'studyhive/attachments',
      resource_type: isImage ? 'image' : 'raw',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'ppt', 'pptx', 'doc', 'docx'],
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('File type not allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// For avatar uploads (images only)
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'studyhive/avatars', resource_type: 'image', allowed_formats: ['jpg', 'jpeg', 'png'] },
});

const uploadAvatar = multer({ storage: avatarStorage, limits: { fileSize: 2 * 1024 * 1024 } });

module.exports = { upload, uploadAvatar };