const express = require('express');
const router = express.Router();
const {
  getPosts, getSavedPosts, getPost, createPost,
  updatePost, deletePost, toggleSave, markSolved,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Optional auth (to attach isSaved)
const optionalAuth = (req, res, next) => {
  const auth = require('../middleware/authMiddleware');
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (!err) {
      req.user = await User.findById(decoded.id);
    }
    next();
  });
};

router.get('/saved', protect, getSavedPosts);
router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPost);
router.post('/', protect, upload.array('attachments', 5), createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/save', protect, toggleSave);
router.patch('/:id/solved', protect, markSolved);

module.exports = router;