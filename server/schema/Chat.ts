import { Schema, model, models, Types } from 'mongoose';

const ChatSchema = new Schema({
  propertyId: {
    type: Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  participants: [{
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  isGroup: { type: Boolean, default: false },
  groupName: { type: String },
  groupIcon: { type: String },
  lastMessage: {
    type: Types.ObjectId,
    ref: 'Message',
  },
}, {
  timestamps: true,
  collection: 'chat',
});

const Chat = models.Chat || model('Chat', ChatSchema);
export default Chat