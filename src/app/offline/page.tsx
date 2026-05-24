"use client";

// ── Offline Fallback Page — Phase 15 ─────────────────────────────────────────
// Served by the SW when navigation fails due to no connectivity.
// Links to recently-viewed listings so users have something useful to browse.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import { ConnectionStatusIndicator } from "@/components/pwa/ConnectionStatusIndicator";

export default function OfflinePage() {
  const recentItems = useRecentlyViewedStore((s) => s.items).slice(0, 3);

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 text-center bg-[#F8F9FA]" dir="rtl">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-[#E2E8F0] flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2" aria-hidden="true">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="text-xl font-bold text-[#102A43] mb-2">لا يوجد اتصال بالإنترنت</h1>
      <p className="text-sm text-[#627D98] mb-2 max-w-xs">
        تحقق من اتصالك بالإنترنت وحاول مرة أخرى.
      </p>

      {/* Live connection indicator */}
      <div className="mb-6">
        <ConnectionStatusIndicator showOnlineLabel />
      </div>

      {/* Retry button */}
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 rounded-xl bg-[#0A3C36] text-white text-sm font-semibold min-h-[44px] mb-8"
        aria-label="إعادة المحاولة"
      >
        إعادة المحاولة
      </button>

      {/* Recently viewed — cached locally, available offline */}
      {recentItems.length > 0 && (
        <div className="w-full max-w-sm text-right">
          <p className="text-xs font-bold text-[#102A43] mb-3">آخر عقارات شاهدتها</p>
          <div className="space-y-2">
            {recentItems.map((item) => (
              <Link
                key={item.id}
                href={`/listings/${item.id}`}
                className="flex items-center gap-3 bg-white rounded-xl border border-[#E2E8F0] px-3 py-2.5"
              >
                {item.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.coverImage}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#E2E8F0] flex-shrink-0" aria-hidden="true" />
                )}
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs font-semibold text-[#102A43] truncate">{item.titleAr}</p>
                  <p className="text-[10px] text-[#627D98]">{item.areaAr}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sync center link */}
      <div className="mt-6">
        <Link
          href="/account/sync"
          className="text-xs text-[#0A3C36] underline underline-offset-2"
        >
          عرض الإجراءات المعلّقة
        </Link>
      </div>
    </div>
  );
}
