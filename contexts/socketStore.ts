import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { RENDER_SERVER_API } from '@/constants';

type State = {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  joinChat: (chatId: string, userId?: string) => void;
  sendMessage: (msg: any) => void;
  sendTyping: (chatId: string, user: { id: string; name: string }) => void;
  onMessage: (cb: (msg: any) => void) => () => void;
  onTyping: (cb: (data: { chatId: string; user: any }) => void) => () => void;
  onSeen: (cb: (data: { chatId: string; userId: string }) => void) => () => void;
  onlineUsers: string[];
  setOnlineUsers: (ids: string[]) => void;
  typingUser: { id: string; name: string } | null;
  setTypingUser: (user: { id: string; name: string } | null) => void;
  onUserStatus: (cb: (data: { userId: string; status: 'online' | 'offline' }) => void) => () => void;
  clearTypingUser: () => void;
};

export const useSocketStore = create<State>((set, get) => ({
  socket: null,

  connect: () => {
    if (!get().socket) {
      const socket = io(RENDER_SERVER_API, {
        transports: ['websocket'],
      });

      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      set({ socket });
    }
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
      console.log('Socket disconnected');
    }
  },

  onlineUsers: [],
  setOnlineUsers: (ids) => set({ onlineUsers: ids }),

  typingUser: null,
  setTypingUser: (user) => set({ typingUser: user }),

  onUserStatus: (cb) => {
    const socket = get().socket;
    socket?.off('userStatus', cb).on('userStatus', cb);
    return () => socket?.off('userStatus', cb);
  },

  joinChat: (chatId, userId?: string) => {
    get().socket?.emit('joinChat', { chatId, userId });
  },

  sendMessage: (msg) => {
    get().socket?.emit('sendMessage', { chatId: msg.chatId, message: msg });
  },

  sendTyping: (chatId, user) => {
    get().socket?.emit('userTyping', { chatId, user });
  },

  onMessage: (cb) => {
    const socket = get().socket;
    socket?.off('newMessage', cb).on('newMessage', cb);
    return () => socket?.off('newMessage', cb);
  },

  clearTypingUser: () => set({ typingUser: null }),

  onTyping: (cb) => {
  const socket = get().socket;
  const handler = (data: { chatId: string; user: any }) => {
    set({ typingUser: data.user }); // set in store
    cb(data);
  };
  socket?.off('userTyping', handler).on('userTyping', handler);
  return () => socket?.off('userTyping', handler);
},

  onSeen: (cb) => {
    const socket = get().socket;
    socket?.off('messageSeen', cb).on('messageSeen', cb);
    return () => socket?.off('messageSeen', cb);
  },
}));
