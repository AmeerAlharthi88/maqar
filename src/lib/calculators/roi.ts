// ── ROI calculator utility — Phase 13 ────────────────────────────────────────
// Estimates return on investment. Not investment advice.

export interface ROIInput {
  purchasePrice: number;  // OMR
  annualRent: number;     // OMR/year (expected)
  annualExpenses: number; // OMR/year (maintenance, service charges, etc.)
  occupancyPct: number;   // e.g. 90 for 90% occupancy
}

export interface ROIResult {
  effectiveAnnualRent: number;
  grossYieldPct: number;
  annualNetIncome: number;
  netYieldPct: number;
  paybackYears: number;
}

export function calculateROI(input: ROIInput): ROIResult {
  const effectiveAnnualRent = Math.round(
    input.annualRent * (input.occupancyPct / 100)
  );

  const grossYieldPct =
    input.purchasePrice > 0
      ? parseFloat(
          ((effectiveAnnualRent / input.purchasePrice) * 100).toFixed(2)
        )
      : 0;

  const annualNetIncome = Math.max(0, effectiveAnnualRent - input.annualExpenses);

  const netYieldPct =
    input.purchasePrice > 0
      ? parseFloat(((annualNetIncome / input.purchasePrice) * 100).toFixed(2))
      : 0;

  const paybackYears =
    annualNetIncome > 0
      ? parseFloat((input.purchasePrice / annualNetIncome).toFixed(1))
      : 0;

  return {
    effectiveAnnualRent,
    grossYieldPct,
    annualNetIncome,
    netYieldPct,
    paybackYears,
  };
}
