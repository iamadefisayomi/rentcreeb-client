'use client';

import { getMessages } from '@/actions/chat';
import { useEffect, useState } from 'react';

export function useMessages(chatId: string) {
  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = async () => {
    const data = await getMessages(chatId);
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [chatId]);

  return {
    messages,
    refresh: fetchMessages,
  };
}
