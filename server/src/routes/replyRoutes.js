const express = require('express');
const router = express.Router();
const { getReplies, createReply, deleteReply } = require('../controllers/replyController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/:postId', getReplies);
router.post('/:postId', protect, upload.array('attachments', 3), createReply);
router.delete('/:id', protect, deleteReply);

module.exports = router;