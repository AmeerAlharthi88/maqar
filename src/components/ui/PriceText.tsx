"use client";

import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { useTranslation } from "@/i18n/useTranslation";

interface PriceTextProps {
  amount: number;
  purpose?: "sale" | "rent";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  compact?: boolean;
}

const sizeClasses = {
  sm: { price: "text-base font-bold", suffix: "text-xs" },
  md: { price: "text-xl font-bold",   suffix: "text-sm" },
  lg: { price: "text-2xl font-bold",  suffix: "text-base" },
  xl: { price: "text-3xl font-bold",  suffix: "text-lg" },
};

export function PriceText({ amount, purpose = "sale", size = "md", className, compact = false }: PriceTextProps) {
  const { locale, t } = useTranslation();
  const s = sizeClasses[size];
  const formatted = formatCurrency(amount, locale, { compact });
  const rentSuffix = t("common.perMonth");

  return (
    <div className={cn("flex items-baseline gap-1.5", className)}>
      <span className={cn(s.price, "text-[#0A3C36]")}>{formatted}</span>
      {purpose === "rent" && (
        <span className={cn(s.suffix, "text-[#627D98]")}>{rentSuffix}</span>
      )}
    </div>
  );
}

export function PricePerSqm({ pricePerSqm }: { pricePerSqm: number }) {
  const { locale } = useTranslation();
  const isAr = locale === "ar";
  const omr = isAr ? "ر.ع." : "OMR";
  const sqm = isAr ? "م²" : "sqm";
  return (
    <span className="text-xs text-[#627D98]">
      {`${formatNumber(pricePerSqm, locale)} ${omr}/${sqm}`}
    </span>
  );
}
