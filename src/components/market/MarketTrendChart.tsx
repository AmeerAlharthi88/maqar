// ── MarketTrendChart — SSR-safe wrapper using dynamic import ─────────────────

"use client";

import dynamic from "next/dynamic";
import type { MonthlyTrendPoint } from "@/types/market";

const Inner = dynamic(() => import("./MarketTrendChartInner"), { ssr: false });

interface MarketTrendChartProps {
  data: MonthlyTrendPoint[];
  mode?: "sale" | "rent";
  title?: string;
}

export function MarketTrendChart({ data, mode = "sale", title }: MarketTrendChartProps) {
  return (
    <div>
      {title && (
        <h2 className="text-base font-bold text-[#102A43] mb-3">{title}</h2>
      )}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
        <Inner data={data} mode={mode} />
      </div>
    </div>
  );
}
