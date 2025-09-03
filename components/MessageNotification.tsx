'use client';

import { useEffect, useState } from 'react';
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

type UnreadGrouped = {
  chatId: string;
  senderId: string;
  senderName: string;
  count: number;
};

export default function MessageNotification() {
  const [unreadMessages, setUnreadMessages] = useState<UnreadGrouped[]>([]);
  const socket = useSocketStore((s) => s.socket);
  const router = useRouter()

  // Fetch on mount
  useEffect(() => {
    const load = async () => {
      const res = await getUnreadMessagesGrouped();
      setUnreadMessages(res);
    };
    load();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleUnreadUpdate = (data: UnreadGrouped[]) => {
      setUnreadMessages(data);
    };

    socket.on('unread:updated', handleUnreadUpdate);

    return () => {
      socket.off('unread:updated', handleUnreadUpdate);
    };
  }, [socket]);

  const unreadCount = unreadMessages.reduce((sum, msg) => sum + msg.count, 0);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button onClick={() => router.push('/messages')}>
          <Mails className="text-primary w-5" />
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
