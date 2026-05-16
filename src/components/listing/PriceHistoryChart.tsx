"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toArabicNumerals } from "@/lib/formatters";
import type { PricePoint } from "@/lib/helpers/listing-detail";

interface PriceHistoryChartProps {
  history: PricePoint[];
  purpose: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  purpose,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  purpose: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0].value;
  const suffix = purpose === "rent" ? "ر.ع/شهر" : "ر.ع";
  return (
    <div className="bg-white border border-[#E8DDD0] rounded-xl px-3 py-2 shadow-md text-xs" dir="rtl">
      <p className="text-[#7A6B5E] mb-0.5">{label}</p>
      <p className="font-bold text-[#1E1E1E]">
        {toArabicNumerals(value.toLocaleString("en-US"))} {suffix}
      </p>
    </div>
  );
}

export default function PriceHistoryChart({ history, purpose }: PriceHistoryChartProps) {
  const prices = history.map((h) => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.15 || maxPrice * 0.05;
  const domainMin = Math.floor((minPrice - padding) / 1000) * 1000;
  const domainMax = Math.ceil((maxPrice + padding) / 1000) * 1000;

  const lineColor = "#C65D3B";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={history}
        margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={lineColor} stopOpacity={0.15} />
            <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#F0EBE3"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "#A89480", fontFamily: "inherit" }}
          tickLine={false}
          axisLine={false}
          interval={2}
        />
        <YAxis
          domain={[domainMin, domainMax]}
          tick={{ fontSize: 10, fill: "#A89480", fontFamily: "inherit" }}
          tickLine={false}
          axisLine={false}
          width={52}
          tickFormatter={(v: number) => {
            if (v >= 1000) return toArabicNumerals((v / 1000).toFixed(0)) + "ك";
            return toArabicNumerals(v.toString());
          }}
        />
        <Tooltip
          content={<CustomTooltip purpose={purpose} />}
          cursor={{ stroke: "#C65D3B", strokeWidth: 1, strokeDasharray: "4 2" }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={lineColor}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: lineColor, stroke: "#fff", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
