import { cn } from "@/lib/utils";
import {
  getLocalizedGovernorate,
  getLocalizedWilayat,
  getLocalizedArea,
} from "@/lib/constants/oman-locations";
import type { Locale } from "@/i18n/types";

interface LocationBreadcrumbProps {
  governorateAr?: string;
  wilayatAr?: string;
  areaAr?: string;
  /** Stable IDs used to look up English names. */
  governorateId?: string;
  wilayatId?: string;
  areaId?: string;
  locale?: Locale;
  size?: "sm" | "md";
  className?: string;
}

export function LocationBreadcrumb({
  governorateAr = "",
  wilayatAr = "",
  areaAr = "",
  governorateId = "",
  wilayatId = "",
  areaId = "",
  locale = "ar",
  size = "sm",
  className,
}: LocationBreadcrumbProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  // Resolve display names: use English lookup when locale=en and IDs are available.
  const govLabel = governorateId
    ? getLocalizedGovernorate(governorateId, locale, governorateAr)
    : governorateAr;

  const wilLabel = (governorateId && wilayatId)
    ? getLocalizedWilayat(governorateId, wilayatId, locale, wilayatAr)
    : wilayatAr;

  const areaLabel = (governorateId && wilayatId && areaId)
    ? getLocalizedArea(governorateId, wilayatId, areaId, locale, areaAr)
    : areaAr;

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", textSize, "text-[#627D98]", className)}>
      <PinIcon />
      {govLabel && <span>{govLabel}</span>}
      {govLabel && wilLabel && <Separator />}
      {wilLabel && <span>{wilLabel}</span>}
      {wilLabel && areaLabel && <Separator />}
      {areaLabel && <span className="font-medium text-[#102A43]">{areaLabel}</span>}
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-[#0A3C36]">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function Separator() {
  return <span className="text-[#E2E8F0]" aria-hidden="true">/</span>;
}
