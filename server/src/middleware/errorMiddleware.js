const ApiError = require('../utils/ApiError');

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'} already exists`;
  }
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Always log 500s so you can see what's crashing
  if (statusCode >= 500) {
    console.error(`[${statusCode}] ${req.method} ${req.originalUrl}:`, err.message);
    console.error(err.stack);
  }

  res.status(statusCode).json({ message });
};

module.exports = { notFound, errorHandler };
