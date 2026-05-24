import Link from "next/link";
import { toArabicNumerals, formatOMR } from "@/lib/formatters";
import type { Listing } from "@/types/listing";

interface ListingROIPreviewProps {
  listing: Listing;
}

export function ListingROIPreview({ listing }: ListingROIPreviewProps) {
  const roiPct = listing.roiEstimate ?? 5.5;
  const annualReturn = Math.round((listing.price * roiPct) / 100);
  const monthlyReturn = Math.round(annualReturn / 12);

  // Simple mortgage estimate: 20% down, 25yr, 4.5% interest
  const downPayment = Math.round(listing.price * 0.2);
  const loanAmount = listing.price - downPayment;
  const monthlyRate = 0.045 / 12;
  const numPayments = 25 * 12;
  const monthlyPayment =
    loanAmount > 0
      ? Math.round(
          (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
            (Math.pow(1 + monthlyRate, numPayments) - 1)
        )
      : 0;

  return (
    <div className="px-4 py-4 border-t border-[#E2E8F0]">
      <h2 className="text-base font-bold text-[#102A43] mb-3">الحسابات المالية</h2>
      <div className="grid grid-cols-2 gap-3">
        {/* ROI card */}
        {listing.purpose === "sale" && (
          <div className="bg-[#E6F0EF] rounded-2xl p-4 border border-[#0A3C36]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#0A3C36]/15 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#0A3C36]">العائد على الاستثمار</span>
            </div>
            <p className="text-2xl font-bold text-[#0A3C36] mb-0.5">
              {toArabicNumerals(roiPct)}%
            </p>
            <p className="text-xs text-[#0A3C36]/70 mb-3">عائد سنوي تقديري</p>
            <div className="space-y-1 text-xs text-[#0A3C36]">
              <div className="flex justify-between">
                <span>شهري</span>
                <span className="font-semibold">{formatOMR(monthlyReturn, { arabic: true, compact: true })}</span>
              </div>
              <div className="flex justify-between">
                <span>سنوي</span>
                <span className="font-semibold">{formatOMR(annualReturn, { arabic: true, compact: true })}</span>
              </div>
            </div>
            <p className="text-[10px] text-[#0A3C36]/60 mt-2">* تقديري — يرجى استشارة خبير</p>
            <Link href="/tools/roi-calculator" className="mt-2 block text-[10px] font-semibold text-[#0A3C36] underline underline-offset-2">
              حاسبة العائد التفصيلية
            </Link>
          </div>
        )}

        {/* Mortgage card */}
        {listing.purpose === "sale" && (
          <div className="bg-[#EAF4FB] rounded-2xl p-4 border border-[#2471A3]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-[#2471A3]/15 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2471A3" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#2471A3]">تقدير التمويل العقاري</span>
            </div>
            <p className="text-2xl font-bold text-[#2471A3] mb-0.5">
              {formatOMR(monthlyPayment, { arabic: true, compact: true })}
            </p>
            <p className="text-xs text-[#2471A3]/70 mb-3">قسط شهري تقديري</p>
            <div className="space-y-1 text-xs text-[#2471A3]">
              <div className="flex justify-between">
                <span>دفعة أولى (٢٠٪)</span>
                <span className="font-semibold">{formatOMR(downPayment, { arabic: true, compact: true })}</span>
              </div>
              <div className="flex justify-between">
                <span>٢٥ سنة · ٤.٥٪</span>
                <span className="font-semibold">{formatOMR(loanAmount, { arabic: true, compact: true })}</span>
              </div>
            </div>
            <p className="text-[10px] text-[#2471A3]/60 mt-2">* تقديري — يرجى التواصل مع البنك</p>
            <Link href="/tools/mortgage-calculator" className="mt-2 block text-[10px] font-semibold text-[#2471A3] underline underline-offset-2">
              حاسبة التمويل التفصيلية
            </Link>
          </div>
        )}

        {/* Rent card — show if rent listing */}
        {listing.purpose === "rent" && (
          <div className="col-span-2 bg-[#E6F0EF] rounded-2xl p-4 border border-[#0A3C36]/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#0A3C36]/15 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#0A3C36]">ملخص تكلفة الإيجار</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <p className="text-[#0A3C36] font-bold text-base">{formatOMR(listing.price, { arabic: true, compact: true })}</p>
                <p className="text-[#0A3C36]/70">/ شهر</p>
              </div>
              <div className="text-center">
                <p className="text-[#0A3C36] font-bold text-base">{formatOMR(listing.price * 3, { arabic: true, compact: true })}</p>
                <p className="text-[#0A3C36]/70">ربع سنوي</p>
              </div>
              <div className="text-center">
                <p className="text-[#0A3C36] font-bold text-base">{formatOMR(listing.price * 12, { arabic: true, compact: true })}</p>
                <p className="text-[#0A3C36]/70">سنوي</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
