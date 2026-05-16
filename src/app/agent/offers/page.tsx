"use client";

import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MOCK_OFFERS } from "@/mock/leads";
import { OFFER_STATUS_LABELS_AR, FINANCING_LABELS_AR } from "@/types/lead";
import type { OfferStatus } from "@/types/lead";

const STATUS_VARIANT: Record<OfferStatus, "success" | "warning" | "danger" | "info" | "neutral" | "purple"> = {
  submitted:    "info",
  under_review: "warning",
  accepted:     "success",
  rejected:     "danger",
  countered:    "purple",
  withdrawn:    "neutral",
};

export default function AgentOffersPage() {
  return (
    <AgentDashboardShell titleAr="العروض">
      <div className="px-4 py-4 space-y-3" dir="rtl">
        <p className="text-xs text-[#A89480]">{MOCK_OFFERS.length} عرض وارد</p>

        {MOCK_OFFERS.map((offer) => {
          const discountPct = Math.round(
            ((offer.askingPrice - offer.offerAmount) / offer.askingPrice) * 100
          );

          return (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1E1E1E]">{offer.buyerNameAr}</p>
                  <p className="text-xs text-[#7A6B5E] mt-0.5 line-clamp-1">{offer.listingTitleAr}</p>
                </div>
                <StatusBadge
                  label={OFFER_STATUS_LABELS_AR[offer.status]}
                  variant={STATUS_VARIANT[offer.status]}
                  size="xs"
                />
              </div>

              {/* Price comparison */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
                  <p className="text-xs font-bold text-[#1E1E1E]">
                    {offer.askingPrice.toLocaleString("ar-OM")}
                  </p>
                  <p className="text-[10px] text-[#A89480]">السعر المطلوب</p>
                </div>
                <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
                  <p className="text-xs font-bold text-[#C65D3B]">
                    {offer.offerAmount.toLocaleString("ar-OM")}
                  </p>
                  <p className="text-[10px] text-[#A89480]">العرض المقدم</p>
                </div>
                <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
                  <p className="text-xs font-bold text-[#7A6B5E]">-{discountPct}٪</p>
                  <p className="text-[10px] text-[#A89480]">الفرق</p>
                </div>
              </div>

              {/* Financing + date */}
              <div className="flex items-center justify-between text-xs text-[#7A6B5E]">
                <span>{FINANCING_LABELS_AR[offer.financing]}</span>
                <span>
                  {new Date(offer.createdAt).toLocaleDateString("ar-OM", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>

              {/* Actions for pending offers */}
              {(offer.status === "submitted" || offer.status === "under_review") && (
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 rounded-xl bg-[#EDF4ED] text-[#5B8C5A] text-xs font-bold">
                    قبول
                  </button>
                  <button className="flex-1 py-2 rounded-xl bg-[#FBF0EB] text-[#C65D3B] text-xs font-bold">
                    رفض
                  </button>
                  <a
                    href={`tel:${offer.buyerPhone}`}
                    className="px-3 py-2 rounded-xl bg-[#F5F0EA] text-[#7A6B5E] text-xs font-bold"
                  >
                    اتصال
                  </a>
                </div>
              )}
            </div>
          );
        })}

        {MOCK_OFFERS.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#A89480]">لا توجد عروض بعد</p>
          </div>
        )}
      </div>
    </AgentDashboardShell>
  );
}
