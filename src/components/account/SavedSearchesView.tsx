"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useSavedSearchesStore,
  type SavedSearch,
} from "@/store/saved-searches.store";
import { deleteSavedSearch } from "@/lib/supabase/saved-searches";
import { ROUTES } from "@/config/routes";

function buildSearchHref(search: SavedSearch): string {
  const params = new URLSearchParams();
  if (search.query) params.set("q", search.query);
  if (search.filters.purpose && search.filters.purpose !== "all") {
    params.set("purpose", search.filters.purpose);
  }
  if (search.filters.governorateId) {
    params.set("governorateId", search.filters.governorateId);
  }
  const qs = params.toString();
  return qs ? `${ROUTES.search}?${qs}` : ROUTES.search;
}

export function SavedSearchesView() {
  const router = useRouter();
  const { items, removeItem } = useSavedSearchesStore();

  async function handleDelete(search: SavedSearch) {
    // Optimistic remove
    removeItem(search.id);
    // Persist deletion to Supabase (fire-and-forget; already removed locally)
    await deleteSavedSearch(search.id).catch((err) =>
      console.error("[SavedSearchesView] delete error:", err)
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4] pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#F0EBE3] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-[#1E1E1E]">البحث المحفوظ</h1>
          <p className="text-xs text-[#A89480]">{items.length} بحث</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F0EA] flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#1E1E1E] mb-2">لا يوجد بحث محفوظ</h2>
          <p className="text-sm text-[#7A6B5E] mb-6 leading-relaxed">
            احفظ بحثك من صفحة البحث لتجده هنا
          </p>
          <Link
            href={ROUTES.search}
            className="py-3 px-6 rounded-2xl bg-[#C65D3B] text-white font-bold text-sm"
          >
            ابدأ البحث
          </Link>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-2">
          {/* Info banner */}
          <div className="bg-[#EAF4FB] border border-[#2471A3]/20 rounded-2xl px-4 py-3 mb-2">
            <p className="text-xs text-[#2471A3] leading-relaxed">
              إشعارات البحث المحفوظ قيد التطوير — ستُفعَّل في تحديث قادم.
            </p>
          </div>

          {items.map((search) => {
            const href = buildSearchHref(search);
            const date = new Date(search.createdAt);
            const formattedDate = date.toLocaleDateString("ar-OM", {
              day: "numeric",
              month: "short",
            });

            return (
              <div
                key={search.id}
                className="bg-white rounded-2xl border border-[#F0EBE3] flex items-center gap-3 px-4 py-3.5"
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl bg-[#F5F0EA] flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A6B5E" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>

                {/* Content */}
                <Link href={href} className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1E1E1E] truncate">
                    {search.name || search.query || "بحث بدون كلمة مفتاحية"}
                  </p>
                  <p className="text-xs text-[#A89480] mt-0.5">{formattedDate}</p>
                </Link>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(search)}
                  className="w-8 h-8 flex items-center justify-center text-[#C4B5A5] hover:text-[#C65D3B] transition-colors"
                  aria-label="حذف البحث المحفوظ"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
