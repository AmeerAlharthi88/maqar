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
        "bg-white rounded-2xl p-4 border border-[#F0EBE3]",
        "shadow-[0_2px_8px_0_rgb(30_30_30/0.06)] flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-[#7A6B5E]">{label}</p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[#FBF0EB] flex items-center justify-center text-[#C65D3B]">
            {icon}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold text-[#1E1E1E]">{value}</p>
        {change && (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "text-xs font-semibold",
                change.direction === "up"      ? "text-[#5B8C5A]" :
                change.direction === "down"    ? "text-[#C0392B]" :
                                                  "text-[#7A6B5E]"
              )}
            >
              {change.direction === "up" ? "+" : change.direction === "down" ? "-" : ""}
              {Math.abs(change.pct)}%
            </span>
            <span className="text-xs text-[#A89480]">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
