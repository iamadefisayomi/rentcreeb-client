'use client';

import { useState, useEffect, useRef } from 'react';
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
import { MessageProps } from '@/server/schema/Message';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

type ChatUser = {
  id: string;
  name: string;
};

export default function ChatWindow({
  chatId,
  user,
  messages: initialMessages,
}: {
  chatId: string;
  user: ChatUser;
  messages: any[];
}) {
  const userId = user.id;
  const [text, setText] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [sender, setSender] = useState<any>(null);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  const { sendMessage: emitSocketMessage, onMessage, onSeen, onTyping, joinChat, sendTyping } = useSocketStore();

useEffect(() => {
  joinChat(chatId, userId);

  markAsSeen(chatId, userId);

  const handleNewMessage = (msg: MessageProps) => {
    if (msg.chatId === chatId) {
      setMessages((prev) => [...prev, msg]);
      markAsSeen(chatId, userId); // ✅ Again on new messages
    }
  };

  const handleSeen = ({ chatId: seenChatId, userId: seenUserId }: any) => {
    if (seenChatId === chatId) {
      setMessages((prev) =>
        prev.map((msg) => {
          if (
            msg.sender?._id !== seenUserId &&
            !msg.seenBy?.some((s: any) => s.userId === seenUserId)
          ) {
            return {
              ...msg,
              seenBy: [...(msg.seenBy || []), { userId: seenUserId, seenAt: new Date() }],
              status: 'seen',
            };
          }
          return msg;
        })
      );
    }
  };

  const handleTyping = ({ chatId: typingId }: any) => {
    if (typingId !== userId) {
      setTypingUser(typingId);
      setTimeout(() => setTypingUser(null), 2000);
    }
  };

  const offMessage = onMessage(handleNewMessage);
  const offSeen = onSeen(handleSeen);
  const offTyping = onTyping(handleTyping);

  return () => {
    offMessage?.();
    offSeen?.();
    offTyping?.();
  };
}, [chatId, userId]);



  useEffect(() => {
  if (messagesEndRef.current) {
    requestAnimationFrame(() => {
      messagesEndRef.current!.scrollIntoView({ behavior: 'smooth' });
    });
  }
}, [messages]);

  useEffect(() => {
  const other = messages.find((m) => m.sender?._id !== userId)?.sender;
  if (other) setSender(other);
}, [messages, userId]);

  const handleSend = async () => {
  if (!text.trim()) return;
  const newMsg = (await sendServerMessage({ chatId, content: text })).message;
  emitSocketMessage(newMsg); 
  setText('');
};

  const handleTyping = () => {
    sendTyping(chatId, user);
  };

  return (
    <div className="w-full flex flex-col justify-between h-full overflow-hidden">
      <div className="w-full flex items-center gap-2 border-b p-3">
        <Avatar className="w-[50px] h-[50px] border-2 border-white">
          <AvatarImage src={sender?.image || ""} className="object-cover w-full h-full" />
          <AvatarFallback className="uppercase text-sm">
            {sender?.name?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col flex-grow">
          <h4 className="text-[11px] font-medium">{sender?.name}</h4>
          <p className="text-[10px] text-muted-foreground">
            {typingUser ? "typing..." : "online"}
          </p>
        </div>

        <Button size='icon' variant='ghost' className='rounded-full'>
          <Search className="w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className='w-full overflow-y-auto py-4 overflow-x-hidden' style={{ flex: 1 }}>
        {messages.map((msg: MessageProps, index: number) => {
          const currentDate = dayjs(msg.createdAt);
          const prevMsg = messages[index - 1];
          const prevDate = prevMsg ? dayjs(prevMsg.createdAt) : null;
          const shouldShowLabel = !prevDate || !currentDate.isSame(prevDate, 'day');

          return (
            <div key={msg._id as string} className="w-full relative">
              {shouldShowLabel && (
                <LabelSeparator
                  className="text-[10px] capitalize text-muted-foreground"
                  label={getSmartLabel(currentDate)}
                />
              )}

              <div
                className={cn(
                  'p-2 flex items-start w-full gap-1',
                  msg?.sender?._id === userId
                    ? 'self-end flex-row-reverse mr-2'
                    : 'ml-2'
                )}
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={msg.sender?.image || ""} alt={msg.sender?.name || "User"} className='w-full h-full object-cover'/>
                  <AvatarFallback className="uppercase text-sm text-primary font-semibold">
                    {(() => {
                      const isCurrentUser = msg?.sender?._id?.toString() === userId?.toString();
                      const name = isCurrentUser ? user?.name : msg?.sender?.name;
                      return name ? name.slice(0, 2) : "NA";
                    })()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-1">
                  {msg.content && (
                    <p
                      className={cn(
                        "py-2 px-3 bg-slate-100 text-[11px] text-gray-800 rounded-lg animate-fadeIn",
                        msg.sender?._id === userId ? "rounded-tr-none" : "rounded-tl-none"
                      )}
                    >
                      {msg.content}
                    </p>
                  )}

                  <div className="flex items-center gap-1 text-[9px] text-gray-600">
                    <p>{dayjs(msg.createdAt).format("h:mm A")}</p>
                    {msg.sender?._id === userId && msg.status === 'seen' ? (
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    ) : msg.sender?._id === userId && msg.status === 'sent' ? (<Check className="w-3 h-3 text-muted-foreground" />) : ''}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSend} text={text} setText={setText} onTyping={handleTyping} />
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
