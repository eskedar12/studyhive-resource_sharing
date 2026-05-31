const chatSocket = (io, socket) => {
  socket.on('join_conversation', (otherUserId) => {
    const roomId = [String(socket.user._id), String(otherUserId)].sort().join('_');
    socket.join(`chat:${roomId}`);
  });

  socket.on('leave_conversation', (otherUserId) => {
    const roomId = [String(socket.user._id), String(otherUserId)].sort().join('_');
    socket.leave(`chat:${roomId}`);
  });
};

module.exports = chatSocket;