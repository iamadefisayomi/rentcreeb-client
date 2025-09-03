"use client";

import { create } from "zustand";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db, NotificationLogKey } from "@/config";

export type NotificationType = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  timestamp: string;
};

interface NotificationState {
  notifications: NotificationType[];
  fetchUserLogs: (userId: string) => Promise<void>;
  addNotification: (message: string, type: NotificationType["type"]) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  fetchUserLogs: async (userId) => {
    if (!userId) return;

    try {
      const logsRef = collection(db, NotificationLogKey);
      const q = query(logsRef, where("userId", "==", userId), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);

      const logs: NotificationType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        message: doc.data().message,
        type: doc.data().type || "info",
        timestamp: doc.data().timestamp,
      }));

      // Store fetched logs in Zustand state
      set({ notifications: logs });
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  },

  addNotification: (message, type) => {
    const newNotification: NotificationType = {
      id: crypto.randomUUID(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
