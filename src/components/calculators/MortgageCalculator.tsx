"use client";

// ── MortgageCalculator — interactive mortgage estimation component ─────────────

import { useState, useMemo } from "react";
import { CalculatorInput } from "@/components/calculators/CalculatorInput";
import { CalculatorResultCard } from "@/components/calculators/CalculatorResultCard";
import { CalculatorSummary } from "@/components/calculators/CalculatorSummary";
import { MarketDisclaimer } from "@/components/market/MarketDisclaimer";
import { calculateMortgage } from "@/lib/calculators/mortgage";
import { formatOMR, toArabicNumerals } from "@/lib/formatters";

export function MortgageCalculator() {
  const [price, setPrice] = useState("80000");
  const [downPaymentPct, setDownPaymentPct] = useState("20");
  const [interestRate, setInterestRate] = useState("4.5");
  const [periodYears, setPeriodYears] = useState("25");

  const result = useMemo(() => {
    const p = parseFloat(price) || 0;
    const dp = parseFloat(downPaymentPct) || 0;
    const r = parseFloat(interestRate) || 0;
    const y = parseFloat(periodYears) || 1;

    return calculateMortgage({
      price: p,
      downPaymentPct: Math.min(100, Math.max(0, dp)),
      interestRatePct: Math.min(20, Math.max(0, r)),
      periodYears: Math.min(30, Math.max(1, y)),
    });
  }, [price, downPaymentPct, interestRate, periodYears]);

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 space-y-4">
        <h2 className="text-sm font-bold text-[#102A43]">بيانات العقار والتمويل</h2>

        <CalculatorInput
          label="سعر العقار"
          value={price}
          onChange={setPrice}
          suffix="ر.ع."
          min={1000}
          step={1000}
          hint="أدخل سعر الشراء بالريال العُماني"
        />
        <CalculatorInput
          label="نسبة الدفعة الأولى"
          value={downPaymentPct}
          onChange={setDownPaymentPct}
          suffix="%"
          min={5}
          max={90}
          step={5}
          hint="الحد الأدنى المعتاد في السلطنة ٢٠٪"
        />
        <CalculatorInput
          label="معدل الفائدة السنوي"
          value={interestRate}
          onChange={setInterestRate}
          suffix="%"
          min={1}
          max={15}
          step={0.25}
          hint="أدخل المعدل المقدَّم من البنك"
        />
        <CalculatorInput
          label="مدة القرض"
          value={periodYears}
          onChange={setPeriodYears}
          suffix="سنة"
          min={1}
          max={30}
          step={1}
          hint="الحد الأقصى الشائع ٢٥ سنة"
        />
      </div>

      {/* Results */}
      <CalculatorSummary title="نتائج التمويل التقديرية">
        <CalculatorResultCard
          label="القسط الشهري التقديري"
          value={formatOMR(result.monthlyPayment, { arabic: true })}
          accent="blue"
          large
        />
        <div className="grid grid-cols-2 gap-3">
          <CalculatorResultCard
            label="الدفعة الأولى"
            value={formatOMR(result.downPayment, { arabic: true, compact: true })}
            sub={`${toArabicNumerals(parseFloat(downPaymentPct) || 0)}٪ من السعر`}
            accent="default"
          />
          <CalculatorResultCard
            label="مبلغ القرض"
            value={formatOMR(result.loanAmount, { arabic: true, compact: true })}
            accent="default"
          />
          <CalculatorResultCard
            label="إجمالي السداد"
            value={formatOMR(result.totalRepayment, { arabic: true, compact: true })}
            accent="default"
          />
          <CalculatorResultCard
            label="إجمالي الفائدة"
            value={formatOMR(result.totalInterest, { arabic: true, compact: true })}
            accent="orange"
          />
        </div>
      </CalculatorSummary>

      <MarketDisclaimer variant="banner" />
    </div>
  );
}
