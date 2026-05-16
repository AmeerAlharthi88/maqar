import { cn } from "@/lib/utils";
import type { LocationBreadcrumb as LocationBreadcrumbType } from "@/types/location";

interface LocationBreadcrumbProps extends LocationBreadcrumbType {
  size?: "sm" | "md";
  className?: string;
}

export function LocationBreadcrumb({
  governorateAr,
  wilayatAr,
  areaAr,
  size = "sm",
  className,
}: LocationBreadcrumbProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", textSize, "text-[#7A6B5E]", className)}>
      <PinIcon />
      <span>{governorateAr}</span>
      <Separator />
      <span>{wilayatAr}</span>
      <Separator />
      <span className="font-medium text-[#1E1E1E]">{areaAr}</span>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-[#C65D3B]">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function Separator() {
  return <span className="text-[#E8DDD0]" aria-hidden="true">/</span>;
}
