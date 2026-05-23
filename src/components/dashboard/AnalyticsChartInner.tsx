"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { AnalyticsTimePoint } from "@/mock/agent-analytics";

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 shadow-sm text-right" dir="rtl">
      <p className="text-[10px] text-[#627D98] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-bold" style={{ color: p.color }}>
          {p.value} — {p.name}
        </p>
      ))}
    </div>
  );
}

interface AnalyticsChartInnerProps {
  data: AnalyticsTimePoint[];
  lines: Array<{ key: keyof AnalyticsTimePoint; labelAr: string; color: string }>;
}

export default function AnalyticsChartInner({ data, lines }: AnalyticsChartInnerProps) {
  // Show only every 5th date label to avoid crowding
  const formatted = data.map((d, i) => ({
    ...d,
    displayDate: i % 5 === 0 ? d.date.slice(5) : "",
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={formatted} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="displayDate"
          tick={{ fontSize: 10, fill: "#627D98" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: "#627D98" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        {lines.map((l) => (
          <Line
            key={l.key as string}
            type="monotone"
            dataKey={l.key as string}
            name={l.labelAr}
            stroke={l.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
