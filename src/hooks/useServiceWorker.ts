"use client";

// ── useServiceWorker — Phase 15 ───────────────────────────────────────────────
// Registers the service worker and tracks update availability.
// Only runs in production or when NEXT_PUBLIC_APP_ENV !== "development".
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

export interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  updateAvailable: boolean;
  applyUpdate: () => void;
}

export function useServiceWorker(): ServiceWorkerState {
  const [isRegistered, setIsRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  const isSupported = typeof window !== "undefined" && "serviceWorker" in navigator;

  useEffect(() => {
    if (!isSupported) return;

    // Allow SW in all environments — developer can toggle via NEXT_PUBLIC_APP_ENV
    // Skip only if explicitly set to "development" and on localhost
    const isDev =
      process.env.NEXT_PUBLIC_APP_ENV === "development" &&
      window.location.hostname === "localhost";

    if (isDev) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        setIsRegistered(true);

        // New SW waiting to activate
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setUpdateAvailable(true);
        }

        // SW installed and now waiting
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setUpdateAvailable(true);
            }
          });
        });

        // Periodic update check every 60 minutes
        const interval = setInterval(() => {
          registration.update().catch(() => {
            // Silently ignore — network may be offline
          });
        }, 60 * 60 * 1000);

        return () => clearInterval(interval);
      })
      .catch((err) => {
        // Non-fatal — app works without SW
        console.warn("[SW] Registration failed:", err);
      });

    // Reload page after the new SW takes control
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }, [isSupported]);

  const applyUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
  }, [waitingWorker]);

  return {
    isSupported,
    isRegistered,
    updateAvailable,
    applyUpdate,
  };
}
