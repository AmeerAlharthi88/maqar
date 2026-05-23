"use client";

import { StatusBadge } from "./StatusBadge";
import type { AgentListingMeta } from "@/mock/agent-analytics";

const STATUS_VARIANT = {
  active:         "success",
  pending_review: "warning",
  draft:          "neutral",
  rejected:       "danger",
  expired:        "neutral",
} as const;

const STATUS_LABEL_AR = {
  active:         "نشط",
  pending_review: "قيد المراجعة",
  draft:          "مسودة",
  rejected:       "مرفوض",
  expired:        "منتهي",
} as const;

interface ListingPerformanceCardProps {
  listing: AgentListingMeta;
  onEdit?: (id: string) => void;
}

export function ListingPerformanceCard({ listing, onEdit }: ListingPerformanceCardProps) {
  // Days-to-expiry is display-only — Date.now() at render time is intentional here
  const nowMs = Date.now(); // eslint-disable-line react-hooks/purity
  const daysRemaining = listing.expiresAt
    ? Math.max(
        0,
        Math.ceil((new Date(listing.expiresAt).getTime() - nowMs) / 86_400_000)
      ).toString()
    : "—";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4" dir="rtl">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#102A43] line-clamp-1">{listing.titleAr}</p>
          <p className="text-sm font-bold text-[#0A3C36] mt-0.5">
            {listing.price.toLocaleString("ar-OM")} ر.ع.
          </p>
        </div>
        <StatusBadge
          label={STATUS_LABEL_AR[listing.status]}
          variant={STATUS_VARIANT[listing.status]}
          size="xs"
        />
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {[
          { value: listing.views.toLocaleString("ar-OM"), label: "مشاهدة" },
          { value: listing.leads.toString(), label: "عميل" },
          { value: listing.status === "active" ? "نشط" : "—", label: "الحالة" },
          { value: daysRemaining, label: "يوم متبق" },
        ].map((m) => (
          <div key={m.label} className="bg-[#F8F9FA] rounded-xl py-2 text-center">
            <p className="text-sm font-bold text-[#102A43]">{m.value}</p>
            <p className="text-[10px] text-[#627D98]">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      {listing.status !== "expired" && (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(listing.listingId)}
            className="flex-1 py-2 rounded-xl border border-[#E2E8F0] bg-[#F0F4F8] text-xs font-semibold text-[#102A43]"
          >
            تعديل
          </button>
          {listing.status === "active" && (
            <button className="flex-1 py-2 rounded-xl border border-[#0A3C36]/30 bg-[#E6F0EF] text-xs font-semibold text-[#0A3C36]">
              تمييز الإعلان
            </button>
          )}
          {listing.status === "draft" && (
            <button className="flex-1 py-2 rounded-xl bg-[#0A3C36] text-xs font-semibold text-white">
              نشر الإعلان
            </button>
          )}
        </div>
      )}
    </div>
  );
}
