import { cn } from "@/lib/utils";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";

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
  const s = sizeClasses[size];
  const formatted = formatOMR(amount, { compact });

  return (
    <div className={cn("flex items-baseline gap-1.5", className)}>
      <span className={cn(s.price, "text-[#C65D3B]")}>{formatted}</span>
      {purpose === "rent" && (
        <span className={cn(s.suffix, "text-[#7A6B5E]")}>/ شهرياً</span>
      )}
    </div>
  );
}

export function PricePerSqm({ pricePerSqm }: { pricePerSqm: number }) {
  return (
    <span className="text-xs text-[#A89480]">
      {toArabicNumerals(pricePerSqm.toLocaleString())} ر.ع. / م²
    </span>
  );
}
