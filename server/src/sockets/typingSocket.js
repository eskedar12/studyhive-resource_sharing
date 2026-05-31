const typingSocket = (io, socket) => {
  socket.on('typing_start', (toUserId) => {
    io.to(`user:${toUserId}`).emit('typing', {
      userId: String(socket.user._id),
      isTyping: true,
    });
  });

  socket.on('typing_stop', (toUserId) => {
    io.to(`user:${toUserId}`).emit('typing', {
      userId: String(socket.user._id),
      isTyping: false,
    });
  });
};

module.exports = typingSocket;