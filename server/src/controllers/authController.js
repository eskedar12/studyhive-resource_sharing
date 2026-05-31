const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      throw new ApiError(400, 'Username, email and password are required');
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) throw new ApiError(409, 'Email already in use');

    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new ApiError(409, 'Username already taken');

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new ApiError(401, 'Invalid email or password');

    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new ApiError(401, 'Invalid email or password');

    const token = generateToken(user._id);

    // Don't send password back
    const userObj = user.toJSON();
    res.json({ user: userObj, token });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.json({ message: 'Logged out' });
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, 'User not found');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, getMe };