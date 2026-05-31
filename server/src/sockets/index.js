const jwt = require('jsonwebtoken');
const User = require('../models/User');
const notificationSocket = require('./notificationSocket');
const chatSocket = require('./chatSocket');
const typingSocket = require('./typingSocket');

const initSocketHandlers = (io) => {
  // Auth middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = String(socket.user._id);
    console.log(`Socket connected: ${socket.user.username} (${socket.id})`);

    // Join personal room
    socket.join(`user:${userId}`);

    notificationSocket(io, socket);
    chatSocket(io, socket);
    typingSocket(io, socket);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.user.username}`);
    });
  });
};

module.exports = initSocketHandlers;