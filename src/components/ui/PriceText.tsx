"use client";

import { cn } from "@/lib/utils";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";
import { useLanguageStore } from "@/store/language.store";

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
  const { locale } = useLanguageStore();
  const isAr = locale === "ar";
  const s = sizeClasses[size];
  const formatted = formatOMR(amount, { compact, arabic: isAr });
  const rentSuffix = isAr ? "/ شهرياً" : "/ month";

  return (
    <div className={cn("flex items-baseline gap-1.5", className)}>
      <span className={cn(s.price, "text-[#C65D3B]")}>{formatted}</span>
      {purpose === "rent" && (
        <span className={cn(s.suffix, "text-[#7A6B5E]")}>{rentSuffix}</span>
      )}
    </div>
  );
}

export function PricePerSqm({ pricePerSqm }: { pricePerSqm: number }) {
  const { locale } = useLanguageStore();
  const isAr = locale === "ar";
  return (
    <span className="text-xs text-[#A89480]">
      {isAr
        ? `${toArabicNumerals(pricePerSqm.toLocaleString())} ر.ع. / م²`
        : `${pricePerSqm.toLocaleString()} OMR/sqm`}
    </span>
  );
}
