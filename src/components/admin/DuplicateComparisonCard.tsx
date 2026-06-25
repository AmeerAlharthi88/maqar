"use client";

import { AdminRiskBadge } from "./AdminRiskBadge";
import type { DuplicatePair } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";
import { bi, displayMeta } from "@/lib/admin/labels";

interface DuplicateComparisonCardProps {
  pair: DuplicatePair;
  onConfirmDuplicate?: (id: string) => void;
  onNotDuplicate?: (id: string) => void;
  onRequestClarification?: (id: string) => void;
}

export function DuplicateComparisonCard({
  pair,
  onConfirmDuplicate,
  onNotDuplicate,
  onRequestClarification,
}: DuplicateComparisonCardProps) {
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const numLocale = isAr ? "ar-OM" : "en-OM";
  const isPending = pair.status === "pending";

  const statusLabel =
    pair.status === "confirmed_duplicate" ? bi(isAr, "مكرر مؤكد", "Confirmed duplicate") :
    pair.status === "not_duplicate"       ? bi(isAr, "ليس مكرراً", "Not a duplicate") :
    pair.status === "merged"              ? bi(isAr, "تم الدمج", "Merged") :
    bi(isAr, "في الانتظار", "Pending");

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AdminRiskBadge level={pair.riskLevel} />
          <span className="text-xs font-bold text-[#102A43]">
            {bi(isAr, "تشابه", "Similarity")} {pair.similarityScore}{isAr ? "٪" : "%"}
          </span>
        </div>
        <span className={[
          "text-[10px] font-bold px-2 py-0.5 rounded-full",
          pair.status === "pending"            ? "bg-[#FFF8E7] text-[#D4A017]" :
          pair.status === "confirmed_duplicate" ? "bg-[#FEF0EE] text-[#C0392B]" :
          pair.status === "not_duplicate"       ? "bg-[#E6F0EF] text-[#0A3C36]" :
          "bg-[#F0F4F8] text-[#627D98]",
        ].join(" ")}>
          {statusLabel}
        </span>
      </div>

      {/* Match reasons */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {pair.matchReasons.map((r, i) => (
          <span key={i} className="px-2 py-0.5 bg-[#FEF0EE] text-[#C0392B] text-[10px] font-semibold rounded-lg">
            {r}
          </span>
        ))}
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[pair.listingA, pair.listingB].map((listing, idx) => (
          <div key={idx} className="bg-[#F8F9FA] rounded-xl px-3 py-3">
            <p className="text-[10px] font-bold text-[#627D98] mb-1">
              {idx === 0 ? bi(isAr, "الإعلان أ", "Listing A") : bi(isAr, "الإعلان ب", "Listing B")}
            </p>
            {/* Photo placeholder */}
            <div className="w-full h-16 bg-[#E2E8F0] rounded-lg mb-2 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="text-xs font-bold text-[#102A43] line-clamp-2 mb-1">{displayMeta(listing.titleAr, isAr)}</p>
            <p className="text-xs font-bold text-[#0A3C36] mb-1">
              {listing.price.toLocaleString(numLocale)} {bi(isAr, "ر.ع.", "OMR")}
            </p>
            <p className="text-[10px] text-[#627D98]">{displayMeta(listing.areaAr, isAr)}</p>
            {listing.specs.bedrooms > 0 && (
              <p className="text-[10px] text-[#627D98]">
                {listing.specs.bedrooms} {bi(isAr, "غرف", "rooms")} · {listing.specs.area} {bi(isAr, "م²", "sqm")}
              </p>
            )}
            {listing.specs.bedrooms === 0 && (
              <p className="text-[10px] text-[#627D98]">{listing.specs.area} {bi(isAr, "م²", "sqm")}</p>
            )}
            <p className="text-[10px] text-[#627D98] mt-1">{displayMeta(listing.agentNameAr, isAr)}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      {isPending && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onConfirmDuplicate?.(pair.id)}
            className="flex-1 min-w-[80px] py-2 rounded-xl bg-[#FEF0EE] text-[#C0392B] text-xs font-bold"
          >
            {bi(isAr, "تأكيد التكرار", "Confirm duplicate")}
          </button>
          <button
            onClick={() => onNotDuplicate?.(pair.id)}
            className="flex-1 min-w-[80px] py-2 rounded-xl bg-[#E6F0EF] text-[#0A3C36] text-xs font-bold"
          >
            {bi(isAr, "ليس مكرراً", "Not a duplicate")}
          </button>
          <button
            onClick={() => onRequestClarification?.(pair.id)}
            className="flex-1 min-w-[80px] py-2 rounded-xl bg-[#FFF8E7] text-[#D4A017] text-xs font-bold"
          >
            {bi(isAr, "طلب توضيح", "Request clarification")}
          </button>
        </div>
      )}
    </div>
  );
}
