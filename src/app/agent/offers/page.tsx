"use client";

import { useEffect, useState } from "react";
import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MOCK_OFFERS } from "@/mock/leads";
import { OFFER_STATUS_LABELS_AR, FINANCING_LABELS_AR } from "@/types/lead";
import type { OfferStatus, FinancingType, DashboardOffer } from "@/types/lead";
import { useAuthStore } from "@/store/auth.store";
import { fetchAgentOffers, updateOfferStatus } from "@/lib/supabase/crm";
import type { CrmOffer } from "@/lib/supabase/crm";

// ── Unified display shape (absorbs both DB + mock) ────────────────────────────
interface OfferDisplay {
  id: string;
  buyerNameAr: string;
  buyerPhone: string;
  listingTitleAr: string;
  askingPrice: number;
  offerAmount: number;
  financing: FinancingType;
  status: OfferStatus;
  createdAt: string;
}

const STATUS_VARIANT: Record<
  OfferStatus,
  "success" | "warning" | "danger" | "info" | "neutral" | "purple"
> = {
  submitted:    "info",
  under_review: "warning",
  accepted:     "success",
  rejected:     "danger",
  countered:    "purple",
  withdrawn:    "neutral",
};

function crmOfferToDisplay(offer: CrmOffer): OfferDisplay {
  return {
    id: offer.id,
    buyerNameAr: offer.customerName,
    buyerPhone: offer.customerPhone,
    listingTitleAr: offer.listingTitleAr,
    askingPrice: offer.askingPriceOmr,
    offerAmount: offer.offerAmountOmr,
    financing: offer.financingType ?? "cash",
    status: offer.status,
    createdAt: offer.createdAt,
  };
}

function mockOfferToDisplay(offer: DashboardOffer): OfferDisplay {
  return {
    id: offer.id,
    buyerNameAr: offer.buyerNameAr,
    buyerPhone: offer.buyerPhone,
    listingTitleAr: offer.listingTitleAr,
    askingPrice: offer.askingPrice,
    offerAmount: offer.offerAmount,
    financing: offer.financing,
    status: offer.status,
    createdAt: offer.createdAt,
  };
}

export default function AgentOffersPage() {
  const { user } = useAuthStore();
  const [offers, setOffers] = useState<OfferDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!user?.id) {
      setOffers(MOCK_OFFERS.map(mockOfferToDisplay));
      setLoading(false);
      return;
    }
    fetchAgentOffers(user.id)
      .then((rows) => {
        setOffers(
          rows.length > 0
            ? rows.map(crmOfferToDisplay)
            : MOCK_OFFERS.map(mockOfferToDisplay)
        );
      })
      .catch(() => setOffers(MOCK_OFFERS.map(mockOfferToDisplay)))
      .finally(() => setLoading(false));
  }, [user?.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleStatusUpdate(id: string, status: OfferStatus) {
    // Optimistic update
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    await updateOfferStatus(id, status).catch((err) =>
      console.error("[Offers] updateOfferStatus error:", err)
    );
  }

  if (loading) {
    return (
      <AgentDashboardShell titleAr="العروض">
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-[#C65D3B] border-t-transparent animate-spin" />
        </div>
      </AgentDashboardShell>
    );
  }

  return (
    <AgentDashboardShell titleAr="العروض">
      <div className="px-4 py-4 space-y-3" dir="rtl">
        <p className="text-xs text-[#A89480]">{offers.length} عرض وارد</p>

        {offers.map((offer) => {
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
                  <p className="text-xs text-[#7A6B5E] mt-0.5 line-clamp-1">
                    {offer.listingTitleAr}
                  </p>
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
                  <p className="text-xs font-bold text-[#7A6B5E]">
                    {discountPct > 0 ? `-${discountPct}٪` : `${Math.abs(discountPct)}٪+`}
                  </p>
                  <p className="text-[10px] text-[#A89480]">الفرق</p>
                </div>
              </div>

              {/* Financing + date */}
              <div className="flex items-center justify-between text-xs text-[#7A6B5E]">
                <span>{FINANCING_LABELS_AR[offer.financing]}</span>
                <span>
                  {new Date(offer.createdAt).toLocaleDateString("ar-OM", {
                    day:   "numeric",
                    month: "long",
                  })}
                </span>
              </div>

              {/* Actions for pending offers */}
              {(offer.status === "submitted" || offer.status === "under_review") && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => void handleStatusUpdate(offer.id, "accepted")}
                    className="flex-1 py-2 rounded-xl bg-[#EDF4ED] text-[#5B8C5A] text-xs font-bold"
                  >
                    قبول
                  </button>
                  <button
                    onClick={() => void handleStatusUpdate(offer.id, "rejected")}
                    className="flex-1 py-2 rounded-xl bg-[#FBF0EB] text-[#C65D3B] text-xs font-bold"
                  >
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

        {offers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#A89480]">لا توجد عروض بعد</p>
          </div>
        )}
      </div>
    </AgentDashboardShell>
  );
}
