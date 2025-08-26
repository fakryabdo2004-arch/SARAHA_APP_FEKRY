import { Schema, model, Types } from 'mongoose';

const messageSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  text: { type: String, required: true, maxlength: 500 },
  anonymousName: { type: String },
  imageUrl: { type: String },
  imagePublicId: { type: String },
  ip: { type: String }
}, { timestamps: true });

const Message = model('Message', messageSchema);
export default Message;