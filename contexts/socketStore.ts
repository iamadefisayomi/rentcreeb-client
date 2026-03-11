import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { RENDER_SERVER_API } from '@/constants';

type TypingUser = { id: string; name?: string };

type State = {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;

  joinChat: (chatId: string, userId?: string) => void;
  sendMessage: (msg: any) => void;
  sendTyping: (chatId: string, user: TypingUser) => void;

  onMessage: (cb: (msg: any) => void) => () => void;
  onTyping: (cb: (data: { chatId: string; user: TypingUser }) => void) => () => void;
  onSeen: (cb: (data: { chatId: string; userId: string }) => void) => () => void;

  onOnlineUsers: (cb: (users: string[]) => void) => () => void;
  onUserStatus: (cb: (data: { userId: string; status: 'online' | 'offline' }) => void) => () => void;

  onlineUsers: string[];
  typingUser: TypingUser | null;

  setOnlineUsers: (ids: string[]) => void;
  setTypingUser: (user: TypingUser | null) => void;
  clearTypingUser: () => void;
};

export const useSocketStore = create<State>((set, get) => ({
  socket: null,

  connect: () => {
    if (!get().socket) {
      const socket = io(RENDER_SERVER_API, { transports: ['websocket'] });
      socket.on('connect', () => console.log('Socket connected:', socket.id));
      set({ socket });
    }
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  onlineUsers: [],
  typingUser: null,
  setOnlineUsers: (ids: string[]) => set({ onlineUsers: ids }),
  setTypingUser: (user) => set({ typingUser: user }),
  clearTypingUser: () => set({ typingUser: null }),

  joinChat: (chatId, userId) => get().socket?.emit('joinChat', { chatId, userId }),

  sendMessage: (msg) => get().socket?.emit('sendMessage', { chatId: msg.chatId, message: msg }),

  sendTyping: (chatId, user) => get().socket?.emit('userTyping', { chatId, user }),

  onMessage: (cb) => {
    const socket = get().socket;
    if (!socket) return () => {};
    socket.off('newMessage', cb).on('newMessage', cb);
    return () => socket.off('newMessage', cb);
  },

  onTyping: (cb) => {
    const socket = get().socket;
    if (!socket) return () => {};

    const handler = (data: { chatId: string; user: TypingUser }) => {
      set({ typingUser: data.user });
      cb(data);
    };

    socket.off('userTyping', handler).on('userTyping', handler);
    return () => socket.off('userTyping', handler);
  },

  onSeen: (cb) => {
    const socket = get().socket;
    if (!socket) return () => {};
    socket.off('messageSeen', cb).on('messageSeen', cb);
    return () => socket.off('messageSeen', cb);
  },

  onOnlineUsers: (cb) => {
    const socket = get().socket;
    if (!socket) return () => {};

    const handler = (users: string[]) => {
      set({ onlineUsers: users });
      cb(users);
    };

    socket.off('onlineUsers', handler).on('onlineUsers', handler);
    return () => socket.off('onlineUsers', handler);
  },

  onUserStatus: (cb) => {
    const socket = get().socket;
    if (!socket) return () => {};
    socket.off('userStatus', cb).on('userStatus', cb);
    return () => socket.off('userStatus', cb);
  },
}));