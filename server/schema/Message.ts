// src/server/schema/Message.ts
import mongoose, { Schema, model, models, Types } from 'mongoose';



export interface SeenEntry {
  userId: Types.ObjectId | string;
  seenAt: Date;
}

export type MessageType =
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'file'
  | 'location'
  | 'contact'
  | 'sticker'
  | 'deleted';

export type MessageStatus = 'sent' | 'delivered' | 'seen';

export interface MessageProps {
  _id: Types.ObjectId | string;
  chatId: Types.ObjectId | string;
  sender: Types.ObjectId | string | any;  // populated `User` object or just id
  receiver: Types.ObjectId | string | any;
  messageType?: MessageType;
  content?: string;
  mediaUrl?: string;
  mediaMimeType?: string;
  replyTo?: Types.ObjectId | string | MessageProps;
  forwarded?: boolean;
  status?: MessageStatus;
  seenBy?: SeenEntry[];
  createdAt?: Date;
  updatedAt?: Date;
}



const MessageSchema = new Schema<MessageProps>({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file', 'location', 'contact', 'sticker', 'deleted'],
    default: 'text',
  },
  content: { type: String },
  mediaUrl: { type: String },
  mediaMimeType: { type: String },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
  },
  forwarded: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent',
  },
  seenBy: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      seenAt: { type: Date, default: Date.now },
    }
  ],
}, {
  timestamps: true,
  collection: 'message',
});

const Message = models.Message || model('Message', MessageSchema);

export default Message;
