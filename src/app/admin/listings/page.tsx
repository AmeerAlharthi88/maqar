"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AdminQueueCard } from "@/components/admin/AdminQueueCard";
import { ReviewActionBar } from "@/components/admin/ReviewActionBar";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminErrorState } from "@/components/admin/AdminErrorState";
import type { ListingReviewStatus, AdminListingItem } from "@/types/admin";
import { LISTING_REVIEW_STATUS_AR } from "@/types/admin";

const STATUS_VARIANT: Record<ListingReviewStatus, "success" | "warning" | "danger" | "info" | "neutral" | "purple"> = {
  pending:       "warning",
  approved:      "success",
  rejected:      "danger",
  needs_changes: "purple",
  suspicious:    "danger",
};

const ALL_FILTERS: (ListingReviewStatus | "all")[] = [
  "all", "pending", "approved", "rejected", "needs_changes", "suspicious",
];
const FILTER_LABELS_AR: Record<ListingReviewStatus | "all", string> = {
  all:           "الكل",
  pending:       "في الانتظار",
  approved:      "مقبول",
  rejected:      "مرفوض",
  needs_changes: "يحتاج تعديل",
  suspicious:    "مشبوه",
};

function useListingQueue() {
  const [items, setItems] = useState<AdminListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/listings");
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        // Real data only — an empty array is a real empty state, NOT a reason
        // to show mock listings (which previously masked a service-role outage).
        setItems((json.data ?? []) as AdminListingItem[]);
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

  const updateStatus = useCallback(
    async (id: string, action: "approve" | "reject" | "request_changes", note?: string) => {
      // Optimistic update
      const reviewStatus: ListingReviewStatus =
        action === "approve"          ? "approved"
        : action === "reject"         ? "rejected"
        : "needs_changes";

      setItems((prev) =>
        prev.map((item) => item.id === id ? { ...item, reviewStatus } : item)
      );

      try {
        await fetch(`/api/admin/listings/${id}`, {
          method:  "PATCH",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ action, note }),
        });
      } catch {
        // Server might not be configured — optimistic update still stands
      }
    },
    []
  );

  return { items, loading, error, reload, updateStatus };
}

export default function AdminListingsPage() {
  const [filter, setFilter] = useState<ListingReviewStatus | "all">("all");
  const { items, loading, error, reload, updateStatus } = useListingQueue();

  const filtered = filter === "all" ? items : items.filter((l) => l.reviewStatus === filter);

  return (
    <AdminDashboardShell titleAr="مراجعة الإعلانات">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {ALL_FILTERS.map((f) => {
            const count = f === "all" ? items.length : items.filter((l) => l.reviewStatus === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={[
                  "px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap flex-shrink-0 transition-colors",
                  filter === f ? "bg-[#0A3C36] text-white" : "bg-[#F0F4F8] text-[#627D98]",
                ].join(" ")}
              >
                {FILTER_LABELS_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {/* Queue */}
        {loading ? (
          <div className="text-center text-xs text-[#627D98] py-8">جارٍ التحميل…</div>
        ) : error ? (
          <AdminErrorState onRetry={reload} />
        ) : filtered.length === 0 ? (
          <AdminEmptyState
            titleAr={filter === "all" ? "لا توجد إعلانات للمراجعة" : "لا توجد إعلانات في هذه الفئة"}
            titleEn={filter === "all" ? "No listings to review" : "No listings in this category"}
            descriptionAr={filter === "all"
              ? "ستظهر الإعلانات المُرسَلة للمراجعة هنا."
              : `لا توجد إعلانات بحالة "${FILTER_LABELS_AR[filter]}". جرّب فلتراً آخر.`}
            descriptionEn={filter === "all"
              ? "Listings submitted for review will appear here."
              : "No listings match this filter. Try another one."}
            onReset={filter !== "all" ? () => setFilter("all") : undefined}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((listing) => (
              <AdminQueueCard
                key={listing.id}
                titleAr={listing.titleAr}
                subtitleAr={`${listing.agentNameAr} · ${listing.areaAr}، ${listing.wilayatAr}`}
                metaAr={`${listing.price.toLocaleString("ar-OM")} ر.ع. · ${listing.purpose === "sale" ? "بيع" : "إيجار"} · جودة ${listing.qualityScore}/100`}
                statusLabel={LISTING_REVIEW_STATUS_AR[listing.reviewStatus]}
                statusVariant={STATUS_VARIANT[listing.reviewStatus]}
                flagLabel={
                  listing.isSuspiciousPrice ? "سعر مشبوه" :
                  listing.duplicateRisk === "high"   ? "خطر تكرار: مرتفع" :
                  listing.duplicateRisk === "medium" ? "خطر تكرار: متوسط" :
                  undefined
                }
                adminNote={listing.adminNote}
              >
                <p className="text-[10px] text-[#627D98] mb-2">
                  {new Date(listing.submittedAt).toLocaleDateString("ar-OM", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                {(listing.reviewStatus === "pending" || listing.reviewStatus === "suspicious") && (
                  <ReviewActionBar
                    onApprove={() => updateStatus(listing.id, "approve")}
                    onReject={() => updateStatus(listing.id, "reject")}
                    onRequestChanges={() => updateStatus(listing.id, "request_changes")}
                  />
                )}
              </AdminQueueCard>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
