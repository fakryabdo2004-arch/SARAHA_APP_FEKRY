import crypto from 'crypto';
import User from '../models/User.js';
import Message from '../models/Message.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createUser = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const manageToken = crypto.randomBytes(24).toString('hex');
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    manageToken
  });
  return res.status(201).json(ApiResponse.success('User created', {
    id: user._id,
    username: user.username,
    email: user.email,
    manageToken: user.manageToken,
    createdAt: user.createdAt
  }));
});

export const getPublicProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) return res.status(404).json(ApiResponse.error('User not found'));
  const count = await Message.countDocuments({ user: user._id });
  return res.json(ApiResponse.success('User profile', {
    id: user._id,
    username: user.username,
    email: user.email || null,
    createdAt: user.createdAt,
    messageCount: count
  }));
});