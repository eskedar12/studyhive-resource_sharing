const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  url: String,
  name: String,
  mimetype: String,
  size: Number,
  publicId: String,
});

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, default: '', maxlength: 2000 },
    course: { type: String, default: '', trim: true },
    semester: { type: String, default: '' },
    tags: [{ type: String, trim: true, lowercase: true }],
    attachments: [attachmentSchema],
    isSolved: { type: Boolean, default: false },
    replyCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', body: 'text', course: 'text', tags: 'text' });
postSchema.index({ author: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);