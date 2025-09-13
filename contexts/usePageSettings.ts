"use client";
import { create } from "zustand";
import Cookies from "js-cookie";

type PageView = "grid" | "list";

interface PageSettingsState {
  pageViewStyle: PageView;
  setPageViewStyle: (view: PageView) => void;
}

const COOKIE_KEY = "pageViewStyle";
const DEFAULT_VIEW: PageView = "list";
const EXPIRES_DAYS = 100; // store for 100 days

const usePageSettings = create<PageSettingsState>((set) => {
  let initialView: PageView = DEFAULT_VIEW;

  if (typeof window !== "undefined") {
    const savedView = Cookies.get(COOKIE_KEY) as PageView | undefined;

    if (window.innerWidth < 768) {
      // Mobile: force default to grid
      initialView = savedView || "grid";
    } else {
      // Desktop: fall back to cookie or list
      initialView = savedView || DEFAULT_VIEW;
    }
  }

  return {
    pageViewStyle: initialView,
    setPageViewStyle: (view) => {
      Cookies.set(COOKIE_KEY, view, {
        expires: EXPIRES_DAYS,
        path: "/",
      });
      set({ pageViewStyle: view });
    },
  };
});

export default usePageSettings;
