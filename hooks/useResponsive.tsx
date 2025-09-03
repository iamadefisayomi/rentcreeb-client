"use client";

import { useSyncExternalStore } from "react";

const getSnapshot = () => (window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop");

export default function useResponsive(): "mobile" | "desktop" {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    getSnapshot,
    () => "desktop" // Default value for SSR
  );
}
