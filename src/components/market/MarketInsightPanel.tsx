"use client";

// ── MarketInsightPanel — AI market summary for a specific area/wilayat ────────

import { useState } from "react";
import { AIButton } from "@/components/ai/AIButton";
import { AIErrorState } from "@/components/ai/AIErrorState";
import { AIResultCard } from "@/components/ai/AIResultCard";
import { MarketDisclaimer } from "@/components/market/MarketDisclaimer";
import type { MarketSummaryResponse } from "@/lib/ai/types";
import type { AIErrorCode } from "@/lib/ai/types";

interface MarketInsightPanelProps {
  areaAr?: string;
  wilayatAr?: string;
  governorateAr?: string;
  avgSalePrice?: number;
  avgRentPrice?: number;
  rentalYield?: number;
  demandScore?: number;
  priceChangePct?: number;
}

export function MarketInsightPanel({
  areaAr,
  wilayatAr,
  governorateAr,
  avgSalePrice,
  avgRentPrice,
  rentalYield,
  demandScore,
  priceChangePct,
}: MarketInsightPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketSummaryResponse | null>(null);
  const [errorCode, setErrorCode] = useState<AIErrorCode | undefined>();
  const [fetched, setFetched] = useState(false);

  async function fetchInsight() {
    setLoading(true);
    setErrorCode(undefined);
    setResult(null);

    try {
      const res = await fetch("/api/ai/market-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaAr,
          wilayatAr,
          governorateAr,
          marketData: {
            avgSalePrice,
            avgRentPrice,
            rentalYield,
            demandScore,
            priceChangePct,
          },
        }),
      });

      const data: MarketSummaryResponse = await res.json();

      if (data.success && data.summaryAr) {
        setResult(data);
      } else {
        setErrorCode(data.errorCode ?? "unknown");
      }
    } catch {
      setErrorCode("provider_error");
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }

  return (
    <div className="space-y-2">
      <AIButton
        onClick={() => void fetchInsight()}
        loading={loading}
        label="تحليل ذكي للسوق"
        loadingLabel="جاري التحليل..."
        variant="subtle"
        aria-label="توليد تحليل ذكاء اصطناعي لسوق العقارات في هذه المنطقة"
      />

      {errorCode && !loading && (
        <AIErrorState
          errorCode={errorCode}
          compact
          onRetry={() => void fetchInsight()}
        />
      )}

      {result && !loading && (
        <AIResultCard
          isMockFallback={result.isMockFallback}
          title="تحليل السوق بالذكاء الاصطناعي"
        >
          {result.summaryAr && (
            <p className="text-sm text-[#102A43] leading-relaxed mb-2">
              {result.summaryAr}
            </p>
          )}
          {result.demandTrendAr && (
            <p className="text-xs text-[#627D98] mb-1">
              <span className="font-semibold">الطلب: </span>
              {result.demandTrendAr}
            </p>
          )}
          {result.priceTrendAr && (
            <p className="text-xs text-[#627D98]">
              <span className="font-semibold">الأسعار: </span>
              {result.priceTrendAr}
            </p>
          )}
          {result.disclaimer && (
            <p className="text-[10px] text-[#627D98] mt-2 border-t border-[#E2E8F0] pt-2">
              {result.disclaimer}
            </p>
          )}
        </AIResultCard>
      )}

      {fetched && !loading && (
        <MarketDisclaimer variant="inline" className="mt-1" />
      )}
    </div>
  );
}
