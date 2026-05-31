const Post = require('../models/Post');
const User = require('../models/User');
const Reply = require('../models/Reply');
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary } = require('../utils/uploadToCloudinary');

// GET /api/posts
const getPosts = async (req, res, next) => {
  try {
    const { filter = 'new', page = 1, limit = 10, author } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let query = {};
    let sort = { createdAt: -1 };

    if (author) query.author = author;
    if (filter === 'unsolved') query.isSolved = false;
    if (filter === 'solved') query.isSolved = true;
    

    const posts = await Post.find(query)
      .sort(sort).skip(skip).limit(Number(limit))
      .populate('author', 'username avatar');

    let savedSet = new Set();
    if (req.user) {
      const u = await User.findById(req.user._id).select('savedPosts');
      savedSet = new Set(u.savedPosts.map(String));
    }

    const total = await Post.countDocuments(query);
    res.json({
      posts: posts.map((p) => ({ ...p.toObject(), isSaved: savedSet.has(String(p._id)) })),
      hasMore: skip + posts.length < total,
    });
  } catch (err) { next(err); }
};

// GET /api/posts/saved
const getSavedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedPosts',
      populate: { path: 'author', select: 'username avatar' },
    });
    res.json(user.savedPosts.map((p) => ({ ...p.toObject(), isSaved: true })));
  } catch (err) { next(err); }
};

// GET /api/posts/:id
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id, { $inc: { viewCount: 1 } }, { new: true }
    ).populate('author', 'username avatar');
    if (!post) throw new ApiError(404, 'Post not found');

    let isSaved = false;
    if (req.user) {
      const u = await User.findById(req.user._id).select('savedPosts');
      isSaved = u.savedPosts.map(String).includes(String(post._id));
    }
    res.json({ ...post.toObject(), isSaved });
  } catch (err) { next(err); }
};

// POST /api/posts
const createPost = async (req, res, next) => {
  try {
    const { title, body, course, semester } = req.body;
    if (!title) throw new ApiError(400, 'Title is required');

    // Handle tags sent as tags[] or tags or comma-separated
    let tags = [];
    if (req.body['tags[]']) {
      tags = Array.isArray(req.body['tags[]']) ? req.body['tags[]'] : [req.body['tags[]']];
    } else if (req.body.tags) {
      tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
    }

    // Upload files to Cloudinary (if configured) or store buffer info
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file);
          attachments.push(result);
        } catch (uploadErr) {
          console.error('File upload error:', uploadErr.message);
          // Don't fail the whole post if upload fails; skip the file
        }
      }
    }

    const post = await Post.create({ author: req.user._id, title, body, course, semester, tags, attachments });
    await post.populate('author', 'username avatar');
    res.status(201).json(post);
  } catch (err) { next(err); }
};

// PUT /api/posts/:id
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');
    if (String(post.author) !== String(req.user._id)) throw new ApiError(403, 'Not authorized');

    const { title, body, course, semester, tags } = req.body;
    if (title) post.title = title;
    if (body !== undefined) post.body = body;
    if (course !== undefined) post.course = course;
    if (semester) post.semester = semester;
    if (tags) post.tags = tags;

    await post.save();
    await post.populate('author', 'username avatar');
    res.json(post);
  } catch (err) { next(err); }
};

// DELETE /api/posts/:id
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');
    if (String(post.author) !== String(req.user._id)) throw new ApiError(403, 'Not authorized');
    await post.deleteOne();
    await Reply.deleteMany({ post: req.params.id });
    res.json({ message: 'Post deleted' });
  } catch (err) { next(err); }
};

// POST /api/posts/:id/save
const toggleSave = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.id;
    const isSaved = user.savedPosts.map(String).includes(String(postId));
    if (isSaved) user.savedPosts = user.savedPosts.filter((id) => String(id) !== String(postId));
    else user.savedPosts.push(postId);
    await user.save();
    res.json({ saved: !isSaved });
  } catch (err) { next(err); }
};

// PATCH /api/posts/:id/solved
const markSolved = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) throw new ApiError(404, 'Post not found');
    if (String(post.author) !== String(req.user._id)) throw new ApiError(403, 'Not authorized');
    post.isSolved = true;
    await post.save();
    res.json(post);
  } catch (err) { next(err); }
};

module.exports = { getPosts, getSavedPosts, getPost, createPost, updatePost, deletePost, toggleSave, markSolved };
