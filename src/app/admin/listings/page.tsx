"use client";

import { useState } from "react";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { AdminQueueCard } from "@/components/admin/AdminQueueCard";
import { ReviewActionBar } from "@/components/admin/ReviewActionBar";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { MOCK_ADMIN_LISTINGS } from "@/mock/admin";
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

// Mock local state update — TODO: replace with server action in Phase 12
function useListingQueue() {
  const [items, setItems] = useState<AdminListingItem[]>(MOCK_ADMIN_LISTINGS);
  const updateStatus = (id: string, status: ListingReviewStatus) => {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, reviewStatus: status } : item)
    );
  };
  return { items, updateStatus };
}

export default function AdminListingsPage() {
  const [filter, setFilter] = useState<ListingReviewStatus | "all">("all");
  const { items, updateStatus } = useListingQueue();

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
                  filter === f ? "bg-[#C65D3B] text-white" : "bg-[#F5F0EA] text-[#7A6B5E]",
                ].join(" ")}
              >
                {FILTER_LABELS_AR[f]} ({count})
              </button>
            );
          })}
        </div>

        {/* Queue */}
        {filtered.length === 0 ? (
          <AdminEmptyState titleAr="لا توجد إعلانات في هذه الفئة" />
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
                <p className="text-[10px] text-[#A89480] mb-2">
                  {new Date(listing.submittedAt).toLocaleDateString("ar-OM", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                {(listing.reviewStatus === "pending" || listing.reviewStatus === "suspicious") && (
                  <ReviewActionBar
                    onApprove={() => updateStatus(listing.id, "approved")}
                    onReject={() => updateStatus(listing.id, "rejected")}
                    onRequestChanges={() => updateStatus(listing.id, "needs_changes")}
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
