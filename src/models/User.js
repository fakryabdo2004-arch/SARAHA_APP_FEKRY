import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, unique: true, required: true, lowercase: true, trim: true },
  email: { type: String, trim: true },
  manageToken: { type: String, required: true },
}, { timestamps: true });

const User = model('User', userSchema);
export default User;