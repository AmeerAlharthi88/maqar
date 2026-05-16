"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

type OfferStatus = "pending" | "accepted" | "rejected" | "countered" | "withdrawn";

interface MockOffer {
  id: string;
  listingTitleAr: string;
  listingId: string;
  offerPrice: number;
  status: OfferStatus;
  direction: "sent" | "received";
  createdAt: string; // ISO
}

// TODO: Replace with real Supabase query in Phase 10
const MOCK_OFFERS: MockOffer[] = [];

const STATUS_CONFIG: Record<
  OfferStatus,
  { labelAr: string; bg: string; text: string }
> = {
  pending:   { labelAr: "في الانتظار",    bg: "bg-[#FFF8E7]", text: "text-[#D4A017]" },
  accepted:  { labelAr: "مقبول",          bg: "bg-[#EDF4ED]", text: "text-[#5B8C5A]" },
  rejected:  { labelAr: "مرفوض",          bg: "bg-[#FBF0EB]", text: "text-[#C65D3B]" },
  countered: { labelAr: "عرض مضاد",       bg: "bg-[#EAF4FB]", text: "text-[#2471A3]" },
  withdrawn: { labelAr: "تم السحب",       bg: "bg-[#F5F0EA]", text: "text-[#A89480]" },
};

export function OffersView() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAF7F4] pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#F0EBE3] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <div>
          <h1 className="text-sm font-bold text-[#1E1E1E]">عروضي</h1>
          <p className="text-xs text-[#A89480]">العروض المقدّمة والمستلمة</p>
        </div>
      </div>

      {MOCK_OFFERS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F5F0EA] flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="1.5">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#1E1E1E] mb-2">لا توجد عروض</h2>
          <p className="text-sm text-[#7A6B5E] mb-6 leading-relaxed">
            عروض الشراء أو الإيجار التي تُقدمها أو تستلمها ستظهر هنا
          </p>
          <Link
            href={ROUTES.home}
            className="py-3 px-6 rounded-2xl bg-[#C65D3B] text-white font-bold text-sm"
          >
            تصفح العقارات
          </Link>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {MOCK_OFFERS.map((offer) => {
            const cfg = STATUS_CONFIG[offer.status];
            return (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Link
                    href={ROUTES.listing(offer.listingId)}
                    className="text-sm font-bold text-[#1E1E1E] line-clamp-1 flex-1"
                  >
                    {offer.listingTitleAr}
                  </Link>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.text}`}
                  >
                    {cfg.labelAr}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-base font-bold text-[#C65D3B]">
                    {offer.offerPrice.toLocaleString("ar-OM")} ر.ع.
                  </p>
                  <span className="text-[10px] text-[#A89480]">
                    {offer.direction === "sent" ? "عرض مُرسل" : "عرض مُستلم"}
                  </span>
                </div>

                <p className="text-xs text-[#A89480] mt-1">
                  {new Date(offer.createdAt).toLocaleDateString("ar-OM", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
