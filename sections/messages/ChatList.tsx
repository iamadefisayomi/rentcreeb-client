'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, CheckCheck } from 'lucide-react';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { useSocketStore } from '@/contexts/socketStore';
import { getCleanPath } from './_getCleanPath';

// ✅ Skeleton loader for a chat item
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

// ✅ Individual chat item
function ChatItem({
  chat,
  currentChatId,
  currentUserId,
  onlineUsers,
  typingUser,
}: {
  chat: any;
  currentChatId: string;
  currentUserId: string;
  onlineUsers: string[];
  typingUser: any;
}) {
  const otherUser = chat.participants.find((p: any) => p._id !== currentUserId);
  const property = chat.propertyId;
  const chatId = chat._id;
  const lastMessage = chat.lastMessage;
  // const pathname = getCleanPath(usePathname())
  const pathname = usePathname()
  const url = getCleanPath(pathname)



  return (
   <Link href={`${url}/${chatId}`} key={chatId}>
      <div
        className={cn(
          "flex gap-3 items-center justify-between p-2 hover:bg-slate-100 rounded-lg cursor-pointer w-full overflow-hidden",
          (currentChatId === chatId || currentChatId === property?._id) && "bg-slate-100"
        )}
      >
        {/* Avatar + User Info */}
        <div className="flex-grow flex items-center gap-2 overflow-hidden">
          <div className="relative rounded-full shrink-0">
            <Avatar className="border-2 border-white size-14">
              <AvatarImage src={otherUser?.image || ""} className="object-cover" />
              <AvatarFallback className="uppercase text-md font-medium">
                {otherUser?.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "w-[12px] h-[12px] rounded-full absolute right-0 bottom-[2px] border-2 border-white",
                onlineUsers.includes(otherUser?._id) ? "bg-green-500" : "bg-primary"
              )}
            />
          </div>

          {/* Name, Property Title, Last Message */}
          <div className="flex flex-col min-w-0"> 
            <h4 className="text-[11px] font-medium capitalize truncate">
              {otherUser?.name}
            </h4>
            <p className="text-[10px] text-gray-600 font-semibold truncate">
              {property?.title || ""}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {typingUser?.id === otherUser._id
                ? `${typingUser?.name.split(" ")[0]} is typing...`
                : (lastMessage?.content || "Start chatting...")}
            </p>
          </div>
        </div>

        {/* Time + Seen Status */}
        <div className="flex flex-col items-end shrink-0 text-[10px] text-muted-foreground">
          <p className="truncate max-w-[50px]">
            {dayjs(lastMessage?.createdAt || chat.createdAt).format("h:mm A")}
          </p>
          {lastMessage?.status === "seen" ? (
            <CheckCheck className="text-primary w-3" />
          ) : (
            <Check className="text-muted-foreground w-3" />
          )}
        </div>
      </div>
    </Link>

  );
}

// ✅ Main ChatList
export default function ChatList({
  userChats,
  currentUserId,
  loading = false,
}: {
  userChats: any[];
  currentUserId: string;
  loading?: boolean;
}) {
  const pathname = usePathname();
  const currentChatId = pathname.split("/").pop();

  const [chats, setChats] = useState(userChats);
  const { onUserStatus, onlineUsers, setOnlineUsers, onMessage, typingUser } = useSocketStore();

  const userSetRef = useRef(new Set<string>());

  // Track online/offline status
  useEffect(() => {
    const unsubscribe = onUserStatus(({ userId, status }) => {
      if (status === "online") userSetRef.current.add(userId);
      else userSetRef.current.delete(userId);
      setOnlineUsers(Array.from(userSetRef.current));
    });

    return () => unsubscribe();
  }, [currentChatId]);

  // Listen for new messages
  useEffect(() => {
    const unsubscribe = onMessage((message) => {
      setChats((prevChats: any[]) => {
        const chatIndex = prevChats.findIndex(chat => chat._id === message.chatId);
        if (chatIndex === -1) return prevChats;

        const updatedChats = [...prevChats];
        const updatedChat = { ...updatedChats[chatIndex], lastMessage: message };

        updatedChats.splice(chatIndex, 1);
        updatedChats.unshift(updatedChat);

        return updatedChats;
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full flex flex-grow flex-col gap-1 overflow-y-auto">
      {loading
        ? Array.from({ length: 5 }).map((_, i) => <ChatItemSkeleton key={i} />)
        : chats.map(chat => (
            <ChatItem
              key={chat._id}
              chat={chat}
              currentChatId={currentChatId!}
              currentUserId={currentUserId}
              onlineUsers={onlineUsers}
              typingUser={typingUser}
            />
          ))}
    </div>
  );
}