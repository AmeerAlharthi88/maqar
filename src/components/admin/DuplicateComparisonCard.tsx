import { AdminRiskBadge } from "./AdminRiskBadge";
import type { DuplicatePair } from "@/types/admin";

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
  const isPending = pair.status === "pending";

  const statusLabelAr =
    pair.status === "confirmed_duplicate" ? "مكرر مؤكد" :
    pair.status === "not_duplicate"       ? "ليس مكرراً" :
    pair.status === "merged"              ? "تم الدمج" :
    "في الانتظار";

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AdminRiskBadge level={pair.riskLevel} />
          <span className="text-xs font-bold text-[#102A43]">
            تشابه {pair.similarityScore}٪
          </span>
        </div>
        <span className={[
          "text-[10px] font-bold px-2 py-0.5 rounded-full",
          pair.status === "pending"            ? "bg-[#FFF8E7] text-[#D4A017]" :
          pair.status === "confirmed_duplicate" ? "bg-[#FEF0EE] text-[#C0392B]" :
          pair.status === "not_duplicate"       ? "bg-[#E6F0EF] text-[#0A3C36]" :
          "bg-[#F0F4F8] text-[#627D98]",
        ].join(" ")}>
          {statusLabelAr}
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
              {idx === 0 ? "الإعلان أ" : "الإعلان ب"}
            </p>
            {/* Photo placeholder */}
            <div className="w-full h-16 bg-[#E2E8F0] rounded-lg mb-2 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="text-xs font-bold text-[#102A43] line-clamp-2 mb-1">{listing.titleAr}</p>
            <p className="text-xs font-bold text-[#0A3C36] mb-1">
              {listing.price.toLocaleString("ar-OM")} ر.ع.
            </p>
            <p className="text-[10px] text-[#627D98]">{listing.areaAr}</p>
            {listing.specs.bedrooms > 0 && (
              <p className="text-[10px] text-[#627D98]">
                {listing.specs.bedrooms} غرف · {listing.specs.area} م²
              </p>
            )}
            {listing.specs.bedrooms === 0 && (
              <p className="text-[10px] text-[#627D98]">{listing.specs.area} م²</p>
            )}
            <p className="text-[10px] text-[#627D98] mt-1">{listing.agentNameAr}</p>
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
            تأكيد التكرار
          </button>
          <button
            onClick={() => onNotDuplicate?.(pair.id)}
            className="flex-1 min-w-[80px] py-2 rounded-xl bg-[#E6F0EF] text-[#0A3C36] text-xs font-bold"
          >
            ليس مكرراً
          </button>
          <button
            onClick={() => onRequestClarification?.(pair.id)}
            className="flex-1 min-w-[80px] py-2 rounded-xl bg-[#FFF8E7] text-[#D4A017] text-xs font-bold"
          >
            طلب توضيح
          </button>
        </div>
      )}
    </div>
  );
}
