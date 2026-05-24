"use client";

// ── RentalYieldCalculator — gross & net rental yield calculator ───────────────

import { useState, useMemo } from "react";
import { CalculatorInput } from "@/components/calculators/CalculatorInput";
import { CalculatorResultCard } from "@/components/calculators/CalculatorResultCard";
import { CalculatorSummary } from "@/components/calculators/CalculatorSummary";
import { MarketDisclaimer } from "@/components/market/MarketDisclaimer";
import { YieldBadge } from "@/components/market/YieldBadge";
import { calculateRentalYield } from "@/lib/calculators/rental-yield";
import { ALL_GOVERNORATES } from "@/mock/market-data";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";

// Build flat area options with their avg yields
const AREA_OPTIONS = ALL_GOVERNORATES.flatMap((g) =>
  g.wilayats.flatMap((w) =>
    w.areas.map((a) => ({
      id: a.id,
      label: `${a.nameAr} — ${w.nameAr}`,
      avgYield: a.rentalYield,
    }))
  )
);

export function RentalYieldCalculator() {
  const [purchasePrice, setPurchasePrice] = useState("75000");
  const [monthlyRent, setMonthlyRent] = useState("325");
  const [annualExpenses, setAnnualExpenses] = useState("1200");
  const [selectedAreaId, setSelectedAreaId] = useState("");

  const selectedArea = AREA_OPTIONS.find((a) => a.id === selectedAreaId);

  const result = useMemo(() => {
    const p = parseFloat(purchasePrice) || 0;
    const r = parseFloat(monthlyRent) || 0;
    const e = parseFloat(annualExpenses) || 0;

    return calculateRentalYield(
      { purchasePrice: p, monthlyRent: r, annualExpenses: e },
      selectedArea?.avgYield
    );
  }, [purchasePrice, monthlyRent, annualExpenses, selectedArea]);

  const areaDiff = result.areaComparisonPct;

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-4">
        <h2 className="text-sm font-bold text-[#102A43]">بيانات العقار</h2>

        <CalculatorInput
          label="سعر الشراء"
          value={purchasePrice}
          onChange={setPurchasePrice}
          suffix="ر.ع."
          min={5000}
          step={1000}
        />
        <CalculatorInput
          label="الإيجار الشهري"
          value={monthlyRent}
          onChange={setMonthlyRent}
          suffix="ر.ع./شهر"
          min={50}
          step={25}
        />
        <CalculatorInput
          label="المصاريف السنوية"
          value={annualExpenses}
          onChange={setAnnualExpenses}
          suffix="ر.ع./سنة"
          min={0}
          step={100}
          hint="صيانة، رسوم إدارية، تأمين"
        />

        {/* Area comparison selector */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[#102A43]">
            مقارنة بمتوسط منطقة (اختياري)
          </label>
          <select
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            className="w-full h-11 bg-white border border-[#E2E8F0] rounded-xl px-3.5 text-sm text-[#102A43] outline-none focus:border-[#0A3C36]"
            dir="rtl"
          >
            <option value="">— اختر منطقة للمقارنة —</option>
            {AREA_OPTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label} ({toArabicNumerals(a.avgYield)}% متوسط)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <CalculatorSummary title="نتائج العائد الإيجاري">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-[#627D98]">تصنيف عائدك:</span>
          <YieldBadge pct={result.netYieldPct} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <CalculatorResultCard
            label="العائد الإجمالي"
            value={`${toArabicNumerals(result.grossYieldPct)}%`}
            accent="green"
            large
          />
          <CalculatorResultCard
            label="العائد الصافي"
            value={`${toArabicNumerals(result.netYieldPct)}%`}
            accent="green"
            large
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <CalculatorResultCard
            label="الإيجار السنوي"
            value={formatOMR(result.annualRent, { arabic: true, compact: true })}
            accent="default"
          />
          <CalculatorResultCard
            label="الدخل الصافي السنوي"
            value={formatOMR(result.annualNetIncome, { arabic: true, compact: true })}
            accent="default"
          />
        </div>

        {/* Area comparison */}
        {selectedArea && areaDiff !== undefined && (
          <div className="bg-[#F0F4F8] rounded-2xl p-4 border border-[#E2E8F0]">
            <p className="text-xs text-[#627D98] mb-1">مقارنة بمتوسط {selectedArea.label}</p>
            <p
              className={`text-sm font-bold ${areaDiff >= 0 ? "text-[#0A3C36]" : "text-[#C0392B]"}`}
            >
              {areaDiff >= 0 ? "+" : ""}
              {toArabicNumerals(areaDiff)}% مقارنة بالمتوسط (
              {toArabicNumerals(selectedArea.avgYield)}%)
            </p>
          </div>
        )}
      </CalculatorSummary>

      <MarketDisclaimer variant="banner" />
    </div>
  );
}
