import { cn } from "@/lib/utils";
import { PriceText, PricePerSqm } from "@/components/ui/PriceText";
import type { ListingPurpose } from "@/types/listing";

interface PropertyPriceProps {
  amount: number;
  purpose: ListingPurpose;
  pricePerSqm?: number;
  size?: "sm" | "md" | "lg";
  compact?: boolean;
  className?: string;
}

export function PropertyPrice({ amount, purpose, pricePerSqm, size = "md", compact = false, className }: PropertyPriceProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <PriceText amount={amount} purpose={purpose} size={size} compact={compact} />
      {pricePerSqm && purpose === "sale" && (
        <PricePerSqm pricePerSqm={pricePerSqm} />
      )}
    </div>
  );
}
