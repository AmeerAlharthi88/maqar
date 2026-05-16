"use client";

// ── NewVersionAvailableBanner — Phase 15 ─────────────────────────────────────
// Appears at the top when a new service worker version is waiting to activate.
// User can dismiss (ignore) or tap "تحديث" to reload with the new version.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

interface NewVersionAvailableBannerProps {
  onUpdate: () => void;
}

export function NewVersionAvailableBanner({ onUpdate }: NewVersionAvailableBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-[210] bg-[#C65D3B] text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs"
      style={{ paddingTop: "max(10px, env(safe-area-inset-top))" }}
    >
      <span className="font-medium">🚀 إصدار جديد متاح من مقر</span>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onUpdate}
          className="bg-white text-[#C65D3B] font-bold px-3 py-1 rounded-lg text-[11px] min-h-[32px]"
          aria-label="تحديث التطبيق الآن"
        >
          تحديث
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/70 hover:text-white px-1 py-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
          aria-label="تجاهل التحديث"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
