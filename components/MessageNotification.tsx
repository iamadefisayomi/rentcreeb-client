'use client';

import { useEffect, useState, useRef } from 'react';
import { getUnreadMessagesGrouped } from '@/actions/chat';
import { Mails } from 'lucide-react';
import Link from 'next/link';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useSocketStore } from '@/contexts/socketStore';
import { useRouter } from 'next/navigation';
import useAlert from '@/hooks/useAlert';

type UnreadGrouped = {
  chatId: string;
  senderId: string;
  senderName: string;
  count: number;
};

export default function MessageNotification() {
  const [unreadMessages, setUnreadMessages] = useState<UnreadGrouped[]>([]);
  const socket = useSocketStore((s) => s.socket);
  const router = useRouter();
  const prevUnreadRef = useRef<UnreadGrouped[]>([]);

  const { setAlert } = useAlert();

  // Fetch initial unread messages
  useEffect(() => {
    const loadUnread = async () => {
      try {
        const res = await getUnreadMessagesGrouped();
        setUnreadMessages(res);
        prevUnreadRef.current = res;
      } catch (err) {
        console.error('Failed to fetch unread messages:', err);
      }
    };
    loadUnread();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleUnreadUpdate = (data: UnreadGrouped[]) => {
      data.forEach((msg) => {
        const prev = prevUnreadRef.current.find((p) => p.chatId === msg.chatId);
        const prevCount = prev?.count || 0;

        if (msg.count > prevCount) {
          // New message arrived → show toast
          setAlert(
            <div className="flex flex-col">
              <span className="font-semibold">{msg.senderName}</span>
              <span>
                {msg.count - prevCount} new message{msg.count - prevCount > 1 ? 's' : ''}
              </span>
              <Link
                href={`/messages/${msg.chatId}`}
                className="text-blue-600 underline mt-1"
              >
                View
              </Link>
            </div>,
            'info'
          );
        }
      });

      setUnreadMessages(data);
      prevUnreadRef.current = data;
    };

    socket.on('unread:updated', handleUnreadUpdate);

    return () => {
      socket.off('unread:updated', handleUnreadUpdate);
    };
  }, [socket, setAlert]);

  const unreadCount = unreadMessages.reduce((sum, msg) => sum + msg.count, 0);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          className="relative"
          onClick={() => router.push('/messages')}
        >
          <Mails className="text-primary w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </HoverCardTrigger>

      <HoverCardContent className="w-80 p-3 text-sm">
        {unreadCount === 0 ? (
          <p className="text-muted-foreground text-xs">No new messages</p>
        ) : (
          <div className="space-y-2">
            {unreadMessages.map((msg) => (
              <Link
                key={msg.chatId}
                href={`/messages/${msg.chatId}`}
                className="block hover:underline text-blue-600"
              >
                You have {msg.count} unread message{msg.count > 1 ? 's' : ''} from{' '}
                {msg.senderName}
              </Link>
            ))}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}