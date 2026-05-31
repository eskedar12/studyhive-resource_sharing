const { getIO } = require('../config/socket');

const emitToUser = (userId, event, data) => {
  try {
    const io = getIO();
    io.to(`user:${userId}`).emit(event, data);
  } catch (err) {
    console.error('Socket emit error:', err.message);
  }
};

const emitNotification = (userId, notification) => {
  emitToUser(userId, 'notification', notification);
};

module.exports = { emitToUser, emitNotification };