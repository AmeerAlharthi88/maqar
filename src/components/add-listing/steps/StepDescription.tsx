"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
  MIN_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_HIGHLIGHTS,
} from "@/lib/constants/add-listing";
import { getSuggestedTitles, sanitizeArabicText } from "@/lib/helpers/add-listing";
import { toArabicNumerals } from "@/lib/formatters";
import type { ListingDraft } from "@/types/listing-draft";
import { AIButton } from "@/components/ai/AIButton";
import { AIErrorState } from "@/components/ai/AIErrorState";
import { AIResultCard } from "@/components/ai/AIResultCard";
import type { GenerateDescriptionResponse } from "@/lib/ai/types";
import type { AIErrorCode } from "@/lib/ai/types";

interface StepDescriptionProps {
  draft: ListingDraft;
  onChange: (patch: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
}

function CharCounter({ current, max, min }: { current: number; max: number; min: number }) {
  const isUnder = current < min;
  const isOver = current > max;
  return (
    <span className={cn("text-xs", isOver ? "text-[#C0392B]" : isUnder ? "text-[#A89480]" : "text-[#7A6B5E]")}>
      {toArabicNumerals(current)} / {toArabicNumerals(max)}
    </span>
  );
}

export function StepDescription({ draft, onChange, errors }: StepDescriptionProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightInput, setHighlightInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<GenerateDescriptionResponse | null>(null);
  const [aiErrorCode, setAiErrorCode] = useState<AIErrorCode | undefined>();

  const locationAr = [draft.areaAr, draft.wilayatAr].filter(Boolean).join("، ");
  const suggestions = getSuggestedTitles(draft.propertyType, locationAr);

  const titleLen = sanitizeArabicText(draft.titleAr).length;
  const descLen = sanitizeArabicText(draft.descriptionAr).length;

  function addHighlight() {
    const trimmed = highlightInput.trim();
    if (!trimmed || draft.highlights.length >= MAX_HIGHLIGHTS) return;
    if (draft.highlights.includes(trimmed)) return;
    onChange({ highlights: [...draft.highlights, trimmed] });
    setHighlightInput("");
  }

  function removeHighlight(idx: number) {
    onChange({ highlights: draft.highlights.filter((_, i) => i !== idx) });
  }

  // AI description generator — calls /api/ai/generate-description
  async function handleAiGenerate() {
    setAiLoading(true);
    setAiErrorCode(undefined);
    setAiResult(null);

    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType:  draft.propertyType ?? "عقار",
          purpose:       draft.purpose ?? "sale",
          titleAr:       draft.titleAr,
          areaAr:        draft.areaAr ?? "",
          wilayatAr:     draft.wilayatAr ?? "",
          governorateAr: draft.governorateAr ?? "",
          price:         draft.price ?? undefined,
          area:          draft.area ?? undefined,
          bedrooms:      draft.bedrooms,
          bathrooms:     draft.bathrooms,
          floors:        draft.floors,
          furnishing:    draft.furnishing,
          highlights:    draft.highlights,
          propertyAge:   draft.propertyAge,
          hasMaidsRoom:  draft.hasMaidRoom,   // draft uses hasMaidRoom
          hasDriverRoom: draft.hasDriverRoom,
          isFreehold:    draft.isFreehold,
        }),
      });

      const data: GenerateDescriptionResponse = await res.json();

      if (data.success && (data.titleAr || data.descriptionAr)) {
        setAiResult(data);
      } else {
        setAiErrorCode(data.errorCode ?? "unknown");
      }
    } catch {
      setAiErrorCode("provider_error");
    } finally {
      setAiLoading(false);
    }
  }

  function applyAiResult() {
    if (!aiResult) return;
    if (aiResult.titleAr)       onChange({ titleAr: aiResult.titleAr });
    if (aiResult.descriptionAr) onChange({ descriptionAr: aiResult.descriptionAr });
    setAiResult(null);
  }

  return (
    <div className="px-4 py-6 space-y-6" dir="rtl">

      {/* Title */}
      <section>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-bold text-[#1E1E1E]">
            عنوان الإعلان <span className="text-[#C0392B]">*</span>
          </label>
          <CharCounter current={titleLen} max={MAX_TITLE_LENGTH} min={MIN_TITLE_LENGTH} />
        </div>
        <input
          type="text"
          value={draft.titleAr}
          placeholder="مثال: فيلا فاخرة بإطلالة بحرية في القرم"
          onChange={(e) => onChange({ titleAr: e.target.value })}
          maxLength={MAX_TITLE_LENGTH}
          className={cn(
            "w-full h-11 bg-white border rounded-xl px-3.5 text-sm text-[#1E1E1E] placeholder:text-[#A89480] outline-none",
            "focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15",
            errors.titleAr ? "border-[#C0392B]" : "border-[#E8DDD0]"
          )}
          dir="rtl"
          aria-label="عنوان الإعلان"
        />
        {errors.titleAr && <p className="mt-1 text-xs text-[#C0392B]">{errors.titleAr}</p>}

        {/* Suggested titles */}
        {suggestions.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs text-[#C65D3B] font-semibold underline underline-offset-2"
            >
              {showSuggestions ? "إخفاء الاقتراحات" : "عرض عناوين مقترحة"}
            </button>
            {showSuggestions && (
              <div className="mt-2 space-y-1.5">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { onChange({ titleAr: s }); setShowSuggestions(false); }}
                    className="w-full text-right px-3 py-2 bg-[#F5F0EA] rounded-xl text-xs text-[#3D3330] border border-[#E8DDD0] active:bg-[#EDE8E0]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Description */}
      <section>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-bold text-[#1E1E1E]">
            وصف العقار <span className="text-[#C0392B]">*</span>
          </label>
          <CharCounter current={descLen} max={MAX_DESCRIPTION_LENGTH} min={MIN_DESCRIPTION_LENGTH} />
        </div>
        <textarea
          value={draft.descriptionAr}
          placeholder="اكتب وصفاً تفصيلياً لعقارك يبرز مميزاته وموقعه ومستوى تشطيباته..."
          onChange={(e) => onChange({ descriptionAr: e.target.value })}
          maxLength={MAX_DESCRIPTION_LENGTH}
          rows={6}
          className={cn(
            "w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-[#1E1E1E] placeholder:text-[#A89480] outline-none resize-none leading-relaxed",
            "focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15",
            errors.descriptionAr ? "border-[#C0392B]" : "border-[#E8DDD0]"
          )}
          dir="rtl"
          aria-label="وصف العقار"
        />
        {errors.descriptionAr && <p className="mt-1 text-xs text-[#C0392B]">{errors.descriptionAr}</p>}

        {/* AI description generator */}
        <div className="mt-2 space-y-2">
          <AIButton
            onClick={() => void handleAiGenerate()}
            loading={aiLoading}
            label="توليد وصف بالذكاء الاصطناعي"
            loadingLabel="جاري التوليد..."
            variant="subtle"
            aria-label="توليد عنوان ووصف العقار بالذكاء الاصطناعي"
          />

          {aiErrorCode && !aiLoading && (
            <AIErrorState errorCode={aiErrorCode} compact onRetry={() => void handleAiGenerate()} />
          )}

          {aiResult && !aiLoading && (
            <AIResultCard isMockFallback={aiResult.isMockFallback} title="اقتراح الذكاء الاصطناعي">
              {aiResult.titleAr && (
                <div className="mb-2">
                  <p className="text-[10px] font-bold text-[#A89480] mb-1">العنوان المقترح</p>
                  <p className="text-sm font-semibold text-[#1E1E1E]">{aiResult.titleAr}</p>
                </div>
              )}
              {aiResult.descriptionAr && (
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-[#A89480] mb-1">الوصف المقترح</p>
                  <p className="text-xs text-[#3D3330] leading-relaxed line-clamp-4">{aiResult.descriptionAr}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={applyAiResult}
                  className="flex-1 py-2 rounded-xl bg-[#C65D3B] text-white text-xs font-bold"
                >
                  تطبيق الاقتراح
                </button>
                <button
                  onClick={() => setAiResult(null)}
                  className="px-4 py-2 rounded-xl bg-[#F5F0EA] text-[#7A6B5E] text-xs font-semibold"
                >
                  تجاهل
                </button>
              </div>
            </AIResultCard>
          )}
        </div>
      </section>

      {/* Key highlights */}
      <section>
        <label className="text-sm font-bold text-[#1E1E1E] mb-2 block">
          أبرز المميزات (اختياري — حتى {toArabicNumerals(MAX_HIGHLIGHTS)})
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={highlightInput}
            placeholder="مثال: مسبح خاص"
            onChange={(e) => setHighlightInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
            maxLength={60}
            disabled={draft.highlights.length >= MAX_HIGHLIGHTS}
            className="flex-1 h-10 bg-white border border-[#E8DDD0] rounded-xl px-3 text-sm text-[#1E1E1E] placeholder:text-[#A89480] outline-none focus:border-[#C65D3B] disabled:opacity-50"
            dir="rtl"
          />
          <button
            onClick={addHighlight}
            disabled={!highlightInput.trim() || draft.highlights.length >= MAX_HIGHLIGHTS}
            className="px-4 py-2 bg-[#C65D3B] text-white text-sm font-semibold rounded-xl disabled:opacity-40"
          >
            إضافة
          </button>
        </div>
        {draft.highlights.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {draft.highlights.map((h, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-[#FBF0EB] border border-[#C65D3B]/30 text-[#C65D3B] text-xs font-medium px-3 py-1.5 rounded-full"
              >
                {h}
                <button
                  onClick={() => removeHighlight(i)}
                  className="text-[#C65D3B]/70 hover:text-[#C65D3B]"
                  aria-label={`حذف ${h}`}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
