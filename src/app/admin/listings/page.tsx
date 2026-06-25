"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AdminQueueCard } from "@/components/admin/AdminQueueCard";
import { ReviewActionBar } from "@/components/admin/ReviewActionBar";
import { AdminActionFeedback } from "@/components/admin/AdminActionFeedback";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminErrorState } from "@/components/admin/AdminErrorState";
import type { ListingReviewStatus, AdminListingItem } from "@/types/admin";
import { LISTING_REVIEW_STATUS_AR, LISTING_REVIEW_STATUS_EN } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";
import { bi, displayMeta } from "@/lib/admin/labels";

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
const FILTER_LABELS_EN: Record<ListingReviewStatus | "all", string> = {
  all:           "All",
  pending:       "Pending",
  approved:      "Approved",
  rejected:      "Rejected",
  needs_changes: "Needs changes",
  suspicious:    "Suspicious",
};

type ListingAction = "approve" | "reject" | "request_changes";

function useListingQueue() {
  const [items, setItems] = useState<AdminListingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Per-row action state: which rows have an action in flight, and which rows'
  // last action failed (so we can show an error + retry instead of faking success).
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [failed, setFailed] = useState<Record<string, ListingAction>>({});
  const inFlight = useRef<Set<string>>(new Set());

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

  // Pessimistic action: only update the row AFTER the backend confirms success.
  // On any failure (HTTP 400/403/500, network error, malformed JSON) the row is
  // left untouched and a retryable error is surfaced — never a fake success.
  const runAction = useCallback(async (id: string, action: ListingAction, note?: string) => {
    if (inFlight.current.has(id)) return; // ignore duplicate clicks while pending
    inFlight.current.add(id);
    setPending((p) => new Set(p).add(id));
    setFailed((f) => { const next = { ...f }; delete next[id]; return next; });

    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action, note }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        const reviewStatus: ListingReviewStatus =
          action === "approve" ? "approved" : action === "reject" ? "rejected" : "needs_changes";
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, reviewStatus } : item)));
      } else {
        setFailed((f) => ({ ...f, [id]: action }));
      }
    } catch {
      setFailed((f) => ({ ...f, [id]: action }));
    } finally {
      inFlight.current.delete(id);
      setPending((p) => { const next = new Set(p); next.delete(id); return next; });
    }
  }, []);

  return { items, loading, error, reload, pending, failed, runAction };
}

export default function AdminListingsPage() {
  const [filter, setFilter] = useState<ListingReviewStatus | "all">("all");
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const filterLabels = isAr ? FILTER_LABELS_AR : FILTER_LABELS_EN;
  const statusLabels = isAr ? LISTING_REVIEW_STATUS_AR : LISTING_REVIEW_STATUS_EN;
  const numLocale = isAr ? "ar-OM" : "en-OM";
  const { items, loading, error, reload, pending, failed, runAction } = useListingQueue();

  const filtered = filter === "all" ? items : items.filter((l) => l.reviewStatus === filter);

  return (
    <AdminDashboardShell titleAr="مراجعة الإعلانات" titleEn="Review listings">
      <div className="px-4 py-4 space-y-4" dir={isAr ? "rtl" : "ltr"}>
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
                {filterLabels[f]} ({count})
              </button>
            );
          })}
        </div>

        {/* Queue */}
        {loading ? (
          <div className="text-center text-xs text-[#627D98] py-8">{bi(isAr, "جارٍ التحميل…", "Loading…")}</div>
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
                titleAr={displayMeta(listing.titleAr, isAr)}
                subtitleAr={`${displayMeta(listing.agentNameAr, isAr)} · ${displayMeta(listing.areaAr, isAr)}${isAr ? "، " : ", "}${displayMeta(listing.wilayatAr, isAr)}`}
                metaAr={`${listing.price.toLocaleString(numLocale)} ${bi(isAr, "ر.ع.", "OMR")} · ${listing.purpose === "sale" ? bi(isAr, "بيع", "Sale") : bi(isAr, "إيجار", "Rent")} · ${bi(isAr, "جودة", "Quality")} ${listing.qualityScore}/100`}
                statusLabel={statusLabels[listing.reviewStatus]}
                statusVariant={STATUS_VARIANT[listing.reviewStatus]}
                flagLabel={
                  listing.isSuspiciousPrice ? bi(isAr, "سعر مشبوه", "Suspicious price") :
                  listing.duplicateRisk === "high"   ? bi(isAr, "خطر تكرار: مرتفع", "Duplicate risk: high") :
                  listing.duplicateRisk === "medium" ? bi(isAr, "خطر تكرار: متوسط", "Duplicate risk: medium") :
                  undefined
                }
                adminNote={listing.adminNote}
              >
                <p className="text-[10px] text-[#627D98] mb-2">
                  {new Date(listing.submittedAt).toLocaleDateString(numLocale, { year: "numeric", month: "long", day: "numeric" })}
                </p>
                {(listing.reviewStatus === "pending" || listing.reviewStatus === "suspicious") && (
                  <>
                    <ReviewActionBar
                      disabled={pending.has(listing.id)}
                      onApprove={() => runAction(listing.id, "approve")}
                      onReject={() => runAction(listing.id, "reject")}
                      onRequestChanges={() => runAction(listing.id, "request_changes")}
                    />
                    <AdminActionFeedback
                      pending={pending.has(listing.id)}
                      error={Boolean(failed[listing.id])}
                      onRetry={() => { const a = failed[listing.id]; if (a) runAction(listing.id, a); }}
                    />
                  </>
                )}
              </AdminQueueCard>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  );
}
