"use client";

import type { AdminMarketDataRow } from "@/types/admin";

interface MarketDataTableProps {
  rows: AdminMarketDataRow[];
}

export function MarketDataTable({ rows }: MarketDataTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden" dir="rtl">
      {/* Desktop-friendly scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-right">
          <thead>
            <tr className="bg-[#FAF7F4] border-b border-[#F0EBE3]">
              {["المنطقة", "الولاية", "متوسط البيع (ر.ع.)", "متوسط الإيجار", "سعر/م²", "العائد", "الطلب", "آخر تحديث"].map((h) => (
                <th key={h} className="px-3 py-3 text-[10px] font-bold text-[#7A6B5E] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#FAF7F4]/50"}>
                <td className="px-3 py-3 text-sm font-bold text-[#1E1E1E] whitespace-nowrap">{row.areaAr}</td>
                <td className="px-3 py-3 text-xs text-[#7A6B5E] whitespace-nowrap">{row.wilayatAr}</td>
                <td className="px-3 py-3 text-xs font-bold text-[#C65D3B] whitespace-nowrap">
                  {row.avgSalePrice.toLocaleString("ar-OM")}
                </td>
                <td className="px-3 py-3 text-xs text-[#1E1E1E] whitespace-nowrap">
                  {row.avgRentPrice.toLocaleString("ar-OM")}
                </td>
                <td className="px-3 py-3 text-xs text-[#1E1E1E] whitespace-nowrap">
                  {row.pricePerSqm.toLocaleString("ar-OM")}
                </td>
                <td className="px-3 py-3 text-xs text-[#5B8C5A] font-bold whitespace-nowrap">
                  {row.rentalYield}٪
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-[#F0EBE3] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C65D3B] rounded-full"
                        style={{ width: `${row.demandScore}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#7A6B5E]">{row.demandScore}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-[10px] text-[#A89480] whitespace-nowrap">
                  {new Date(row.lastUpdated).toLocaleDateString("ar-OM", { month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data source notice */}
      <div className="px-4 py-3 bg-[#FAF7F4] border-t border-[#F0EBE3]">
        <p className="text-[10px] text-[#A89480]">
          المصدر: بيانات إدارية — مقر. هذه بيانات تجريبية وليست بيانات سوق حقيقية. Phase 12 سيربطها بمصادر رسمية.
        </p>
      </div>
    </div>
  );
}
