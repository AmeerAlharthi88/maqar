"use client";

import dynamic from "next/dynamic";
import type { AnalyticsTimePoint } from "@/mock/agent-analytics";

const AnalyticsChartInner = dynamic(
  () => import("./AnalyticsChartInner"),
  { ssr: false, loading: () => <div className="h-[200px] flex items-center justify-center"><span className="w-6 h-6 rounded-full border-2 border-[#E8DDD0] border-t-[#C65D3B] animate-spin" /></div> }
);

interface ChartLine {
  key: keyof AnalyticsTimePoint;
  labelAr: string;
  color: string;
}

interface DashboardChartCardProps {
  titleAr: string;
  data: AnalyticsTimePoint[];
  lines: ChartLine[];
}

export function DashboardChartCard({ titleAr, data, lines }: DashboardChartCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4" dir="rtl">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-[#1E1E1E]">{titleAr}</p>
        {/* Legend */}
        <div className="flex items-center gap-3">
          {lines.map((l) => (
            <div key={l.key as string} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
              <span className="text-[10px] text-[#A89480]">{l.labelAr}</span>
            </div>
          ))}
        </div>
      </div>
      <AnalyticsChartInner data={data} lines={lines} />
    </div>
  );
}
