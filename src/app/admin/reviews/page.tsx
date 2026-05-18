"use client";

import { useState, useEffect } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MOCK_ADMIN_REVIEWS } from "@/mock/admin";
import type { AdminReviewItem, ReviewModerationStatus } from "@/types/admin";
import { REVIEW_MOD_STATUS_AR } from "@/types/admin";
import { fetchPendingReviewsAdmin, updateReviewModeration } from "@/lib/supabase/reviews";
import type { ReviewItem } from "@/lib/supabase/reviews";

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

// ── Mapper: ReviewItem (Supabase) → AdminReviewItem (UI) ─────────────────────
const TARGET_TYPE_AR: Record<"agent" | "agency", string> = { agent: "وسيط", agency: "وكالة" };

function reviewItemToAdmin(r: ReviewItem): AdminReviewItem {
  return {
    id: r.id,
    authorNameAr: r.authorName,
    rating: r.rating,
    bodyAr: r.body ?? "",
    targetType: r.targetType,
    // We don't have the target display name without an extra join; show type label
    targetNameAr: TARGET_TYPE_AR[r.targetType],
    targetId: r.targetId,
    status: r.moderationStatus,
    isReported: false,
    createdAt: r.createdAt,
  };
}

function useReviewQueue() {
  const [items, setItems] = useState<AdminReviewItem[]>(MOCK_ADMIN_REVIEWS);

  useEffect(() => {
    fetchPendingReviewsAdmin()
      .then((rows) => {
        if (rows.length > 0) {
          setItems(rows.map(reviewItemToAdmin));
        }
        // if empty, keep mock data
      })
      .catch(() => {/* keep mock data */});
  }, []);

  async function update(id: string, status: ReviewModerationStatus, note?: string) {
    // Optimistic update
    setItems((prev) =>
      prev.map((r) => r.id === id ? { ...r, status, adminNote: note ?? r.adminNote } : r)
    );
    if (status === "approved" || status === "rejected" || status === "hidden") {
      await updateReviewModeration(id, status).catch((err) =>
        console.error("[Admin/Reviews] updateReviewModeration error:", err)
      );
    }
  }

  return { items, update };
}

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState<ReviewModerationStatus | "all">("all");
  const { items, update } = useReviewQueue();

  const filtered = filter === "all" ? items : items.filter((r) => r.status === filter);

  return (
    <AdminDashboardShell titleAr="مراجعة التقييمات">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {FILTERS.map((f) => {
            const count = f === "all" ? items.length : items.filter((r) => r.status === f).length;
            return (
              <button key={f} onClick={() => setFilter(f)}
                className={["px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  filter === f ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]"].join(" ")}
              >
                {FILTER_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد تقييمات في هذه الفئة" />
        ) : (
          <div className="space-y-3">
            {filtered.map((review) => {
              const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);
              return (
                <div key={review.id} className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1E1E1E]">{review.authorNameAr}</p>
                      <p className="text-xs text-[#7A6B5E] mt-0.5">
                        تقييم على: {review.targetNameAr}
                        <span className="text-[#A89480]"> ({review.targetType === "agent" ? "وسيط" : "وكالة"})</span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge label={REVIEW_MOD_STATUS_AR[review.status]} variant={STATUS_VARIANT[review.status]} size="xs" />
                      {review.isReported && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FBF0EB] text-[#C65D3B] rounded-full">مُبلَّغ</span>
                      )}
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-2">
                    {stars.map((filled, i) => (
                      <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={filled ? "#C65D3B" : "#E8DDD0"}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                    <span className="text-[10px] text-[#A89480] mr-1">{review.rating}/5</span>
                  </div>

                  {/* Body */}
                  <p className="text-sm text-[#7A6B5E] leading-relaxed mb-2 border-r-2 border-[#F0EBE3] pr-3">
                    {review.bodyAr}
                  </p>

                  {/* Admin note */}
                  {review.adminNote && (
                    <div className="bg-[#FFF8E7] rounded-xl px-3 py-2 mb-2">
                      <p className="text-[10px] text-[#D4A017] font-semibold mb-0.5">ملاحظة الإدارة</p>
                      <p className="text-xs text-[#7A6B5E]">{review.adminNote}</p>
                    </div>
                  )}

                  {/* Date */}
                  <p className="text-[10px] text-[#A89480] mb-3">
                    {new Date(review.createdAt).toLocaleDateString("ar-OM", { year: "numeric", month: "long", day: "numeric" })}
                  </p>

                  {/* Actions */}
                  {review.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => void update(review.id, "approved")}
                        className="flex-1 py-2 rounded-xl bg-[#EDF4ED] text-[#5B8C5A] text-xs font-bold">
                        قبول
                      </button>
                      <button onClick={() => void update(review.id, "rejected", "محتوى غير مناسب.")}
                        className="flex-1 py-2 rounded-xl bg-[#FBF0EB] text-[#C65D3B] text-xs font-bold">
                        رفض
                      </button>
                      <button onClick={() => void update(review.id, "hidden")}
                        className="flex-1 py-2 rounded-xl bg-[#F5F0EA] text-[#7A6B5E] text-xs font-bold">
                        إخفاء
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
