"use client";

// ── PWAInstallCard — Phase 15 ─────────────────────────────────────────────────
// Card-style install prompt — used in settings/profile pages.
// Shows iOS manual instructions if BeforeInstallPromptEvent is not available.
// ─────────────────────────────────────────────────────────────────────────────

import { useInstallPrompt } from "@/hooks/useInstallPrompt";

// Detect iOS (no standard install prompt support)
function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function PWAInstallCard() {
  const { canInstall, isDismissed, trigger } = useInstallPrompt();
  const ios = isIOS();

  // On Chromium: show only if prompt is available and not dismissed
  // On iOS: always show manual instructions (unless already standalone)
  const isStandalone =
    typeof window !== "undefined" &&
    window.matchMedia("(display-mode: standalone)").matches;

  if (isStandalone) return null; // Already installed
  if (!ios && !canInstall && isDismissed) return null;

  if (ios) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4" dir="rtl">
        <p className="text-sm font-bold text-[#102A43] mb-2">
          📱 أضف مقر إلى الشاشة الرئيسية
        </p>
        <p className="text-xs text-[#627D98] mb-3">
          للحصول على تجربة التطبيق الكاملة على iPhone:
        </p>
        <ol className="space-y-2 text-xs text-[#627D98] list-none">
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0A3C36]">١.</span>
            اضغط على أيقونة المشاركة{" "}
            <span aria-label="أيقونة المشاركة">⬆️</span> في متصفح Safari
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0A3C36]">٢.</span>
            اختر «إضافة إلى الشاشة الرئيسية»
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#0A3C36]">٣.</span>
            اضغط «إضافة» للتأكيد
          </li>
        </ol>
      </div>
    );
  }

  if (!canInstall) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4" dir="rtl">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#0A3C36] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-base">م</span>
        </div>
        <div>
          <p className="text-sm font-bold text-[#102A43]">ثبّت تطبيق مقر</p>
          <p className="text-xs text-[#627D98]">وصول سريع · يعمل بدون إنترنت</p>
        </div>
      </div>
      <button
        onClick={trigger}
        className="w-full py-3 rounded-xl bg-[#0A3C36] text-white text-sm font-bold min-h-[44px]"
        aria-label="تثبيت تطبيق مقار"
      >
        تثبيت التطبيق
      </button>
    </div>
  );
}
