require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const replyRoutes = require('./routes/replyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const searchRoutes = require('./routes/searchRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { apiLimiter } = require('./config/rateLimiter');

const app = express();

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API rate limiter
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/replies', replyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;