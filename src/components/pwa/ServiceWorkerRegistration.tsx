"use client";

// ── ServiceWorkerRegistration — Phase 15 ─────────────────────────────────────
// Mount this once inside AppProviders. It:
//   1. Registers /sw.js silently
//   2. Syncs isOnline to the offline store
//   3. Exposes updateAvailable for NewVersionAvailableBanner
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useOfflineStore } from "@/store/offline.store";
import { NewVersionAvailableBanner } from "./NewVersionAvailableBanner";

export function ServiceWorkerRegistration() {
  const { updateAvailable, applyUpdate } = useServiceWorker();
  const isOnline = useOnlineStatus();
  const setOnline = useOfflineStore((s) => s.setOnline);

  // Keep offline store in sync with real network status
  useEffect(() => {
    setOnline(isOnline);
  }, [isOnline, setOnline]);

  return (
    <>
      {updateAvailable && (
        <NewVersionAvailableBanner onUpdate={applyUpdate} />
      )}
    </>
  );
}
