"use client";

import { useEffect } from "react";
import { useOfflineStore } from "@/store/offline.store";

export function useOfflineStatus() {
  const { isOnline, setOnline } = useOfflineStore();

  useEffect(() => {
    function onOnline()  { setOnline(true); }
    function onOffline() { setOnline(false); }

    setOnline(navigator.onLine);
    window.addEventListener("online",  onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online",  onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [setOnline]);

  return isOnline;
}
