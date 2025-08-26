import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import streamifier from 'streamifier';

const uploadImageFromBuffer = (buffer) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: 'saraha/messages', resource_type: 'image' },
    (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    }
  );
  streamifier.createReadStream(buffer).pipe(stream);
});

export const createMessage = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) return res.status(404).json(ApiResponse.error('User not found'));

  let imageUrl = null, imagePublicId = null;
  if (req.file) {
    try {
      const uploaded = await uploadImageFromBuffer(req.file.buffer);
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    } catch {
      return res.status(400).json(ApiResponse.error('Image upload failed'));
    }
  }

  const msg = await Message.create({
    user: user._id,
    text: req.body.text,
    anonymousName: req.body.anonymousName || null,
    imageUrl,
    imagePublicId,
    ip: req.ip
  });

  return res.status(201).json(ApiResponse.success('Message created', {
    id: msg._id,
    text: msg.text,
    anonymousName: msg.anonymousName,
    imageUrl: msg.imageUrl,
    createdAt: msg.createdAt
  }));
});

export const listMessages = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { limit, page } = req.query;
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) return res.status(404).json(ApiResponse.error('User not found'));

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Message.find({ user: user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Message.countDocuments({ user: user._id })
  ]);

  return res.json(ApiResponse.success('Messages list', {
    items: items.map(i => ({
      id: i._id,
      text: i.text,
      anonymousName: i.anonymousName,
      imageUrl: i.imageUrl,
      createdAt: i.createdAt
    })),
    meta: { total, page, limit, pages: Math.ceil(total / limit) }
  }));
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { username, messageId } = req.params;
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) return res.status(404).json(ApiResponse.error('User not found'));

  const token = req.headers['x-manage-token'];
  const isAdmin = process.env.ADMIN_KEY && req.headers['x-admin-key'] === process.env.ADMIN_KEY;
  if (user.manageToken !== token && !isAdmin) {
    return res.status(403).json(ApiResponse.error('Forbidden: invalid manage token'));
  }

  const msg = await Message.findOne({ _id: messageId, user: user._id });
  if (!msg) return res.status(404).json(ApiResponse.error('Message not found'));

  if (msg.imagePublicId) {
    try { await cloudinary.uploader.destroy(msg.imagePublicId); } catch {}
  }

  await msg.deleteOne();
  return res.json(ApiResponse.success('Message deleted'));
});