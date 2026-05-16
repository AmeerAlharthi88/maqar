import { cn } from "@/lib/utils";

interface AmenityChipProps {
  nameAr: string;
  className?: string;
  variant?: "default" | "active";
}

export function AmenityChip({ nameAr, className, variant = "default" }: AmenityChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap",
        variant === "active"
          ? "bg-[#FBF0EB] text-[#C65D3B] border border-[#C65D3B]/20"
          : "bg-[#F5F0EA] text-[#7A6B5E]",
        className
      )}
    >
      {nameAr}
    </span>
  );
}

interface AmenityListProps {
  amenities: string[];
  max?: number;
  className?: string;
}

export function AmenityList({ amenities, max = 6, className }: AmenityListProps) {
  const visible = amenities.slice(0, max);
  const remaining = amenities.length - visible.length;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((a) => (
        <AmenityChip key={a} nameAr={a} />
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-[#F5F0EA] text-[#A89480]">
          +{remaining}
        </span>
      )}
    </div>
  );
}
