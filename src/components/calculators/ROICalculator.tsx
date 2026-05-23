"use client";

// ── ROICalculator — interactive return on investment calculator ────────────────

import { useState, useMemo } from "react";
import { CalculatorInput } from "@/components/calculators/CalculatorInput";
import { CalculatorResultCard } from "@/components/calculators/CalculatorResultCard";
import { CalculatorSummary } from "@/components/calculators/CalculatorSummary";
import { MarketDisclaimer } from "@/components/market/MarketDisclaimer";
import { MarketInsightPanel } from "@/components/market/MarketInsightPanel";
import { YieldBadge } from "@/components/market/YieldBadge";
import { calculateROI } from "@/lib/calculators/roi";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";

export function ROICalculator() {
  const [purchasePrice, setPurchasePrice] = useState("80000");
  const [monthlyRent, setMonthlyRent] = useState("350");
  const [annualExpenses, setAnnualExpenses] = useState("1500");
  const [occupancyPct, setOccupancyPct] = useState("90");

  const result = useMemo(() => {
    const p = parseFloat(purchasePrice) || 0;
    const r = (parseFloat(monthlyRent) || 0) * 12;
    const e = parseFloat(annualExpenses) || 0;
    const o = Math.min(100, Math.max(0, parseFloat(occupancyPct) || 0));

    return calculateROI({
      purchasePrice: p,
      annualRent: r,
      annualExpenses: e,
      occupancyPct: o,
    });
  }, [purchasePrice, monthlyRent, annualExpenses, occupancyPct]);

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-4">
        <h2 className="text-sm font-bold text-[#102A43]">بيانات العقار والإيجار</h2>

        <CalculatorInput
          label="سعر الشراء"
          value={purchasePrice}
          onChange={setPurchasePrice}
          suffix="ر.ع."
          min={5000}
          step={1000}
        />
        <CalculatorInput
          label="الإيجار الشهري المتوقع"
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
          hint="صيانة، رسوم خدمات، ضرائب بلدية"
        />
        <CalculatorInput
          label="معدل الإشغال"
          value={occupancyPct}
          onChange={setOccupancyPct}
          suffix="%"
          min={10}
          max={100}
          step={5}
          hint="النسبة المتوقعة للأوقات المشغولة"
        />
      </div>

      {/* Results */}
      <CalculatorSummary title="نتائج العائد على الاستثمار">
        {/* Yield badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#627D98]">تصنيف العائد الصافي:</span>
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
          <CalculatorResultCard
            label="الدخل السنوي الفعّال"
            value={formatOMR(result.effectiveAnnualRent, { arabic: true, compact: true })}
            sub={`بعد خصم ${toArabicNumerals(parseFloat(occupancyPct) || 0)}٪ إشغال`}
            accent="default"
          />
          <CalculatorResultCard
            label="الدخل الصافي السنوي"
            value={formatOMR(result.annualNetIncome, { arabic: true, compact: true })}
            sub="بعد خصم المصاريف"
            accent="default"
          />
        </div>

        <CalculatorResultCard
          label="فترة الاسترداد التقديرية"
          value={
            result.paybackYears > 0
              ? `${toArabicNumerals(result.paybackYears)} سنة`
              : "—"
          }
          sub="المدة الزمنية لاسترداد رأس المال"
          accent="default"
        />
      </CalculatorSummary>

      {/* AI insight */}
      <div>
        <h2 className="text-base font-bold text-[#102A43] mb-3">
          تحليل السوق بالذكاء الاصطناعي
        </h2>
        <MarketInsightPanel />
      </div>

      <MarketDisclaimer variant="banner" />
    </div>
  );
}
