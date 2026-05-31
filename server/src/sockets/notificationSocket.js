const notificationSocket = (io, socket) => {
  // Client can request unread count on connect
  socket.on('get_unread_count', async () => {
    const Notification = require('../models/Notification');
    const count = await Notification.countDocuments({
      recipient: socket.user._id,
      isRead: false,
    });
    socket.emit('unread_count', count);
  });
};

module.exports = notificationSocket;