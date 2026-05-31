const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary } = require('../utils/uploadToCloudinary');

// GET /api/users/:id
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-savedPosts');
    if (!user) throw new ApiError(404, 'User not found');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me
const updateProfile = async (req, res, next) => {
  try {
    const { username, bio } = req.body;
    const update = {};
    if (username) update.username = username;
    if (bio !== undefined) update.bio = bio;

    if (username) {
      const exists = await User.findOne({ username, _id: { $ne: req.user._id } });
      if (exists) throw new ApiError(409, 'Username already taken');
    }

    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'studyhive/avatars');
      update.avatar = result.url;
    }

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true, runValidators: true });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// GET /api/users/search?q=username
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q?.trim()) return res.json([]);
    const users = await User.find({
      username: { $regex: q.trim(), $options: 'i' },
      _id: { $ne: req.user._id },
    })
      .select('username avatar bio')
      .limit(10);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, searchUsers };
