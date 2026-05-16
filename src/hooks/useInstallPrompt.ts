"use client";

// ── useInstallPrompt — Phase 15 ───────────────────────────────────────────────
// Captures the BeforeInstallPromptEvent and exposes a trigger function.
// Dismissal is persisted to localStorage so we don't re-nag the user.
//
// NOTE: BeforeInstallPromptEvent is a non-standard Chrome/Android API.
// It is intentionally not available on iOS Safari or Firefox.
// On unsupported browsers, `canInstall` stays false and nothing renders.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";

const DISMISSED_KEY = "maqar-install-prompt-dismissed";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

export interface InstallPromptState {
  canInstall: boolean;
  isDismissed: boolean;
  trigger: () => Promise<"accepted" | "dismissed" | "unavailable">;
  dismiss: () => void;
}

export function useInstallPrompt(): InstallPromptState {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(DISMISSED_KEY) === "1";
  });

  useEffect(() => {
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault(); // Prevent Chrome auto-prompt
      setPromptEvent(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const trigger = useCallback(async (): Promise<"accepted" | "dismissed" | "unavailable"> => {
    if (!promptEvent) return "unavailable";
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    setPromptEvent(null); // Can only be used once
    if (outcome === "accepted") {
      setIsDismissed(true);
      localStorage.setItem(DISMISSED_KEY, "1");
    }
    return outcome;
  }, [promptEvent]);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISSED_KEY, "1");
    }
  }, []);

  return {
    canInstall: promptEvent !== null && !isDismissed,
    isDismissed,
    trigger,
    dismiss,
  };
}
