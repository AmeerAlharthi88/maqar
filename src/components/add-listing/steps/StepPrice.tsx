"use client";

import { cn } from "@/lib/utils";
import { RENT_PERIODS } from "@/lib/constants/add-listing";
import { formatNumber, formatCurrency } from "@/lib/formatters";
import { useTranslation } from "@/i18n/useTranslation";
import type { ListingDraft, RentPeriod } from "@/types/listing-draft";

interface StepPriceProps {
  draft: ListingDraft;
  onChange: (patch: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
  suspiciousPrice: boolean;
  suspiciousMessage: string | null;
  amlFlagged: boolean;
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between py-3 border-b border-[#F0F4F8] last:border-0"
      role="switch"
      aria-checked={value}
    >
      <div className="text-start">
        <p className="text-sm font-medium text-[#102A43]">{label}</p>
        {desc && <p className="text-xs text-[#627D98]">{desc}</p>}
      </div>
      <div
        className={cn(
          "w-11 h-6 rounded-full transition-all flex-shrink-0 relative ms-3",
          value ? "bg-[#0A3C36]" : "bg-[#E2E8F0]"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all",
            value ? "start-5" : "start-0.5"
          )}
        />
      </div>
    </button>
  );
}

export function StepPrice({
  draft,
  onChange,
  errors,
  suspiciousPrice,
  suspiciousMessage,
}: StepPriceProps) {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";
  const isRent = draft.purpose === "rent" || draft.purpose === "investment";
  const priceNum = draft.price ?? 0;
  const priceFormatted = priceNum > 0 ? priceNum.toLocaleString("en-US") : "";

  function handlePriceChange(raw: string) {
    const cleaned = raw.replace(/[^0-9]/g, "");
    const num = cleaned === "" ? null : parseInt(cleaned, 10);
    onChange({ price: num });
  }

  return (
    <div className="px-4 py-6 space-y-6">

      {/* Main price input */}
      <section>
        <h3 className="text-sm font-bold text-[#102A43] mb-1.5">
          {isRent
            ? (isAr ? "سعر الإيجار" : "Rental price")
            : (isAr ? "سعر البيع" : "Sale price")}
          <span className="text-[#C0392B] ms-1">*</span>
        </h3>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={priceFormatted}
            onChange={(e) => handlePriceChange(e.target.value.replace(/,/g, ""))}
            className={cn(
              "w-full h-14 bg-white border rounded-xl px-4 pe-16 text-xl font-bold text-[#102A43] placeholder:text-[#E2E8F0] outline-none",
              "focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15",
              errors.price ? "border-[#C0392B]" : "border-[#E2E8F0]"
            )}
            dir="ltr"
            aria-label={isAr ? "السعر بالريال العماني" : "Price in Omani Rials"}
          />
          <span className="absolute end-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#627D98] pointer-events-none">
            {t("common.omr")}
          </span>
        </div>
        {errors.price && (
          <p className="mt-1.5 text-xs text-[#C0392B]">{errors.price}</p>
        )}
        {priceNum > 0 && (
          <p className="mt-1.5 text-xs text-[#627D98]">
            {formatCurrency(priceNum, locale)}
            {isRent && draft.rentPeriod === "yearly"
              ? ` — ${formatCurrency(Math.round(priceNum / 12), locale)} ${isAr ? "شهرياً" : "/ month"}`
              : ""}
          </p>
        )}
      </section>

      {/* Suspicious price warning */}
      {suspiciousPrice && suspiciousMessage && (
        <div className="bg-[#FDF6E3] border border-[#C8860A]/30 rounded-xl px-4 py-3 flex gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8860A" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-[#C8860A] mb-0.5">
              {isAr ? "ملاحظة حول السعر" : "Price note"}
            </p>
            <p className="text-xs text-[#627D98] leading-relaxed">{suspiciousMessage}</p>
          </div>
        </div>
      )}

      {/* Rent period */}
      {isRent && (
        <section>
          <h3 className="text-sm font-bold text-[#102A43] mb-3">
            {isAr ? "فترة الإيجار" : "Rental period"}{" "}
            <span className="text-[#C0392B]">*</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {RENT_PERIODS.map((period) => (
              <button
                key={period.value}
                onClick={() => onChange({ rentPeriod: period.value as RentPeriod })}
                className={cn(
                  "py-3 rounded-xl border text-sm font-medium transition-all",
                  draft.rentPeriod === period.value
                    ? "border-[#0A3C36] bg-[#E6F0EF] text-[#0A3C36]"
                    : "border-[#E2E8F0] bg-white text-[#102A43]"
                )}
                aria-pressed={draft.rentPeriod === period.value}
              >
                {isAr ? period.labelAr : (period.labelEn ?? period.labelAr)}
              </button>
            ))}
          </div>
          {errors.rentPeriod && <p className="mt-1.5 text-xs text-[#C0392B]">{errors.rentPeriod}</p>}
        </section>
      )}

      {/* Toggles */}
      <section className="bg-white rounded-2xl border border-[#E2E8F0] px-4">
        <ToggleRow
          label={t("addListing.price.isNegotiable")}
          desc={isAr ? "يرى المشترون أن السعر مرن" : "Buyers see the price as flexible"}
          value={draft.isNegotiable}
          onChange={(v) => onChange({ isNegotiable: v })}
        />
        <ToggleRow
          label={t("addListing.price.hidePrice")}
          desc={isAr ? "يظهر 'تواصل للسعر' بدلاً من الرقم" : "Shows 'Contact for price' instead of the number"}
          value={draft.isPriceHidden}
          onChange={(v) => onChange({ isPriceHidden: v })}
        />
      </section>

      {/* Deposit (rent only) */}
      {isRent && (
        <section>
          <h3 className="text-sm font-bold text-[#102A43] mb-1.5">
            {t("addListing.price.deposit")}
          </h3>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              placeholder="0"
              value={draft.depositAmount ?? ""}
              onChange={(e) => onChange({ depositAmount: e.target.value ? parseFloat(e.target.value) : null })}
              className="w-full h-11 bg-white border border-[#E2E8F0] rounded-xl px-3.5 pe-14 text-[#102A43] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15"
              dir="ltr"
            />
            <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[#627D98] pointer-events-none">
              {t("common.omr")}
            </span>
          </div>
        </section>
      )}

      {/* Service charges */}
      <section>
        <h3 className="text-sm font-bold text-[#102A43] mb-1.5">
          {t("addListing.price.serviceCharges")}
        </h3>
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={draft.serviceCharges ?? ""}
            onChange={(e) => onChange({ serviceCharges: e.target.value ? parseFloat(e.target.value) : null })}
            className="w-full h-11 bg-white border border-[#E2E8F0] rounded-xl px-3.5 pe-14 text-[#102A43] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15"
            dir="ltr"
          />
          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[#627D98] pointer-events-none">
            {isAr ? "ر.ع/سنة" : "OMR/yr"}
          </span>
        </div>
      </section>
    </div>
  );
}
