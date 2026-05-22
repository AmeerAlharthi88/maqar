"use client";

import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/language.store";

interface StatCardProps {
  labelAr: string;
  labelEn?: string;
  value: string | number;
  change?: {
    pct: number;
    direction: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ labelAr, labelEn, value, change, icon, className }: StatCardProps) {
  const { locale } = useLanguageStore();
  const isAr = locale === "ar";
  const label = isAr ? labelAr : (labelEn ?? labelAr);
  const changeLabel = isAr ? "مقارنة بالعام السابق" : "vs last year";

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-4 border border-[#E2E8F0]",
        "shadow-[0_4px_20px_0_rgb(10_60_54/0.04)] flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-[#627D98]">{label}</p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[#E6F0EF] flex items-center justify-center text-[#0A3C36]">
            {icon}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold text-[#102A43]">{value}</p>
        {change && (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "text-xs font-semibold",
                change.direction === "up"      ? "text-[#2D7A4F]" :
                change.direction === "down"    ? "text-[#C0392B]" :
                                                  "text-[#627D98]"
              )}
            >
              {change.direction === "up" ? "+" : change.direction === "down" ? "-" : ""}
              {Math.abs(change.pct)}%
            </span>
            <span className="text-xs text-[#A0AEC0]">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
