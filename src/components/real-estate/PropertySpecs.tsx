import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/formatters";
import type { PropertySpecs as PropertySpecsType } from "@/types/listing";
import type { Locale } from "@/i18n/types";

interface PropertySpecsProps {
  specs: PropertySpecsType;
  propertyType?: string;
  size?: "sm" | "md";
  className?: string;
  locale?: Locale;
}

/**
 * Key facts as readable, labelled text (e.g. "٥ غرف · ٤ حمامات · ٣٥٠ م²" /
 * "5 beds · 4 baths · 350 m²") — no more ambiguous tiny icons (FP17F-1).
 */
export function PropertySpecs({ specs, propertyType, size = "md", className, locale = "ar" }: PropertySpecsProps) {
  const isLand = propertyType === "land";
  const isAr = locale === "ar";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const areaUnit = isAr ? "م²" : "m²";
  const areaVal = specs.area > 0 ? specs.area : (specs.landArea ?? 0);

  const parts: string[] = [];
  if (!isLand) {
    if (specs.bedrooms > 0) parts.push(`${formatNumber(specs.bedrooms, locale)} ${isAr ? "غرف" : "beds"}`);
    if (specs.bathrooms > 0) parts.push(`${formatNumber(specs.bathrooms, locale)} ${isAr ? "حمامات" : "baths"}`);
  }
  if (areaVal > 0) parts.push(`${formatNumber(areaVal, locale)} ${areaUnit}`);

  if (parts.length === 0) return null;

  return (
    <p className={cn(textSize, "font-medium text-[#334E68]", className)}>
      {parts.join("  ·  ")}
    </p>
  );
}
