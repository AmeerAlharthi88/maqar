"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import { useTranslation } from "@/i18n/useTranslation";
import { formatRelativeDateLocale } from "@/lib/formatters";
import { ROUTES } from "@/config/routes";

export function RecentlyViewedView() {
  const router = useRouter();
  const { items, remove, clear } = useRecentlyViewedStore();
  const { locale } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#102A43" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-[#102A43]">المشاهدة مؤخراً</h1>
          <p className="text-xs text-[#627D98]">{items.length} عقار</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clear}
            className="text-xs text-[#0A3C36] font-semibold"
          >
            مسح الكل
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#E6F0EF] flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#102A43] mb-2">لا توجد مشاهدات مؤخراً</h2>
          <p className="text-sm text-[#627D98] mb-6">
            العقارات التي تزورها ستظهر هنا تلقائياً
          </p>
          <Link
            href={ROUTES.home}
            className="py-3 px-6 rounded-2xl bg-[#0A3C36] text-white font-bold text-sm hover:bg-[#082E29] transition-colors"
          >
            تصفح العقارات
          </Link>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex gap-3"
            >
              {/* Image */}
              <Link href={ROUTES.listing(item.id)} className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.coverImage}
                  alt={item.titleAr}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0 py-3">
                <Link href={ROUTES.listing(item.id)}>
                  <p className="text-sm font-bold text-[#102A43] line-clamp-1">{item.titleAr}</p>
                  <p className="text-xs text-[#627D98] mt-0.5">{item.areaAr}</p>
                  <p className="text-sm font-bold text-[#0A3C36] mt-1">
                    {item.price.toLocaleString("ar-OM")} ر.ع.
                  </p>
                  <p className="text-[10px] text-[#627D98] mt-1">{formatRelativeDateLocale(item.viewedAt, locale)}</p>
                </Link>
              </div>

              {/* Remove */}
              <button
                onClick={() => remove(item.id)}
                className="px-3 flex items-center justify-center text-[#627D98]"
                aria-label="إزالة"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
