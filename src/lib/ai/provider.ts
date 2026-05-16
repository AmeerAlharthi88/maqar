// ── AI provider abstraction — Phase 12 ──────────────────────────────────────
// This module is the single entry point for all AI feature calls.
// Swapping the underlying provider (Anthropic → OpenAI/Gemini/etc.) only
// requires changing the imports in this file — UI and API routes remain unchanged.
//
// Server-side only. Never import from client components.

import {
  callAI,
  callAIStream,
  safeParseJSON,
  APIKeyMissingError,
  AIProviderError,
} from "./anthropic";

import { SYSTEM_BASE, ASSISTANT_SYSTEM, buildDescriptionPrompt, buildValuationPrompt, buildROIPrompt, buildMarketSummaryPrompt, buildDuplicateRiskPrompt, buildListingQualityPrompt, buildSmartReplyPrompt } from "./prompts";

import { logAIUsage, checkUsageLimit } from "./usage";
import { estimateTokens } from "./safety";

import type {
  AIFeature,
  AIErrorCode,
  GenerateDescriptionRequest,
  GenerateDescriptionResponse,
  ValuationRequest,
  ValuationResponse,
  AssistantRequest,
  AssistantResponse,
  ROIExplanationRequest,
  ROIExplanationResponse,
  MarketSummaryRequest,
  MarketSummaryResponse,
  DuplicateRiskRequest,
  DuplicateRiskResponse,
  ListingQualityRequest,
  ListingQualityResponse,
  SmartReplyRequest,
  SmartReplyResponse,
} from "./types";

// ── Dev mock fallbacks (clearly labeled) ──────────────────────────────────────
// Used only when ANTHROPIC_API_KEY is missing — for UI development only.
// TODO: Remove in production or gate behind NODE_ENV check.

const DEV_MOCK_DESCRIPTION: GenerateDescriptionResponse = {
  success: true, feature: "generate-description", isMockFallback: true,
  titleAr: "عقار مميز في موقع متميز",
  descriptionAr: "تجريبي — لا يوجد مفتاح API. هذا وصف مؤقت للعرض فقط. سيتم توليد وصف حقيقي بعد إضافة ANTHROPIC_API_KEY.",
};
const DEV_MOCK_VALUATION: ValuationResponse = {
  success: true, feature: "valuation", isMockFallback: true,
  summaryAr: "تجريبي — لا يوجد مفتاح API. بيانات الموقع والسعر تشير إلى موضع سوقي متوسط.",
  positionLabel: "يساوي المتوسط (تقريبي)", positionType: "fair", confidence: "منخفض",
  disclaimer: "هذا تقدير إرشادي وليس تقييماً رسمياً.",
};
const DEV_MOCK_ASSISTANT: AssistantResponse = {
  success: true, feature: "assistant", isMockFallback: true,
  replyAr: "تجريبي — لا يوجد مفتاح API. في البيئة الحقيقية، سيجيب المساعد على سؤالك بشكل مفصّل.",
  disclaimer: "ملاحظة: هذه معلومات إرشادية وليست نصيحة مالية أو قانونية.",
};
const DEV_MOCK_ROI: ROIExplanationResponse = {
  success: true, feature: "roi-explanation", isMockFallback: true,
  explanationAr: "تجريبي — لا يوجد مفتاح API. العائد التقديري يعتمد على الإيجار المتوقع ومصاريف الصيانة.",
  bestCaseNote: "في أفضل الأحوال: عائد مستقر مع معدل إشغال مرتفع.",
  worstCaseNote: "في أسوأ الأحوال: فترة شغور تؤثر على العائد الفعلي.",
  mainRisksAr: "تقلبات السوق وتكاليف الصيانة غير المتوقعة.",
  disclaimer: "هذا تقدير إرشادي — استشر متخصصاً قبل أي قرار استثماري.",
};
const DEV_MOCK_MARKET: MarketSummaryResponse = {
  success: true, feature: "market-summary", isMockFallback: true,
  summaryAr: "تجريبي — لا يوجد مفتاح API. يُظهر السوق طلباً معتدلاً في هذه المنطقة.",
  demandTrendAr: "الطلب مستقر مع ميل للارتفاع.",
  priceTrendAr: "الأسعار ثابتة نسبياً خلال الفترة الأخيرة.",
  disclaimer: "هذه بيانات تقديرية وليست بيانات سوق رسمية.",
};
const DEV_MOCK_DUPLICATE: DuplicateRiskResponse = {
  success: true, feature: "duplicate-risk", isMockFallback: true,
  summaryAr: "تجريبي — الإعلان يشترك في بعض الخصائص مع إعلانات أخرى في نفس المنطقة.",
  riskLevel: "متوسط", similarFieldsAr: ["الموقع", "المساحة"],
  recommendedActionAr: "مراجعة يدوية مقترحة.",
};
const DEV_MOCK_QUALITY: ListingQualityResponse = {
  success: true, feature: "listing-quality", isMockFallback: true,
  overallFeedbackAr: "تجريبي — الإعلان يحتاج إلى تحسينات في الوصف والصور.",
  suggestions: [
    { categoryAr: "الوصف", suggestionAr: "أضف تفاصيل أكثر عن مميزات العقار.", priority: "high" },
    { categoryAr: "الصور", suggestionAr: "أضف صوراً للمطبخ والحمامات.", priority: "medium" },
  ],
};
const DEV_MOCK_SMART_REPLY: SmartReplyResponse = {
  success: true, feature: "smart-reply", isMockFallback: true,
  replies: [
    "السلام عليكم، نعم العقار متاح. متى يناسبكم الزيارة؟",
    "أهلاً، العقار لا يزال متاحاً. يسعدني تقديم المزيد من التفاصيل.",
    "مساء الخير، يمكنني ترتيب جولة مشاهدة في أي وقت يناسبكم.",
  ],
};

// ── Error response builder ────────────────────────────────────────────────────
// Uses unknown cast because each response type narrows `feature` to a specific
// literal, but we build it generically. The contract is correct at runtime.
function errorResponse<T extends { success: boolean; feature: AIFeature; errorCode?: AIErrorCode; errorMessage?: string }>(
  feature: AIFeature,
  code: AIErrorCode,
  message: string
): T {
  return { success: false, feature, errorCode: code, errorMessage: message } as unknown as T;
}

// ── isKeyMissing ───────────────────────────────────────────────────────────────
function isKeyMissing(err: unknown): boolean {
  return err instanceof APIKeyMissingError ||
    (err instanceof Error && err.message.includes("ANTHROPIC_API_KEY"));
}

// ── generateDescription ────────────────────────────────────────────────────────
export async function generateDescription(
  req: GenerateDescriptionRequest,
  userId?: string
): Promise<GenerateDescriptionResponse> {
  const { allowed } = await checkUsageLimit("generate-description", userId);
  if (!allowed) return errorResponse("generate-description", "usage_limit_reached", "تم الوصول إلى الحد اليومي.");

  const prompt = buildDescriptionPrompt(req);
  const inputEst = estimateTokens(prompt);

  try {
    const raw = await callAI({ systemPrompt: SYSTEM_BASE, userPrompt: prompt });
    const parsed = safeParseJSON<{ titleAr?: string; descriptionAr?: string }>(raw);

    const result: GenerateDescriptionResponse = {
      success: true, feature: "generate-description",
      titleAr: parsed?.titleAr,
      descriptionAr: parsed?.descriptionAr,
    };
    await logAIUsage({ userId, feature: "generate-description", inputTokenEstimate: inputEst, outputTokenEstimate: estimateTokens(raw), timestamp: new Date().toISOString(), success: true, isMockFallback: false });
    return result;
  } catch (err) {
    if (isKeyMissing(err)) {
      await logAIUsage({ userId, feature: "generate-description", inputTokenEstimate: 0, outputTokenEstimate: 0, timestamp: new Date().toISOString(), success: false, isMockFallback: true });
      return DEV_MOCK_DESCRIPTION;
    }
    const code = err instanceof AIProviderError ? err.code : "unknown" as AIErrorCode;
    return errorResponse("generate-description", code, "تعذّر توليد الوصف.");
  }
}

// ── valuation ─────────────────────────────────────────────────────────────────
export async function valuation(
  req: ValuationRequest,
  userId?: string
): Promise<ValuationResponse> {
  const { allowed } = await checkUsageLimit("valuation", userId);
  if (!allowed) return errorResponse("valuation", "usage_limit_reached", "تم الوصول إلى الحد اليومي.");

  const prompt = buildValuationPrompt(req);
  const inputEst = estimateTokens(prompt);

  try {
    const raw = await callAI({ systemPrompt: SYSTEM_BASE, userPrompt: prompt });
    const parsed = safeParseJSON<{ summaryAr?: string; positionLabel?: string; positionType?: "fair" | "above" | "below"; confidence?: string }>(raw);

    const result: ValuationResponse = {
      success: true, feature: "valuation",
      summaryAr: parsed?.summaryAr,
      positionLabel: parsed?.positionLabel,
      positionType: parsed?.positionType ?? "fair",
      confidence: (parsed?.confidence as ValuationResponse["confidence"]) ?? "متوسط",
      disclaimer: "هذا تقدير إرشادي وليس تقييماً رسمياً معتمداً.",
    };
    await logAIUsage({ userId, feature: "valuation", inputTokenEstimate: inputEst, outputTokenEstimate: estimateTokens(raw), timestamp: new Date().toISOString(), success: true, isMockFallback: false });
    return result;
  } catch (err) {
    if (isKeyMissing(err)) return DEV_MOCK_VALUATION;
    const code = err instanceof AIProviderError ? err.code : "unknown" as AIErrorCode;
    return errorResponse("valuation", code, "تعذّر تحليل السعر.");
  }
}

// ── assistant ──────────────────────────────────────────────────────────────────
export async function assistant(
  req: AssistantRequest,
  userId?: string
): Promise<AssistantResponse> {
  const { allowed } = await checkUsageLimit("assistant", userId);
  if (!allowed) return errorResponse("assistant", "usage_limit_reached", "تم الوصول إلى الحد اليومي للمساعد.");

  const inputEst = req.messages.reduce((acc, m) => acc + estimateTokens(m.content), 0);

  try {
    const raw = await callAI({
      systemPrompt: ASSISTANT_SYSTEM,
      userPrompt: req.messages[req.messages.length - 1]?.content ?? "",
      maxTokens: 600,
    });

    const result: AssistantResponse = {
      success: true, feature: "assistant",
      replyAr: raw.trim(),
      disclaimer: "ملاحظة: هذه معلومات إرشادية وليست نصيحة مالية أو قانونية.",
    };
    await logAIUsage({ userId, feature: "assistant", inputTokenEstimate: inputEst, outputTokenEstimate: estimateTokens(raw), timestamp: new Date().toISOString(), success: true, isMockFallback: false });
    return result;
  } catch (err) {
    if (isKeyMissing(err)) return DEV_MOCK_ASSISTANT;
    const code = err instanceof AIProviderError ? err.code : "unknown" as AIErrorCode;
    return errorResponse("assistant", code, "تعذّر الرد.");
  }
}

// ── roiExplanation ─────────────────────────────────────────────────────────────
export async function roiExplanation(
  req: ROIExplanationRequest,
  userId?: string
): Promise<ROIExplanationResponse> {
  const prompt = buildROIPrompt(req);
  try {
    const raw = await callAI({ systemPrompt: SYSTEM_BASE, userPrompt: prompt });
    const parsed = safeParseJSON<{ explanationAr?: string; bestCaseNote?: string; worstCaseNote?: string; mainRisksAr?: string }>(raw);
    const result: ROIExplanationResponse = {
      success: true, feature: "roi-explanation",
      explanationAr: parsed?.explanationAr,
      bestCaseNote: parsed?.bestCaseNote,
      worstCaseNote: parsed?.worstCaseNote,
      mainRisksAr: parsed?.mainRisksAr,
      disclaimer: "هذا تقدير إرشادي — استشر متخصصاً مالياً قبل أي قرار استثماري.",
    };
    await logAIUsage({ userId, feature: "roi-explanation", inputTokenEstimate: estimateTokens(prompt), outputTokenEstimate: estimateTokens(raw), timestamp: new Date().toISOString(), success: true, isMockFallback: false });
    return result;
  } catch (err) {
    if (isKeyMissing(err)) return DEV_MOCK_ROI;
    const code = err instanceof AIProviderError ? err.code : "unknown" as AIErrorCode;
    return errorResponse("roi-explanation", code, "تعذّر تحليل العائد.");
  }
}

// ── marketSummary ──────────────────────────────────────────────────────────────
export async function marketSummary(
  req: MarketSummaryRequest,
  userId?: string
): Promise<MarketSummaryResponse> {
  const prompt = buildMarketSummaryPrompt(req);
  try {
    const raw = await callAI({ systemPrompt: SYSTEM_BASE, userPrompt: prompt });
    const parsed = safeParseJSON<{ summaryAr?: string; demandTrendAr?: string; priceTrendAr?: string; popularAreasAr?: string[] }>(raw);
    const result: MarketSummaryResponse = {
      success: true, feature: "market-summary",
      summaryAr: parsed?.summaryAr,
      demandTrendAr: parsed?.demandTrendAr,
      priceTrendAr: parsed?.priceTrendAr,
      popularAreasAr: parsed?.popularAreasAr,
      disclaimer: "هذا ملخص تقديري يعتمد على بيانات تقريبية وليس تقريراً سوقياً رسمياً.",
    };
    await logAIUsage({ userId, feature: "market-summary", inputTokenEstimate: estimateTokens(prompt), outputTokenEstimate: estimateTokens(raw), timestamp: new Date().toISOString(), success: true, isMockFallback: false });
    return result;
  } catch (err) {
    if (isKeyMissing(err)) return DEV_MOCK_MARKET;
    const code = err instanceof AIProviderError ? err.code : "unknown" as AIErrorCode;
    return errorResponse("market-summary", code, "تعذّر توليد ملخص السوق.");
  }
}

// ── duplicateRisk ──────────────────────────────────────────────────────────────
export async function duplicateRisk(
  req: DuplicateRiskRequest,
  userId?: string
): Promise<DuplicateRiskResponse> {
  const prompt = buildDuplicateRiskPrompt(req);
  try {
    const raw = await callAI({ systemPrompt: SYSTEM_BASE, userPrompt: prompt });
    const parsed = safeParseJSON<{ summaryAr?: string; riskLevel?: string; similarFieldsAr?: string[]; recommendedActionAr?: string }>(raw);
    const result: DuplicateRiskResponse = {
      success: true, feature: "duplicate-risk",
      summaryAr: parsed?.summaryAr,
      riskLevel: (parsed?.riskLevel as DuplicateRiskResponse["riskLevel"]) ?? "متوسط",
      similarFieldsAr: parsed?.similarFieldsAr ?? [],
      recommendedActionAr: parsed?.recommendedActionAr,
    };
    await logAIUsage({ userId, feature: "duplicate-risk", inputTokenEstimate: estimateTokens(prompt), outputTokenEstimate: estimateTokens(raw), timestamp: new Date().toISOString(), success: true, isMockFallback: false });
    return result;
  } catch (err) {
    if (isKeyMissing(err)) return DEV_MOCK_DUPLICATE;
    const code = err instanceof AIProviderError ? err.code : "unknown" as AIErrorCode;
    return errorResponse("duplicate-risk", code, "تعذّر تحليل التكرار.");
  }
}

// ── listingQuality ─────────────────────────────────────────────────────────────
export async function listingQuality(
  req: ListingQualityRequest,
  userId?: string
): Promise<ListingQualityResponse> {
  const prompt = buildListingQualityPrompt(req);
  try {
    const raw = await callAI({ systemPrompt: SYSTEM_BASE, userPrompt: prompt });
    const parsed = safeParseJSON<{ overallFeedbackAr?: string; suggestions?: ListingQualityResponse["suggestions"] }>(raw);
    const result: ListingQualityResponse = {
      success: true, feature: "listing-quality",
      overallFeedbackAr: parsed?.overallFeedbackAr,
      suggestions: parsed?.suggestions ?? [],
    };
    await logAIUsage({ userId, feature: "listing-quality", inputTokenEstimate: estimateTokens(prompt), outputTokenEstimate: estimateTokens(raw), timestamp: new Date().toISOString(), success: true, isMockFallback: false });
    return result;
  } catch (err) {
    if (isKeyMissing(err)) return DEV_MOCK_QUALITY;
    const code = err instanceof AIProviderError ? err.code : "unknown" as AIErrorCode;
    return errorResponse("listing-quality", code, "تعذّر تحليل الجودة.");
  }
}

// ── smartReply ─────────────────────────────────────────────────────────────────
export async function smartReply(
  req: SmartReplyRequest,
  userId?: string
): Promise<SmartReplyResponse> {
  const prompt = buildSmartReplyPrompt(req);
  try {
    const raw = await callAI({ systemPrompt: SYSTEM_BASE, userPrompt: prompt });
    const parsed = safeParseJSON<{ replies?: string[] }>(raw);
    const result: SmartReplyResponse = {
      success: true, feature: "smart-reply",
      replies: parsed?.replies ?? [],
    };
    await logAIUsage({ userId, feature: "smart-reply", inputTokenEstimate: estimateTokens(prompt), outputTokenEstimate: estimateTokens(raw), timestamp: new Date().toISOString(), success: true, isMockFallback: false });
    return result;
  } catch (err) {
    if (isKeyMissing(err)) return DEV_MOCK_SMART_REPLY;
    const code = err instanceof AIProviderError ? err.code : "unknown" as AIErrorCode;
    return errorResponse("smart-reply", code, "تعذّر إنشاء الردود.");
  }
}

// Re-export streaming for assistant route
export { callAIStream, ASSISTANT_SYSTEM };
