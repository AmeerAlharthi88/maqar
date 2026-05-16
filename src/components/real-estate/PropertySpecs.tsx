import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";
import type { PropertySpecs as PropertySpecsType } from "@/types/listing";

interface PropertySpecsProps {
  specs: PropertySpecsType;
  propertyType?: string;
  size?: "sm" | "md";
  className?: string;
}

export function PropertySpecs({ specs, propertyType, size = "md", className }: PropertySpecsProps) {
  const isLand = propertyType === "land";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const iconSize = size === "sm" ? 14 : 16;

  const items = isLand
    ? [{ icon: <AreaIcon size={iconSize} />, value: `${toArabicNumerals(specs.area)} م²`, label: "المساحة" }]
    : [
        ...(specs.bedrooms > 0 ? [{ icon: <BedIcon size={iconSize} />, value: toArabicNumerals(specs.bedrooms), label: "غرف" }] : []),
        { icon: <BathIcon size={iconSize} />, value: toArabicNumerals(specs.bathrooms), label: "حمامات" },
        { icon: <AreaIcon size={iconSize} />, value: `${toArabicNumerals(specs.area)} م²`, label: "المساحة" },
        ...(specs.parkingSpots ? [{ icon: <ParkingIcon size={iconSize} />, value: toArabicNumerals(specs.parkingSpots), label: "مواقف" }] : []),
      ];

  return (
    <div className={cn("flex items-center gap-3 flex-wrap", className)}>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1 text-[#7A6B5E]">
          <span className="flex-shrink-0">{item.icon}</span>
          <span className={cn(textSize, "font-medium text-[#1E1E1E]")}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function BedIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 20V11a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v9" />
      <path d="M2 14h20" />
      <path d="M7 11v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4" />
    </svg>
  );
}

function BathIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
      <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" />
    </svg>
  );
}

function AreaIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M3 9h18" strokeDasharray="2 2" />
    </svg>
  );
}

function ParkingIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </svg>
  );
}
