"use client";

import { useState } from "react";
import { AIButton } from "./AIButton";
import { AILoadingState } from "./AILoadingState";
import { AIResultCard } from "./AIResultCard";
import { AIErrorState } from "./AIErrorState";
import { AIDisclaimer } from "./AIDisclaimer";
import type { ValuationResponse } from "@/lib/ai/types";
import type { AIErrorCode } from "@/lib/ai/types";

interface ValuationAssistantProps {
  propertyType: string;
  purpose: "sale" | "rent";
  price: number;
  area: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaAr: string;
  wilayatAr: string;
  marketAvgPrice?: number | null;
  pricePerSqm?: number | null;
  marketPricePerSqm?: number | null;
}

const POSITION_CONFIG = {
  below: { labelAr: "أقل من المتوسط", color: "#5B8C5A", bg: "#EDF4ED", border: "#5B8C5A/20" },
  above: { labelAr: "أعلى من المتوسط", color: "#C65D3B", bg: "#FBF0EB", border: "#C65D3B/20" },
  fair:  { labelAr: "ضمن المتوسط",    color: "#2471A3", bg: "#EAF4FB", border: "#2471A3/20" },
};

const CONFIDENCE_COLOR: Record<string, string> = {
  "منخفض": "text-[#C8860A]",
  "متوسط": "text-[#2471A3]",
  "مرتفع": "text-[#5B8C5A]",
};

export function ValuationAssistant(props: ValuationAssistantProps) {
  const [result, setResult] = useState<ValuationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<AIErrorCode | undefined>();

  async function handleAnalyze() {
    setLoading(true);
    setErrorCode(undefined);
    setResult(null);

    try {
      const res = await fetch("/api/ai/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType:      props.propertyType,
          purpose:           props.purpose,
          price:             props.price,
          area:              props.area,
          bedrooms:          props.bedrooms,
          bathrooms:         props.bathrooms,
          areaAr:            props.areaAr,
          wilayatAr:         props.wilayatAr,
          marketAvgPrice:    props.marketAvgPrice,
          pricePerSqm:       props.pricePerSqm,
          marketPricePerSqm: props.marketPricePerSqm,
        }),
      });

      const data: ValuationResponse = await res.json();

      if (data.success) {
        setResult(data);
      } else {
        setErrorCode(data.errorCode ?? "unknown");
      }
    } catch {
      setErrorCode("provider_error");
    } finally {
      setLoading(false);
    }
  }

  const posType = result?.positionType ?? "fair";
  const posCfg = POSITION_CONFIG[posType];

  return (
    <div className="space-y-3" dir="rtl">
      {/* Trigger button */}
      {!result && !loading && (
        <AIButton
          onClick={handleAnalyze}
          label="تحليل السعر بالذكاء الاصطناعي"
          loadingLabel="جاري التحليل..."
          loading={loading}
          variant="subtle"
          aria-label="تحليل سعر العقار بالذكاء الاصطناعي"
        />
      )}

      {/* Loading */}
      {loading && (
        <AILoadingState messageAr="يحلل الذكاء الاصطناعي سعر العقار مقارنةً بالسوق..." />
      )}

      {/* Error */}
      {errorCode && !loading && (
        <AIErrorState errorCode={errorCode} onRetry={handleAnalyze} />
      )}

      {/* Result */}
      {result && !loading && (
        <AIResultCard isMockFallback={result.isMockFallback} title="تحليل السعر">
          {/* Position badge */}
          {result.positionType && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold mb-3"
              style={{
                background: posCfg.bg,
                color:      posCfg.color,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                {posType === "below" ? (
                  <path d="M12 5v14M5 12l7 7 7-7" />
                ) : posType === "above" ? (
                  <path d="M12 19V5M5 12l7-7 7 7" />
                ) : (
                  <path d="M5 12h14" />
                )}
              </svg>
              {result.positionLabel ?? posCfg.labelAr}
            </div>
          )}

          {/* Summary */}
          {result.summaryAr && (
            <p className="text-sm text-[#3D3330] leading-relaxed mb-3">
              {result.summaryAr}
            </p>
          )}

          {/* Confidence */}
          {result.confidence && (
            <div className="flex items-center justify-between border-t border-[#F0EBE3] pt-3">
              <span className="text-xs text-[#7A6B5E]">مستوى الثقة</span>
              <span className={["text-xs font-bold", CONFIDENCE_COLOR[result.confidence] ?? "text-[#7A6B5E]"].join(" ")}>
                {result.confidence}
              </span>
            </div>
          )}

          {/* Reset */}
          <button
            onClick={() => { setResult(null); setErrorCode(undefined); }}
            className="mt-3 text-xs text-[#A89480] underline underline-offset-2 hover:text-[#7A6B5E]"
          >
            إعادة التحليل
          </button>
        </AIResultCard>
      )}

      {/* Disclaimer always shown when result exists */}
      {result && (
        <AIDisclaimer
          textAr={result.disclaimer ?? "هذا تقدير إرشادي وليس تقييماً رسمياً معتمداً."}
          variant="financial"
        />
      )}
    </div>
  );
}
