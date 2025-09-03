'use client';

import { useEffect } from 'react';
import { useSocketStore } from './socketStore';

export default function SocketInitializer() {
  const connect = useSocketStore((s) => s.connect);

  useEffect(() => {
    connect(); // Connect on mount

    return () => {
      useSocketStore.getState().disconnect(); // Disconnect on unmount
    };
  }, [connect]);

  return null; // No UI
}
