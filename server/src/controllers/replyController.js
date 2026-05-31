const Reply = require('../models/Reply');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const { emitNotification } = require('../utils/socketHelpers');
const { uploadToCloudinary } = require('../utils/uploadToCloudinary');

// GET /api/replies/:postId
const getReplies = async (req, res, next) => {
  try {
    const replies = await Reply.find({ post: req.params.postId })
      .populate('author', 'username avatar')
      .sort({ createdAt: 1 });
    res.json(replies);
  } catch (err) {
    next(err);
  }
};

// POST /api/replies/:postId
const createReply = async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) throw new ApiError(400, 'Reply body is required');

    const post = await Post.findById(req.params.postId);
    if (!post) throw new ApiError(404, 'Post not found');

    // Upload any attached files to Cloudinary
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file);
          attachments.push(result);
        } catch (uploadErr) {
          console.error('File upload error:', uploadErr.message);
          // Skip failed file, don't crash the whole reply
        }
      }
    }

    const reply = await Reply.create({
      post: req.params.postId,
      author: req.user._id,
      body,
      attachments,
    });

    await Post.findByIdAndUpdate(req.params.postId, { $inc: { replyCount: 1 } });
    await reply.populate('author', 'username avatar');

    // Notify post author if it's not their own reply
    if (String(post.author) !== String(req.user._id)) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'reply',
        message: `${req.user.username} replied to your post: "${post.title}"`,
        link: `/posts/${post._id}`,
      });
      emitNotification(String(post.author), notification);
    }

    res.status(201).json(reply);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/replies/:id
const deleteReply = async (req, res, next) => {
  try {
    const reply = await Reply.findById(req.params.id);
    if (!reply) throw new ApiError(404, 'Reply not found');
    if (String(reply.author) !== String(req.user._id)) throw new ApiError(403, 'Not authorized');

    await reply.deleteOne();
    await Post.findByIdAndUpdate(reply.post, { $inc: { replyCount: -1 } });
    res.json({ message: 'Reply deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReplies, createReply, deleteReply };
