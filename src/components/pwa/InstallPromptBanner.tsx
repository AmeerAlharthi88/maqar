"use client";

// ── InstallPromptBanner — Phase 15 ───────────────────────────────────────────
// Dismissible bottom banner prompting PWA installation.
// Only renders on browsers that fire BeforeInstallPromptEvent (Chromium/Android).
// iOS users see nothing — Apple doesn't support the event.
// ─────────────────────────────────────────────────────────────────────────────

import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallPromptBanner() {
  const { canInstall, trigger, dismiss } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div
      role="complementary"
      aria-label="تثبيت تطبيق مقر"
      className="fixed bottom-0 left-0 right-0 z-[190] bg-white border-t border-[#F0EBE3] px-4 py-3 flex items-center gap-3"
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      {/* App icon placeholder */}
      <div className="w-12 h-12 rounded-xl bg-[#C65D3B] flex items-center justify-center flex-shrink-0">
        <span className="text-white text-lg font-bold">م</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#1E1E1E]">ثبّت تطبيق مقر</p>
        <p className="text-[11px] text-[#7A6B5E]">وصول سريع وتجربة أفضل</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={dismiss}
          className="text-[#A89480] text-xs px-2 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="تجاهل"
        >
          ✕
        </button>
        <button
          onClick={trigger}
          className="bg-[#C65D3B] text-white text-xs font-bold px-4 py-2.5 rounded-xl min-h-[44px]"
          aria-label="تثبيت التطبيق"
        >
          تثبيت
        </button>
      </div>
    </div>
  );
}
