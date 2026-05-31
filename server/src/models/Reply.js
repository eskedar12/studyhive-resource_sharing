const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, maxlength: 2000 },
    attachments: [
      {
        url: String,
        name: String,
        mimetype: String,
        size: Number,
        publicId: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reply', replySchema);