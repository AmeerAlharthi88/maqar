// ── Rental yield calculator utility — Phase 13 ───────────────────────────────
// Gross and net yield calculation. Not investment advice.

export type YieldLabel = "منخفض" | "متوسط" | "جيد" | "ممتاز";

export interface RentalYieldInput {
  purchasePrice: number;  // OMR
  monthlyRent: number;    // OMR/month
  annualExpenses: number; // OMR/year (service charges, maintenance, etc.)
}

export interface RentalYieldResult {
  annualRent: number;
  annualNetIncome: number;
  grossYieldPct: number;
  netYieldPct: number;
  yieldLabel: YieldLabel;
  areaComparisonPct?: number;  // difference vs area average yield
}

export function getYieldLabel(pct: number): YieldLabel {
  if (pct < 4) return "منخفض";
  if (pct < 6) return "متوسط";
  if (pct < 8) return "جيد";
  return "ممتاز";
}

export function getYieldColor(label: YieldLabel): string {
  switch (label) {
    case "ممتاز":  return "#0A3C36";
    case "جيد":   return "#0A3C36";
    case "متوسط": return "#C8860A";
    case "منخفض": return "#C0392B";
  }
}

export function calculateRentalYield(
  input: RentalYieldInput,
  areaAvgYield?: number
): RentalYieldResult {
  const annualRent = input.monthlyRent * 12;
  const annualNetIncome = Math.max(0, annualRent - input.annualExpenses);

  const grossYieldPct =
    input.purchasePrice > 0
      ? parseFloat(((annualRent / input.purchasePrice) * 100).toFixed(2))
      : 0;

  const netYieldPct =
    input.purchasePrice > 0
      ? parseFloat(((annualNetIncome / input.purchasePrice) * 100).toFixed(2))
      : 0;

  const areaComparisonPct =
    areaAvgYield !== undefined && areaAvgYield > 0
      ? parseFloat((netYieldPct - areaAvgYield).toFixed(2))
      : undefined;

  return {
    annualRent,
    annualNetIncome,
    grossYieldPct,
    netYieldPct,
    yieldLabel: getYieldLabel(netYieldPct),
    areaComparisonPct,
  };
}
