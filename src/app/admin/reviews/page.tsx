"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminErrorState } from "@/components/admin/AdminErrorState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { AdminReviewItem, ReviewModerationStatus } from "@/types/admin";
import { REVIEW_MOD_STATUS_AR, REVIEW_MOD_STATUS_EN } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";
import { bi, displayMeta } from "@/lib/admin/labels";

const STATUS_VARIANT: Record<ReviewModerationStatus, "success" | "warning" | "danger" | "info" | "neutral" | "purple"> = {
  pending:  "warning",
  approved: "success",
  rejected: "danger",
  hidden:   "neutral",
};

const FILTERS: (ReviewModerationStatus | "all")[] = ["all", "pending", "approved", "rejected", "hidden"];
const FILTER_AR: Record<ReviewModerationStatus | "all", string> = {
  all: "الكل", pending: "في الانتظار", approved: "مقبول", rejected: "مرفوض", hidden: "مخفي",
};
const FILTER_EN: Record<ReviewModerationStatus | "all", string> = {
  all: "All", pending: "Pending", approved: "Approved", rejected: "Rejected", hidden: "Hidden",
};

function useReviewQueue() {
  const [items, setItems] = useState<AdminReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/reviews");
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        // Real data only — the service-role API returns AdminReviewItem[] directly;
        // an empty array is a real empty state, never mock.
        setItems((json.data ?? []) as AdminReviewItem[]);
      } else {
        setError(true);
        setItems([]);
      }
    } catch {
      setError(true);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { reload(); }, [reload]);

  async function update(id: string, status: ReviewModerationStatus, note?: string) {
    // Optimistic update
    setItems((prev) =>
      prev.map((r) => r.id === id ? { ...r, status, adminNote: note ?? r.adminNote } : r)
    );
    if (status === "approved" || status === "rejected" || status === "hidden") {
      await fetch(`/api/admin/reviews/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      }).catch((err) => console.error("[Admin/Reviews] moderate error:", err));
    }
  }

  return { items, loading, error, reload, update };
}

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState<ReviewModerationStatus | "all">("all");
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const filterLabels = isAr ? FILTER_AR : FILTER_EN;
  const { items, loading, error, reload, update } = useReviewQueue();

  const filtered = filter === "all" ? items : items.filter((r) => r.status === filter);

  return (
    <AdminDashboardShell titleAr="مراجعة التقييمات" titleEn="Review moderation">
      <div className="px-4 py-4 space-y-4" dir={isAr ? "rtl" : "ltr"}>
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {FILTERS.map((f) => {
            const count = f === "all" ? items.length : items.filter((r) => r.status === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  filter === f ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]"].join(" ")}
              >
                {filterLabels[f]} ({count})
              </button>
            );
          })}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="text-center text-xs text-[#627D98] py-8">{bi(isAr, "جارٍ التحميل…", "Loading…")}</div>
        ) : error ? (
          <AdminErrorState onRetry={reload} />
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            titleAr={filter === "all" ? "لا توجد تقييمات للمراجعة" : "لا توجد تقييمات في هذه الفئة"}
            titleEn={filter === "all" ? "No reviews to moderate" : "No reviews in this category"}
            descriptionAr={filter === "all" ? "تقييمات المستخدمين بانتظار المراجعة ستظهر هنا." : undefined}
            descriptionEn={filter === "all" ? "User reviews awaiting moderation will appear here." : undefined}
            onReset={filter !== "all" ? () => setFilter("all") : undefined}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((review) => {
              const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);
              return (
                <div key={review.id} className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#102A43]">{displayMeta(review.authorNameAr, isAr)}</p>
                      <p className="text-xs text-[#627D98] mt-0.5">
                        {bi(isAr, "تقييم على", "Review of")}: {displayMeta(review.targetNameAr, isAr)}
                        <span className="text-[#627D98]"> ({review.targetType === "agent" ? bi(isAr, "وسيط", "Agent") : bi(isAr, "وكالة", "Agency")})</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge label={isAr ? REVIEW_MOD_STATUS_AR[review.status] : REVIEW_MOD_STATUS_EN[review.status]} variant={STATUS_VARIANT[review.status]} size="xs" />
                      {review.isReported && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FEF0EE] text-[#C0392B] rounded-full">{bi(isAr, "مُبلَّغ", "Reported")}</span>
                      )}
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {stars.map((filled, i) => (
                      <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={filled ? "#E5BA73" : "#E2E8F0"}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                    <span className="text-[10px] text-[#627D98] mr-1">{review.rating}/5</span>
                  </div>

                  {/* Body */}
                  <p className="text-sm text-[#627D98] leading-relaxed mb-2 border-r-2 border-[#E2E8F0] pr-3">
                    {review.bodyAr}
                  </p>

                  {/* Admin note */}
                  {review.adminNote && (
                    <div className="bg-[#FFF8E7] rounded-xl px-3 py-2 mb-2">
                      <p className="text-[10px] text-[#D4A017] font-semibold mb-0.5">{bi(isAr, "ملاحظة الإدارة", "Admin note")}</p>
                      <p className="text-xs text-[#627D98]">{review.adminNote}</p>
                    </div>
                  )}

                  {/* Date */}
                  <p className="text-[10px] text-[#627D98] mb-3">
                    {new Date(review.createdAt).toLocaleDateString(isAr ? "ar-OM" : "en-OM", { year: "numeric", month: "long", day: "numeric" })}
                  </p>

                  {/* Actions */}
                  {review.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => void update(review.id, "approved")}
                        className="flex-1 py-2 rounded-xl bg-[#E6F0EF] text-[#0A3C36] text-xs font-bold">
                        {bi(isAr, "قبول", "Approve")}
                      </button>
                      <button onClick={() => void update(review.id, "rejected", bi(isAr, "محتوى غير مناسب.", "Inappropriate content."))}
                        className="flex-1 py-2 rounded-xl bg-[#FEF0EE] text-[#C0392B] text-xs font-bold">
                        {bi(isAr, "رفض", "Reject")}
                      </button>
                      <button onClick={() => void update(review.id, "hidden")}
                        className="flex-1 py-2 rounded-xl bg-[#F0F4F8] text-[#627D98] text-xs font-bold">
                        {bi(isAr, "إخفاء", "Hide")}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
