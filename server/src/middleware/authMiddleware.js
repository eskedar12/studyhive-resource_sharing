const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) throw new ApiError(401, 'Not authenticated');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(401, 'User no longer exists');

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return next(new ApiError(401, 'Invalid token'));
    if (err.name === 'TokenExpiredError') return next(new ApiError(401, 'Token expired'));
    next(err);
  }
};

module.exports = { protect };