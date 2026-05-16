"use client";

// ── GovernorateComparisonChartInner — Recharts bar chart ─────────────────────
// Must be "use client" — imported via dynamic() with ssr:false

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { GovernorateMarketData } from "@/types/market";

interface GovernorateComparisonChartInnerProps {
  data: GovernorateMarketData[];
  metric?: "avgSalePrice" | "avgRentPrice" | "rentalYield" | "demandScore";
}

const COLORS = ["#C65D3B", "#2471A3", "#5B8C5A", "#C8860A", "#8E44AD", "#16A085"];

export default function GovernorateComparisonChartInner({
  data,
  metric = "avgSalePrice",
}: GovernorateComparisonChartInnerProps) {
  const chartData = data.map((g) => ({
    name: g.nameAr,
    value: g[metric],
  }));

  const labelMap: Record<typeof metric, string> = {
    avgSalePrice: "متوسط سعر البيع (ر.ع.)",
    avgRentPrice: "متوسط الإيجار (ر.ع./شهر)",
    rentalYield: "العائد الإيجاري (%)",
    demandScore: "مؤشر الطلب",
  };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE3" horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}ك` : String(v)
          }
          tick={{ fontSize: 10, fill: "#A89480" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 10, fill: "#7A6B5E" }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip
          formatter={(value) => [
            metric === "avgSalePrice" || metric === "avgRentPrice"
              ? `${typeof value === "number" ? value.toLocaleString("en-US") : value} ر.ع.`
              : `${value}${metric === "rentalYield" ? "%" : ""}`,
            labelMap[metric],
          ]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #F0EBE3",
            fontSize: 12,
          }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
