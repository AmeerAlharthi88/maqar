"use client";

// ── OfflineBanner — Phase 15 ──────────────────────────────────────────────────
// Appears as a fixed top banner when the device goes offline.
// Automatically hides when connectivity restores.
// ─────────────────────────────────────────────────────────────────────────────

import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface OfflineBannerProps {
  /** Where to render the banner — defaults to "top" */
  position?: "top" | "bottom";
}

export function OfflineBanner({ position = "top" }: OfflineBannerProps) {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  const posClass =
    position === "top"
      ? "top-0 left-0 right-0"
      : "bottom-0 left-0 right-0";

  return (
    <div
      role="status"
      aria-live="assertive"
      className={`fixed ${posClass} z-[200] bg-[#1E1E1E] text-white px-4 py-2 flex items-center justify-center gap-2 text-xs font-semibold`}
      style={{ paddingTop: position === "top" ? "max(8px, env(safe-area-inset-top))" : "8px" }}
    >
      {/* WiFi-off icon */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden="true"
      >
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" strokeLinecap="round" />
      </svg>
      أنت غير متصل بالإنترنت — بعض الميزات محدودة
    </div>
  );
}
