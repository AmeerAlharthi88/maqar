"use client";

// ── ConnectionStatusIndicator — Phase 15 ─────────────────────────────────────
// Compact dot/label indicator for use in headers, drawers, or nav bars.
// Shows nothing when online (to avoid visual noise).
// ─────────────────────────────────────────────────────────────────────────────

import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface ConnectionStatusIndicatorProps {
  /** When true, shows "متصل" label alongside the dot when online */
  showOnlineLabel?: boolean;
  className?: string;
}

export function ConnectionStatusIndicator({
  showOnlineLabel = false,
  className = "",
}: ConnectionStatusIndicatorProps) {
  const isOnline = useOnlineStatus();

  if (isOnline && !showOnlineLabel) return null;

  return (
    <span
      role="status"
      aria-label={isOnline ? "متصل بالإنترنت" : "غير متصل"}
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isOnline ? "bg-[#4CAF50]" : "bg-[#E5BA73] animate-pulse"
        }`}
        aria-hidden="true"
      />
      <span className={`text-[10px] font-semibold ${isOnline ? "text-[#4CAF50]" : "text-[#627D98]"}`}>
        {isOnline ? "متصل" : "غير متصل"}
      </span>
    </span>
  );
}
