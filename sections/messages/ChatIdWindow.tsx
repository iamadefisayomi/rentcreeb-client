'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { sendMessage as sendServerMessage, markAsSeen } from '@/actions/chat';
import MessageInput from './MessageInput';
import { LabelSeparator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, CheckCheck, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocketStore } from '@/contexts/socketStore';
import dayjs from "dayjs";
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MessageProps, SeenEntry } from '@/server/schema/Message';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

type ChatUser = {
  id: string;
  name: string;
  image?: string;
};

export default function ChatIdWindow({
  chatId,
  user,
  messages: initialMessages,
}: {
  chatId: string;
  user: ChatUser;
  messages: MessageProps[];
}) {
  const userId = user?.id;

  const [text, setText] = useState('');
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const {
    sendMessage: emitSocketMessage,
    onMessage,
    onSeen,
    onTyping,
    onUserStatus,
    joinChat,
    sendTyping,
    onlineUsers,
    setOnlineUsers
  } = useSocketStore();

  // Determine chat partner (someone not current user)
  const chatPartner = useMemo(() => {
    if (!messages.length) return null;
    const firstMsg = messages[0];
    return firstMsg.sender._id !== userId ? firstMsg.sender : firstMsg.receiver;
  }, [messages, userId]);

  // Socket listeners
  useEffect(() => {
    joinChat(chatId, userId);
    markAsSeen(chatId, userId);

    const handleNewMessage = (msg: MessageProps) => {
      if (msg.chatId !== chatId) return;
      setMessages(prev => [...prev, msg]);
      markAsSeen(chatId, userId);
    };

    const handleSeen = ({ chatId: seenChatId, userId: seenUserId }: any) => {
      if (seenChatId !== chatId) return;
      setMessages(prev =>
        prev.map(msg => {
          if (msg.sender?._id === userId && !msg.seenBy?.some(s => s.userId === seenUserId)) {
            return { ...msg, seenBy: [...(msg.seenBy || []), { userId: seenUserId }], status: 'seen' } as MessageProps;
          }
          return msg;
        })
      );
    };

    const handleTyping = ({
        chatId: typingChatId,
        user,
      }: {
        chatId: string;
        user: { id: string; name?: string };
      }) => {
        if (typingChatId !== chatId || user.id === userId) return;

        setTypingUser(user.name ?? "Someone");

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2000);
      };

    const handleUserStatus = ({
        userId: changedUserId,
        status,
      }: {
        userId: string;
        status: "online" | "offline";
      }) => {
        const currentUsers = onlineUsers ?? [];

        if (status === "online" && !currentUsers.includes(changedUserId)) {
          setOnlineUsers([...currentUsers, changedUserId]);
        }

        if (status === "offline") {
          setOnlineUsers(currentUsers.filter((id) => id !== changedUserId));
        }
      };

    const offMessage = onMessage(handleNewMessage);
    const offSeen = onSeen(handleSeen);
    const offTyping = onTyping(handleTyping);
    const offStatus = onUserStatus(handleUserStatus);

    return () => {
      offMessage?.();
      offSeen?.();
      offTyping?.();
      offStatus?.();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [chatId, userId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
    const handleSend = async () => {
      if (!text.trim()) return;

      const res = await sendServerMessage({ chatId, content: text });
      if (!res?.message) return;

      const newMsg = res.message as unknown as MessageProps;

      emitSocketMessage(newMsg);
      setMessages((prev) => [...prev, newMsg]);
      setText('');
    };

  // Emit typing
  const handleTyping = () => {
    sendTyping(chatId, user);
  };

  const isOnline =
  chatPartner?._id &&
  onlineUsers.includes(chatPartner._id.toString());

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-3 border-b flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={chatPartner?.image || ""} className="object-cover" />
            <AvatarFallback>{chatPartner?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-xs font-medium">{chatPartner?.name || "User"}</h4>
            <p className="text-[10px] text-muted-foreground">
              {typingUser ? `${typingUser} typing...` : isOnline ? "online" : "offline"}
            </p>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Search className="w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, index) => {
          const currentDate = dayjs(msg.createdAt);
          const prevMsg = messages[index - 1];
          const prevDate = prevMsg ? dayjs(prevMsg.createdAt) : null;
          const shouldShowLabel = !prevDate || !currentDate.isSame(prevDate, 'day');

          return (
            <div key={msg._id as string} className='relative'>
              {shouldShowLabel && (
                <LabelSeparator className="text-[10px]" label={getSmartLabel(currentDate)} />
              )}
              <div className={cn('flex items-start gap-2', msg.sender?._id === userId ? 'flex-row-reverse' : '')}>
                <Avatar className="w-7 h-7">
                  <AvatarImage src={msg.sender?.image || ""} />
                  <AvatarFallback>{msg.sender?.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col max-w-[70%]">
                  <p className={cn("py-2 px-3 bg-white text-[12px] rounded-lg shadow-sm", msg.sender?._id === userId ? "rounded-tr-none bg-blue-100" : "rounded-tl-none")}>
                    {msg.content}
                  </p>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span>{dayjs(msg.createdAt).format("h:mm A")}</span>
                    {msg.sender?._id === userId && msg.status === 'seen' && (
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    )}
                    {msg.sender?._id === userId && msg.status === 'sent' && (
                      <Check className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t bg-white">
        <MessageInput onSend={handleSend} text={text} setText={setText} onTyping={handleTyping} />
      </div>
    </div>
  );
}

const getSmartLabel = (date: dayjs.Dayjs): string => {
  if (date.isToday()) return 'Today';
  if (date.isYesterday()) return 'Yesterday';
  const daysAgo = dayjs().diff(date, 'day');
  if (daysAgo <= 7) return `${daysAgo} days ago`;
  return date.format('MMMM D, YYYY');
};