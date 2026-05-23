"use client";

import type { AdminMarketDataRow } from "@/types/admin";

interface MarketDataTableProps {
  rows: AdminMarketDataRow[];
}

export function MarketDataTable({ rows }: MarketDataTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden" dir="rtl">
      {/* Desktop-friendly scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-right">
          <thead>
            <tr className="bg-[#F8F9FA] border-b border-[#E2E8F0]">
              {["المنطقة", "الولاية", "متوسط البيع (ر.ع.)", "متوسط الإيجار", "سعر/م²", "العائد", "الطلب", "آخر تحديث"].map((h) => (
                <th key={h} className="px-3 py-3 text-[10px] font-bold text-[#627D98] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]/50"}>
                <td className="px-3 py-3 text-sm font-bold text-[#102A43] whitespace-nowrap">{row.areaAr}</td>
                <td className="px-3 py-3 text-xs text-[#627D98] whitespace-nowrap">{row.wilayatAr}</td>
                <td className="px-3 py-3 text-xs font-bold text-[#0A3C36] whitespace-nowrap">
                  {row.avgSalePrice.toLocaleString("ar-OM")}
                </td>
                <td className="px-3 py-3 text-xs text-[#102A43] whitespace-nowrap">
                  {row.avgRentPrice.toLocaleString("ar-OM")}
                </td>
                <td className="px-3 py-3 text-xs text-[#102A43] whitespace-nowrap">
                  {row.pricePerSqm.toLocaleString("ar-OM")}
                </td>
                <td className="px-3 py-3 text-xs text-[#0A3C36] font-bold whitespace-nowrap">
                  {row.rentalYield}٪
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
                  {new Date(row.lastUpdated).toLocaleDateString("ar-OM", { month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data source notice */}
      <div className="px-4 py-3 bg-[#F8F9FA] border-t border-[#E2E8F0]">
        <p className="text-[10px] text-[#627D98]">
          المصدر: بيانات إدارية — مقر. هذه بيانات تجريبية وليست بيانات سوق حقيقية. Phase 12 سيربطها بمصادر رسمية.
        </p>
      </div>
    </div>
  );
}
