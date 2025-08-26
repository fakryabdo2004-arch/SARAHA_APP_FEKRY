import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connect = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/saraha';
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 15000
    });
    logger.success('DB connected succesfuly');
  } catch (err) {
    logger.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};