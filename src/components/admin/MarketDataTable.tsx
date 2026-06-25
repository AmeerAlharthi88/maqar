"use client";

import type { AdminMarketDataRow } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";
import { bi, displayMeta } from "@/lib/admin/labels";

interface MarketDataTableProps {
  rows: AdminMarketDataRow[];
}

export function MarketDataTable({ rows }: MarketDataTableProps) {
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const numLocale = isAr ? "ar-OM" : "en-OM";
  const headers = isAr
    ? ["المنطقة", "الولاية", "متوسط البيع (ر.ع.)", "متوسط الإيجار", "سعر/م²", "العائد", "الطلب", "آخر تحديث"]
    : ["Area", "Wilayat", "Avg sale (OMR)", "Avg rent", "Price/sqm", "Yield", "Demand", "Updated"];
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Desktop-friendly scrollable table */}
      <div className="overflow-x-auto">
        <table className={`w-full min-w-[640px] ${isAr ? "text-right" : "text-left"}`}>
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-[#E2E8F0]">
              {headers.map((h) => (
                <th key={h} className="px-3 py-3 text-[10px] font-bold text-[#627D98] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]/50"}>
                <td className="px-3 py-3 text-sm font-bold text-[#102A43] whitespace-nowrap">{displayMeta(row.areaAr, isAr)}</td>
                <td className="px-3 py-3 text-xs text-[#627D98] whitespace-nowrap">{displayMeta(row.wilayatAr, isAr)}</td>
                <td className="px-3 py-3 text-xs font-bold text-[#0A3C36] whitespace-nowrap">
                  {row.avgSalePrice.toLocaleString(numLocale)}
                </td>
                <td className="px-3 py-3 text-xs text-[#102A43] whitespace-nowrap">
                  {row.avgRentPrice.toLocaleString(numLocale)}
                </td>
                <td className="px-3 py-3 text-xs text-[#102A43] whitespace-nowrap">
                  {row.pricePerSqm.toLocaleString(numLocale)}
                </td>
                <td className="px-3 py-3 text-xs text-[#0A3C36] font-bold whitespace-nowrap">
                  {row.rentalYield}{isAr ? "٪" : "%"}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0A3C36] rounded-full"
                        style={{ width: `${row.demandScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#627D98]">{row.demandScore}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-[10px] text-[#627D98] whitespace-nowrap">
                  {new Date(row.lastUpdated).toLocaleDateString(numLocale, { month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data source notice */}
      <div className="px-4 py-3 bg-[#F8F9FA] border-t border-[#E2E8F0]">
        <p className="text-[10px] text-[#627D98]">
          {bi(isAr,
            "المصدر: بيانات إدارية — مقر. هذه بيانات تجريبية وليست بيانات سوق حقيقية. Phase 12 سيربطها بمصادر رسمية.",
            "Source: Maqar admin data. These are demo figures, not real market data. Phase 12 will connect official sources.")}
        </p>
      </div>
    </div>
  );
}
