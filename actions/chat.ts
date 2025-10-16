'use server';

import { dbConnection } from '@/lib/dbConnection';
import Message from '@/server/schema/Message';
import Property from '@/server/schema/Property';
import '@/server/schema/User';
import '@/server/schema/Chat';
import { Types } from 'mongoose';
import { getCurrentUser } from './auth';
import Chat from '@/server/schema/Chat';
import mongoose from 'mongoose';

export async function sendMessage({
  chatId,
  content,
  messageType = 'text',
}: {
  chatId?: string;
  content: string;
  messageType?: 'text' | 'image';
}) {
  await dbConnection();

  const { message, success, data: user } = await getCurrentUser();
  if (!success) throw new Error(message);
  if (!user) throw new Error('Login to continue')

  const senderId = user.id;
  if (!chatId) throw new Error('Missing chatId.');

  let chat = await Chat.findById(chatId);

  // 🧠 If chat doesn't exist, try to create one using propertyId
  if (!chat) {
    const property = await Property.findById(chatId);
    if (property) {
      if (property.userId.toString() === senderId) {
        throw new Error("You cannot send messages to yourself about your own property.");
      }
      chat = await createChat(chatId, senderId);

      // Re-fetch as document (in case createChat returns lean object)
      chat = await Chat.findById(chat._id);
    } else {
      throw new Error('Chat or property does not exist.');
    }
  }

  // 🧠 Find receiver (the other participant)
  const receiverId = chat.participants.find(
    (id: Types.ObjectId) => id.toString() !== senderId
  );

  if (!receiverId) {
    throw new Error('Receiver not found');
  }

  if (receiverId.toString() === senderId) {
    throw new Error("You cannot send messages to yourself.");
  }

  // 🧠 Create the message
  const cleanContent = await removePhoneNumbers(content);
  const messageDoc = await Message.create({
    chatId: chat._id,
    sender: senderId,
    receiver: receiverId,
    content: cleanContent,
    messageType,
  });

  // 🧠 Populate sender/receiver
  const populatedMessage = await Message.findById(messageDoc._id)
    .populate('sender', '_id name image')
    .populate('receiver', '_id name image')
    .lean();

  // 🧠 Update chat with latest message (using updateOne avoids .save issues)
  await Chat.updateOne({ _id: chat._id }, { $set: { lastMessage: messageDoc._id } });

  return {
    message: populatedMessage,
    chatId: chat._id.toString(),
    receiverId: receiverId.toString(),
  };
}


export async function createChat(propertyId: string, senderId: string) {
  await dbConnection();

  const property = await Property.findById(propertyId);
  if (!property) throw new Error("Property not found");

  const propertyOwnerId = property.userId.toString();

  // 🚫 Prevent self-chat
  if (senderId === propertyOwnerId) {
    throw new Error("You cannot message yourself about your own property");
  }

  // 🧠 Check if chat already exists
  const existingChat = await Chat.findOne({
    propertyId: new mongoose.Types.ObjectId(propertyId),
    participants: {
      $all: [
        new mongoose.Types.ObjectId(senderId),
        new mongoose.Types.ObjectId(propertyOwnerId),
      ],
    },
  });

  if (existingChat) return existingChat;

  // 🧠 Create a new chat
  const newChat = await Chat.create({
    propId: propertyId,
    propertyId,
    participants: [senderId, propertyOwnerId],
  });

  // ✅ Return the fresh chat with participants
  return await Chat.findById(newChat._id).lean();
}

/**
 * Get all messages in a chat (sorted oldest to newest).
 */
export async function getMessages(chatId: string) {
  await dbConnection();

  if (!Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chat ID");
  }

  const messages = await Message.find({ chatId })
    .sort({ createdAt: 1 })
    .populate("sender", "_id name image")      // 🧠 sender snapshot
    .populate("receiver", "_id name image")
    .lean();   //

  return JSON.parse(JSON.stringify(messages));
}

/**
 * Mark all unseen messages in a chat as seen by the user.
 */
export async function markAsSeen(chatId: string, userId: string) {
  await dbConnection();

  await Message.updateMany(
    {
      chatId,
      'seenBy.userId': { $ne: userId },
    },
    {
      $addToSet: {
        seenBy: { userId, seenAt: new Date() },
      },
      $set: { status: 'seen' },
    }
  );

  return { success: true };
}

/**
 * Return all chats for a given user (sorted by most recent).
 */
export async function getUserChats(userId: string) {
  await dbConnection();

  if (!userId) throw new Error("Invalid user ID")

  const objectUserId = new Types.ObjectId(userId);

  const chats = await Chat.find({ participants: objectUserId }) // ✅ array match
    .populate('participants', 'name image _id')                     // 👤 show user info
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'name image'
      }
    })
    .populate("propertyId", "title _id")
    .sort({ updatedAt: -1 })
    .lean(); //

  return JSON.parse(JSON.stringify(chats));
}


export async function getUnreadMessagesGrouped() {
  await dbConnection();
  const { data: user, success } = await getCurrentUser();
  if (!success || !user?.id) return [];

  const messages = await Message.aggregate([
    {
      $match: {
        receiver: user.id,
        seenBy: { $ne: user.id },
      },
    },
    {
      $group: {
        _id: { chatId: '$chatId', sender: '$sender' },
        count: { $sum: 1 },
        chatId: { $first: '$chatId' },
        sender: { $first: '$sender' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'sender',
        foreignField: '_id',
        as: 'senderData',
      },
    },
    {
      $unwind: '$senderData',
    },
    {
      $project: {
        chatId: 1,
        count: 1,
        senderName: '$senderData.name',
        senderId: '$senderData._id',
      },
    },
  ]);

  return messages;
}

function removePhoneNumbers(chat: string) {
  const phoneRegex = /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?){2,4}\d{2,4}/g;
  return chat.replace(phoneRegex, "[removed]");
}