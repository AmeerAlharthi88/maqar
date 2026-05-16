"use client";

// ── useOnlineStatus — Phase 15 ────────────────────────────────────────────────
// Tracks navigator.onLine with live event listeners.
// SSR-safe: defaults to true (assume online) on server.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    // SSR guard — navigator is browser-only
    if (typeof navigator === "undefined") return true;
    return navigator.onLine;
  });

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
