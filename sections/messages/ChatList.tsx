'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, CheckCheck } from 'lucide-react';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useSocketStore } from '@/contexts/socketStore';
import { getCleanPath } from './_getCleanPath';

// -----------------------------
// Types
// -----------------------------
type ChatUser = {
  _id: string;
  name: string;
  image?: string;
};

type Message = {
  _id: string;
  chatId: string;
  sender: ChatUser;
  receiver: ChatUser;
  content: string;
  createdAt: string;
  status: 'sent' | 'seen';
};

type Chat = {
  _id: string;
  participants: ChatUser[];
  propertyId?: { _id: string; title: string };
  lastMessage?: Message;
  createdAt: string;
};

// -----------------------------
// Skeleton loader
// -----------------------------
function ChatItemSkeleton() {
  return (
    <div className="flex gap-3 items-center justify-between p-2 w-full">
      <div className="flex-grow flex items-center gap-2">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex flex-col gap-1 w-full">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
      </div>
      <Skeleton className="h-3 w-6 rounded" />
    </div>
  );
}

// -----------------------------
// Chat item
// -----------------------------
function ChatItem({
  chat,
  currentChatId,
  currentUserId,
  onlineUsers,
  typingUser,
}: {
  chat: Chat;
  currentChatId: string;
  currentUserId: string;
  onlineUsers: string[];
  typingUser: { id: string; name: string } | null;
}) {
  const otherUser = chat.participants.find(p => p._id !== currentUserId);
  if (!otherUser) return null;

  const property = chat.propertyId;
  const chatId = chat._id;
  const lastMessage = chat.lastMessage;
  const pathname = usePathname();
  const url = getCleanPath(pathname);

  const isOnline = onlineUsers.includes(otherUser._id);
  const isTyping = typingUser?.id === otherUser._id;

  return (
    <Link href={`${url}/${chatId}`} key={chatId}>
      <div
        className={cn(
          "flex gap-3 items-center justify-between p-2 hover:bg-slate-100 rounded-lg cursor-pointer w-full overflow-hidden",
          currentChatId === chatId && "bg-slate-100"
        )}
      >
        {/* Avatar + Online Dot */}
        <div className="flex-grow flex items-center gap-2 overflow-hidden">
          <div className="relative rounded-full shrink-0">
            <Avatar className="border-2 border-white size-14">
              <AvatarImage src={otherUser.image || ""} className="object-cover" />
              <AvatarFallback className="uppercase text-md font-medium">
                {otherUser.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "w-[12px] h-[12px] rounded-full absolute right-0 bottom-[2px] border-2 border-white",
                isOnline ? "bg-green-500" : "bg-gray-300"
              )}
            />
          </div>

          {/* Name, Property Title, Last Message / Typing */}
          <div className="flex flex-col min-w-0">
            <h4 className="text-[11px] font-medium truncate capitalize">{otherUser.name}</h4>
            <p className="text-[10px] text-gray-600 font-semibold truncate">{property?.title || ""}</p>
            <p className="text-[10px] text-muted-foreground truncate">
              {isTyping
                ? `${typingUser?.name.split(" ")[0]} is typing...`
                : lastMessage?.content || "Start chatting..."}
            </p>
          </div>
        </div>

        {/* Time + Seen Status */}
        <div className="flex flex-col items-end shrink-0 text-[10px] text-muted-foreground">
          <p className="truncate max-w-[50px]">
            {dayjs(lastMessage?.createdAt || chat.createdAt).format("h:mm A")}
          </p>
          {lastMessage?.sender._id === currentUserId ? (
            lastMessage.status === "seen" ? (
              <CheckCheck className="text-blue-500 w-3" />
            ) : (
              <Check className="text-muted-foreground w-3" />
            )
          ) : null}
        </div>
      </div>
    </Link>
  );
}

// -----------------------------
// Chat list
// -----------------------------
export default function ChatList({
  userChats,
  currentUserId,
  loading = false,
}: {
  userChats: Chat[];
  currentUserId: string;
  loading?: boolean;
}) {
  const pathname = usePathname();
  const currentChatId = pathname.split("/").pop() || "";

  const [chats, setChats] = useState<Chat[]>(userChats);
  const { onUserStatus, onlineUsers, setOnlineUsers, onMessage, typingUser } = useSocketStore();

  // Track online/offline users
  useEffect(() => {
    const onlineSet = new Set(onlineUsers);

    const unsubscribe = onUserStatus(({ userId, status }) => {
      if (status === "online") onlineSet.add(userId);
      else onlineSet.delete(userId);

      setOnlineUsers(Array.from(onlineSet));
    });

    return () => unsubscribe();
  }, [onUserStatus, setOnlineUsers]);

  // Listen for new messages
  useEffect(() => {
    const unsubscribe = onMessage((message: Message) => {
      setChats(prevChats => {
        const idx = prevChats.findIndex(chat => chat._id === message.chatId);
        if (idx === -1) return prevChats;

        const updatedChats = [...prevChats];
        updatedChats[idx] = { ...updatedChats[idx], lastMessage: message };

        // Move chat to top
        const [chat] = updatedChats.splice(idx, 1);
        updatedChats.unshift(chat);

        return updatedChats;
      });
    });

    return () => unsubscribe();
  }, [onMessage]);

  return (
    <div className="w-full flex flex-grow flex-col gap-1 overflow-y-auto">
      {loading
        ? Array.from({ length: 5 }).map((_, i) => <ChatItemSkeleton key={i} />)
        : chats.map(chat => (
           <ChatItem
            key={chat._id}
            chat={chat}
            currentChatId={currentChatId}
            currentUserId={currentUserId}
            onlineUsers={onlineUsers}
            typingUser={
              typingUser ? { id: typingUser.id, name: typingUser.name || "Unknown" } : null
            }
          />
          ))}
    </div>
  );
}