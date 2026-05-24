"use client";

// ── MarketTrendChartInner — Recharts area chart for price trends ──────────────
// Must be "use client" — imported via dynamic() with ssr:false from MarketTrendChart

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyTrendPoint } from "@/types/market";

interface MarketTrendChartInnerProps {
  data: MonthlyTrendPoint[];
  mode?: "sale" | "rent";
}

function formatValue(value: number, mode: "sale" | "rent"): string {
  if (mode === "sale") {
    return value >= 1000 ? `${(value / 1000).toFixed(0)}ك` : String(value);
  }
  return String(value);
}

export default function MarketTrendChartInner({
  data,
  mode = "sale",
}: MarketTrendChartInnerProps) {
  const dataKey = mode === "sale" ? "avgSalePrice" : "avgRentPrice";
  const color = mode === "sale" ? "#0A3C36" : "#2471A3";
  const label = mode === "sale" ? "متوسط سعر البيع" : "متوسط الإيجار الشهري";

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${mode}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.18} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "#627D98" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v: number) => formatValue(v, mode)}
          tick={{ fontSize: 10, fill: "#627D98" }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          formatter={(value) => [
            typeof value === "number"
              ? `${value.toLocaleString("en-US")} ر.ع.`
              : String(value),
            label,
          ]}
          labelStyle={{ fontFamily: "inherit", color: "#102A43" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${mode})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
