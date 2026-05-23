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
          ? "bg-[#E6F0EF] text-[#0A3C36] border border-[#0A3C36]/20"
          : "bg-[#F0F4F8] text-[#627D98]",
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
        <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-lg bg-[#F0F4F8] text-[#627D98]">
          +{remaining}
        </span>
      )}
    </div>
  );
}
