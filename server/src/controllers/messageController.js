const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const { emitToUser } = require('../utils/socketHelpers');

// GET /api/messages/conversations
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all messages involving this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar');

    // Build conversation map — one entry per other user
    const convMap = new Map();
    for (const msg of messages) {
      const other = String(msg.sender._id) === String(userId) ? msg.receiver : msg.sender;
      const key = String(other._id);
      if (!convMap.has(key)) {
        convMap.set(key, { user: other, lastMessage: msg, unread: 0 });
      }
      // Count unread: messages sent TO me that I haven't read
      if (!msg.isRead && String(msg.receiver._id) === String(userId)) {
        convMap.get(key).unread += 1;
      }
    }

    res.json([...convMap.values()]);
  } catch (err) { next(err); }
};

// GET /api/messages/:userId
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar');

    // Mark all messages from the other person as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json(messages);
  } catch (err) { next(err); }
};

// POST /api/messages
const sendMessage = async (req, res, next) => {
  try {
    const { to, content } = req.body;
    if (!to || !content?.trim()) throw new ApiError(400, 'Recipient and content required');

    const receiver = await User.findById(to);
    if (!receiver) throw new ApiError(404, 'Recipient not found');

    const message = await Message.create({
      sender: req.user._id,
      receiver: to,
      content,
    });

    await message.populate('sender', 'username avatar');
    await message.populate('receiver', 'username avatar');

    // Emit to receiver (real-time delivery)
    emitToUser(String(to), 'new_message', message);
    // Also emit to sender's OTHER tabs/devices
    emitToUser(String(req.user._id), 'new_message', message);

    // Notify receiver
    const notification = await Notification.create({
      recipient: to,
      sender: req.user._id,
      type: 'message',
      message: `${req.user.username}: "${content.slice(0, 60)}${content.length > 60 ? '…' : ''}"`,
      link: `/messages/${req.user._id}`,
    });
    emitToUser(String(to), 'notification', notification);

    res.status(201).json(message);
  } catch (err) { next(err); }
};

module.exports = { getConversations, getMessages, sendMessage };
