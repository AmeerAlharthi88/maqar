"use client";

// ── PricePerSqmCalculator — price per sqm vs area average ─────────────────────

import { useState, useMemo } from "react";
import { CalculatorInput } from "@/components/calculators/CalculatorInput";
import { CalculatorResultCard } from "@/components/calculators/CalculatorResultCard";
import { CalculatorSummary } from "@/components/calculators/CalculatorSummary";
import { MarketDisclaimer } from "@/components/market/MarketDisclaimer";
import { calculatePricePerSqm } from "@/lib/calculators/price-per-sqm";
import { ALL_GOVERNORATES } from "@/mock/market-data";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";

const AREA_OPTIONS = ALL_GOVERNORATES.flatMap((g) =>
  g.wilayats.flatMap((w) =>
    w.areas.map((a) => ({
      id: a.id,
      label: `${a.nameAr} — ${w.nameAr}`,
      avgPricePerSqm: a.pricePerSqm,
    }))
  )
);

export function PricePerSqmCalculator() {
  const [price, setPrice] = useState("80000");
  const [areaSqm, setAreaSqm] = useState("200");
  const [selectedAreaId, setSelectedAreaId] = useState("");

  const selectedArea = AREA_OPTIONS.find((a) => a.id === selectedAreaId);

  const result = useMemo(() => {
    const p = parseFloat(price) || 0;
    const s = parseFloat(areaSqm) || 0;

    return calculatePricePerSqm({
      price: p,
      areaSqm: s,
      areaAvgPricePerSqm: selectedArea?.avgPricePerSqm,
    });
  }, [price, areaSqm, selectedArea]);

  const positionColor =
    result.position === "above"
      ? "text-[#C65D3B]"
      : result.position === "below"
      ? "text-[#5B8C5A]"
      : "text-[#7A6B5E]";

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-[#F0EBE3] p-4 space-y-4">
        <h2 className="text-sm font-bold text-[#1E1E1E]">بيانات العقار</h2>

        <CalculatorInput
          label="سعر العقار"
          value={price}
          onChange={setPrice}
          suffix="ر.ع."
          min={1000}
          step={1000}
        />
        <CalculatorInput
          label="مساحة العقار"
          value={areaSqm}
          onChange={setAreaSqm}
          suffix="م²"
          min={10}
          step={10}
        />

        {/* Area selector for comparison */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#1E1E1E]">
            مقارنة بمتوسط منطقة (اختياري)
          </label>
          <select
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            className="w-full h-11 bg-white border border-[#E8DDD0] rounded-xl px-3.5 text-sm text-[#1E1E1E] outline-none focus:border-[#C65D3B]"
            dir="rtl"
          >
            <option value="">— اختر منطقة للمقارنة —</option>
            {AREA_OPTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label} ({toArabicNumerals(a.avgPricePerSqm)} ر.ع./م²)
              </option>
            ))}
          </select>
          {selectedArea && (
            <p className="text-xs text-[#7A6B5E]">
              متوسط المنطقة:{" "}
              <span className="font-semibold">
                {toArabicNumerals(selectedArea.avgPricePerSqm)} ر.ع./م²
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <CalculatorSummary title="نتيجة الحساب">
        <CalculatorResultCard
          label="سعر المتر المربع لعقارك"
          value={`${toArabicNumerals(result.pricePerSqm)} ر.ع./م²`}
          accent="blue"
          large
        />

        {selectedArea && result.pricePerSqm > 0 && (
          <div className="bg-[#F5F0EA] rounded-2xl p-4 border border-[#E8DDD0]">
            <p className="text-xs text-[#7A6B5E] mb-1">المقارنة بمتوسط {selectedArea.label}</p>
            <p className={`text-sm font-bold ${positionColor}`}>
              {result.positionLabel}
            </p>
            {result.comparisonPct !== undefined && (
              <p className="text-xs text-[#A89480] mt-0.5">
                متوسط المنطقة: {toArabicNumerals(selectedArea.avgPricePerSqm)} ر.ع./م²
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <CalculatorResultCard
            label="إجمالي السعر"
            value={formatOMR(parseFloat(price) || 0, { arabic: true, compact: true })}
            accent="default"
          />
          <CalculatorResultCard
            label="المساحة"
            value={`${toArabicNumerals(parseFloat(areaSqm) || 0)} م²`}
            accent="default"
          />
        </div>
      </CalculatorSummary>

      <MarketDisclaimer variant="banner" />
    </div>
  );
}
