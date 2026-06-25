"use client";

import { useLocaleStore } from "@/store/locale.store";

interface DashboardMetricCardProps {
  labelAr: string;
  /** English label. Falls back to labelAr when omitted (keeps old call sites working). */
  labelEn?: string;
  value: string | number;
  subLabelAr?: string;
  subLabelEn?: string;
  icon?: React.ReactNode;
  trend?: { value: string; up: boolean } | null;
  accent?: boolean;
}

export function DashboardMetricCard({
  labelAr,
  labelEn,
  value,
  subLabelAr,
  subLabelEn,
  icon,
  trend,
  accent = false,
}: DashboardMetricCardProps) {
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const label = isAr ? labelAr : (labelEn ?? labelAr);
  const subLabel = isAr ? subLabelAr : (subLabelEn ?? subLabelAr);
  return (
    <div
      className={[
        "rounded-2xl px-4 py-4 flex flex-col gap-1 border",
        accent
          ? "bg-[#0A3C36] border-transparent"
          : "bg-white border-[#E2E8F0]",
      ].join(" ")}
    >
      {icon && (
        <span className={accent ? "text-white/80" : "text-[#627D98]"}>
          {icon}
        </span>
      )}
      <p
        className={[
          "text-2xl font-bold leading-none",
          accent ? "text-white" : "text-[#102A43]",
        ].join(" ")}
      >
        {value}
      </p>
      <p
        className={[
          "text-xs font-medium",
          accent ? "text-white/80" : "text-[#627D98]",
        ].join(" ")}
      >
        {label}
      </p>
      {subLabel && (
        <p className={["text-[10px]", accent ? "text-white/60" : "text-[#627D98]"].join(" ")}>
          {subLabel}
        </p>
      )}
      {trend && (
        <p
          className={[
            "text-[10px] font-semibold",
            trend.up ? "text-[#0A3C36]" : "text-[#C0392B]",
            accent ? "opacity-90" : "",
          ].join(" ")}
        >
          {trend.up ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </div>
  );
}
