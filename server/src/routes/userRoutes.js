const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, searchUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../middleware/uploadMiddleware');

// IMPORTANT: /search must come before /:id or Express matches "search" as an id
router.get('/search', protect, searchUsers);
router.get('/:id', getProfile);
router.put('/me', protect, uploadAvatar.single('avatar'), updateProfile);

module.exports = router;
