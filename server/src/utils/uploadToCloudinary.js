const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');
const path = require('path');

const uploadToCloudinary = (file, folder = 'studyhive/attachments') => {
  return new Promise((resolve, reject) => {
    const isImage = file.mimetype?.startsWith('image/');
    const resourceType = isImage ? 'image' : 'raw';

    const originalName = file.originalname || 'file';
    const nameWithoutExt = path.basename(originalName, path.extname(originalName));
    const safePublicId = `${Date.now()}-${nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_')}`;

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      public_id: safePublicId,
      overwrite: false,
    };

    const onResult = (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return reject(new Error(`Cloudinary error: ${error.message}`));
      }
      resolve({
        url: result.secure_url,   // plain URL, no fl_attachment
        publicId: result.public_id,
        name: originalName,        // original filename stored separately
        mimetype: file.mimetype,
        size: file.size || result.bytes,
      });
    };

    if (file.buffer) {
      const stream = cloudinary.uploader.upload_stream(uploadOptions, onResult);
      Readable.from(file.buffer).pipe(stream);
    } else if (file.path) {
      cloudinary.uploader.upload(file.path, uploadOptions, onResult);
    } else {
      reject(new Error('No file buffer or path available'));
    }
  });
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
