// ── Price per sqm calculator utility — Phase 13 ──────────────────────────────
// Compare property price per m² against area averages.

export type PricePosition = "above" | "below" | "fair";

export interface PricePerSqmInput {
  price: number;          // OMR
  areaSqm: number;        // m²
  areaAvgPricePerSqm?: number; // from market data (optional)
}

export interface PricePerSqmResult {
  pricePerSqm: number;
  comparisonPct?: number;     // + above / - below area average
  position?: PricePosition;
  positionLabel?: string;
}

export function calculatePricePerSqm(input: PricePerSqmInput): PricePerSqmResult {
  const pricePerSqm = input.areaSqm > 0
    ? Math.round(input.price / input.areaSqm)
    : 0;

  if (!input.areaAvgPricePerSqm || input.areaAvgPricePerSqm <= 0) {
    return { pricePerSqm };
  }

  const comparisonPct = parseFloat(
    (((pricePerSqm - input.areaAvgPricePerSqm) / input.areaAvgPricePerSqm) * 100).toFixed(1)
  );

  let position: PricePosition;
  let positionLabel: string;

  if (comparisonPct > 5) {
    position = "above";
    positionLabel = `أعلى من متوسط المنطقة بـ ${comparisonPct.toFixed(1)}%`;
  } else if (comparisonPct < -5) {
    position = "below";
    positionLabel = `أقل من متوسط المنطقة بـ ${Math.abs(comparisonPct).toFixed(1)}%`;
  } else {
    position = "fair";
    positionLabel = "مطابق لمتوسط المنطقة";
  }

  return { pricePerSqm, comparisonPct, position, positionLabel };
}
