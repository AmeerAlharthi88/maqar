// ── GovernorateComparisonChart — SSR-safe wrapper ────────────────────────────

"use client";

import dynamic from "next/dynamic";
import type { GovernorateMarketData } from "@/types/market";

const Inner = dynamic(() => import("./GovernorateComparisonChartInner"), {
  ssr: false,
});

interface GovernorateComparisonChartProps {
  data: GovernorateMarketData[];
  metric?: "avgSalePrice" | "avgRentPrice" | "rentalYield" | "demandScore";
  title?: string;
}

export function GovernorateComparisonChart({
  data,
  metric = "avgSalePrice",
  title,
}: GovernorateComparisonChartProps) {
  return (
    <div>
      {title && (
        <h2 className="text-base font-bold text-[#1E1E1E] mb-3">{title}</h2>
      )}
      <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4">
        <Inner data={data} metric={metric} />
      </div>
    </div>
  );
}
