"use client";

import { cn } from "@/lib/utils";

// ── Map loading skeleton ───────────────────────────────────────────────────────

export function MapLoadingState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full h-full bg-[#F0F4F8] flex flex-col items-center justify-center gap-4",
        className
      )}
      aria-busy="true"
      aria-label="جارٍ تحميل الخريطة"
    >
      {/* Animated map grid */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-xl bg-[#E2E8F0] animate-pulse-brand" />
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#627D98"
            strokeWidth="1.5"
          >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
        </div>
      </div>
      <p className="text-sm text-[#627D98] font-medium">جارٍ تحميل الخريطة...</p>
      {/* Shimmer tiles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-[#E2E8F0] rounded animate-pulse-brand"
            style={{
              width: `${60 + (i % 3) * 20}px`,
              height: `${60 + (i % 4) * 15}px`,
              top: `${(Math.floor(i / 3) * 30) % 100}%`,
              left: `${(i % 3) * 33}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── No results empty state ─────────────────────────────────────────────────────

export function MapEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <div
      className="fixed inset-x-0 z-[65] flex items-end justify-center pointer-events-none"
      style={{ bottom: "calc(64px + env(safe-area-inset-bottom, 0px))", top: "120px" }}
    >
      <div className="pointer-events-auto mx-4 mb-4 bg-white rounded-2xl shadow-elevated border border-[#E2E8F0] p-6 text-center max-w-xs w-full">
        <div className="w-14 h-14 rounded-full bg-[#F0F4F8] flex items-center justify-center mx-auto mb-4">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#627D98"
            strokeWidth="1.5"
          >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-[#102A43] mb-1">
          لا توجد عقارات في هذه المنطقة
        </h3>
        <p className="text-xs text-[#627D98] mb-4">
          جرّب تغيير الفلاتر أو توسيع نطاق البحث
        </p>
        {onReset && (
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl bg-[#0A3C36] text-white text-xs font-semibold hover:bg-[#082E29] transition-colors"
          >
            مسح الفلاتر
          </button>
        )}
      </div>
    </div>
  );
}

// ── Location denied toast ──────────────────────────────────────────────────────

export function MapLocationDeniedToast({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  return (
    <div
      className="fixed left-3 right-3 z-[80] animate-slide-up"
      style={{ bottom: "calc(80px + env(safe-area-inset-bottom, 0px))" }}
      role="alert"
    >
      <div className="bg-[#102A43] text-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-elevated">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
            <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
          </svg>
        </div>
        <p className="flex-1 text-sm">
          لم يتم السماح بالوصول إلى الموقع. يمكنك تغيير الإذن من إعدادات المتصفح.
        </p>
        <button
          onClick={onDismiss}
          aria-label="إغلاق"
          className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Map unavailable error ──────────────────────────────────────────────────────

export function MapErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="w-full h-full bg-[#F8F9FA] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-[#FEF0EE] flex items-center justify-center">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C0392B"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <h3 className="text-base font-semibold text-[#102A43] mb-1">
          تعذّر تحميل الخريطة
        </h3>
        <p className="text-sm text-[#627D98]">
          تحقق من اتصالك بالإنترنت وحاول مرة أخرى
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-6 py-3 rounded-xl bg-[#0A3C36] text-white text-sm font-semibold hover:bg-[#082E29] transition-colors"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}

// ── No selected listing placeholder (map mode, no marker tapped) ───────────────

export function MapNoSelectionHint() {
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[62] pointer-events-none"
      style={{ bottom: "calc(76px + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="bg-[#102A43]/75 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap">
        اضغط على أي عقار لعرض تفاصيله
      </div>
    </div>
  );
}
