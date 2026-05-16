import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";

interface ListingQualityBadgeProps {
  score: number;
  className?: string;
}

function getQualityConfig(score: number) {
  if (score >= 90) return { labelAr: "ممتاز",  bg: "#EDF4ED", text: "#5B8C5A", bar: "#5B8C5A" };
  if (score >= 75) return { labelAr: "جيد جداً", bg: "#FDF6EE", text: "#C49060", bar: "#D4A373" };
  if (score >= 60) return { labelAr: "جيد",    bg: "#FFF8E6", text: "#C8860A", bar: "#C8860A" };
  return                  { labelAr: "عادي",   bg: "#F5F0EA", text: "#7A6B5E", bar: "#A89480" };
}

export function ListingQualityBadge({ score, className }: ListingQualityBadgeProps) {
  const cfg = getQualityConfig(score);

  return (
    <div
      className={cn("inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold", className)}
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      <div className="w-14 h-1.5 rounded-full bg-black/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, backgroundColor: cfg.bar }}
        />
      </div>
      {toArabicNumerals(score)}% {cfg.labelAr}
    </div>
  );
}
