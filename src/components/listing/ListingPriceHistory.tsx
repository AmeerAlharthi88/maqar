"use client";

import dynamic from "next/dynamic";
import { toArabicNumerals } from "@/lib/formatters";
import type { PricePoint } from "@/lib/helpers/listing-detail";
import type { Listing } from "@/types/listing";

// Lazy-load Recharts to avoid SSR issues
const DynamicChart = dynamic(() => import("./PriceHistoryChart"), { ssr: false });

interface ListingPriceHistoryProps {
  listing: Listing;
  history: PricePoint[];
}

export function ListingPriceHistory({
  listing,
  history,
}: ListingPriceHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="px-4 py-4 border-t border-[#E2E8F0]">
        <h2 className="text-base font-bold text-[#102A43] mb-2">سجل الأسعار</h2>
        <p className="text-sm text-[#627D98]">لا تتوفر بيانات تاريخية للسعر</p>
      </div>
    );
  }

  const min = Math.min(...history.map((h) => h.price));
  const max = Math.max(...history.map((h) => h.price));
  const priceDiff = history[history.length - 1].price - history[0].price;
  const pctChange = ((priceDiff / history[0].price) * 100).toFixed(1);
  const trend = priceDiff >= 0 ? "up" : "down";

  return (
    <div className="px-4 py-4 border-t border-[#E2E8F0]">
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-base font-bold text-[#102A43]">سجل الأسعار</h2>
        <span className="text-[10px] text-[#627D98] bg-[#F0F4F8] border border-[#E2E8F0] px-2 py-0.5 rounded-full">
          بيانات تقديرية
        </span>
      </div>

      {/* Trend summary */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${
            trend === "up" ? "text-[#0A3C36]" : "text-[#C0392B]"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {trend === "up"
              ? <path d="M12 19V5M5 12l7-7 7 7" />
              : <path d="M12 5v14M5 12l7 7 7-7" />
            }
          </svg>
          {trend === "up" ? "+" : ""}{toArabicNumerals(pctChange)}% خلال ١٢ شهراً
        </span>
        <span className="text-xs text-[#627D98]">
          النطاق: {toArabicNumerals(min.toLocaleString("en-US"))} — {toArabicNumerals(max.toLocaleString("en-US"))} ر.ع
        </span>
      </div>

      {/* Chart */}
      <div className="h-44 w-full -mx-1">
        <DynamicChart
          history={history}
          purpose={listing.purpose}
        />
      </div>
    </div>
  );
}
