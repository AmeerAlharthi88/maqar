// ── AI types — Phase 12 ─────────────────────────────────────────────────────
// All AI feature types are defined here. Provider-agnostic.

// ── Feature identifiers ────────────────────────────────────────────────────────
export type AIFeature =
  | "generate-description"
  | "valuation"
  | "assistant"
  | "roi-explanation"
  | "market-summary"
  | "duplicate-risk"
  | "listing-quality"
  | "smart-reply";

// ── Confidence levels ──────────────────────────────────────────────────────────
export type AIConfidence = "منخفض" | "متوسط" | "مرتفع";

// ── Risk levels ────────────────────────────────────────────────────────────────
export type AIRiskLevel = "منخفض" | "متوسط" | "مرتفع";

// ── Base response ──────────────────────────────────────────────────────────────
export interface AIBaseResponse {
  success: boolean;
  feature: AIFeature;
  isMockFallback?: boolean;  // true if real API was unavailable and a dev fallback was used
  errorCode?: AIErrorCode;
  errorMessage?: string;
}

// ── Error codes ────────────────────────────────────────────────────────────────
export type AIErrorCode =
  | "missing_api_key"
  | "provider_error"
  | "rate_limit"
  | "usage_limit_reached"
  | "invalid_input"
  | "timeout"
  | "auth_required"
  | "unknown";

// ── Generate description ───────────────────────────────────────────────────────
export interface GenerateDescriptionRequest {
  propertyType: string;
  purpose: "sale" | "rent" | "investment";
  titleAr: string;
  areaAr: string;
  wilayatAr: string;
  governorateAr?: string;
  price?: number;
  area?: number;            // sqm
  bedrooms?: number | null;
  bathrooms?: number | null;
  floors?: number | null;
  furnishing?: string | null;
  highlights?: string[];
  amenities?: string[];
  propertyAge?: string | null;
  hasPool?: boolean;
  hasMaidsRoom?: boolean;
  hasDriverRoom?: boolean;
  hasCourtyard?: boolean;
  isFreehold?: boolean;
  hasRooftop?: boolean;
}

export interface GenerateDescriptionResponse extends AIBaseResponse {
  titleAr?: string;
  descriptionAr?: string;
}

// ── Valuation ──────────────────────────────────────────────────────────────────
export interface ValuationRequest {
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

export interface ValuationResponse extends AIBaseResponse {
  summaryAr?: string;         // 2-3 sentence valuation explanation
  positionLabel?: string;     // e.g. "أقل من المتوسط بـ ١٥٪"
  positionType?: "below" | "above" | "fair";
  confidence?: AIConfidence;
  disclaimer?: string;
}

// ── Assistant ──────────────────────────────────────────────────────────────────
export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantRequest {
  messages: AssistantMessage[];
  sessionId?: string;         // placeholder — not persisted in Phase 12
}

export interface AssistantResponse extends AIBaseResponse {
  replyAr?: string;
  disclaimer?: string;
}

// ── ROI explanation ────────────────────────────────────────────────────────────
export interface ROIExplanationRequest {
  price: number;
  estimatedRent?: number;
  roiEstimate?: number;
  areaAr: string;
  wilayatAr: string;
  propertyType: string;
}

export interface ROIExplanationResponse extends AIBaseResponse {
  explanationAr?: string;
  bestCaseNote?: string;
  worstCaseNote?: string;
  mainRisksAr?: string;
  disclaimer?: string;
}

// ── Market summary ─────────────────────────────────────────────────────────────
export interface MarketSummaryRequest {
  areaAr?: string;
  wilayatAr?: string;
  governorateAr?: string;
  purpose?: "sale" | "rent" | "both";
  marketData?: {
    avgSalePrice?: number;
    avgRentPrice?: number;
    pricePerSqm?: number;
    demandScore?: number;
    rentalYield?: number;
    priceChangePct?: number;
  };
}

export interface MarketSummaryResponse extends AIBaseResponse {
  summaryAr?: string;
  demandTrendAr?: string;
  priceTrendAr?: string;
  popularAreasAr?: string[];
  disclaimer?: string;
}

// ── Duplicate risk ─────────────────────────────────────────────────────────────
export interface DuplicateRiskRequest {
  listingTitleAr: string;
  areaAr: string;
  price: number;
  bedrooms?: number | null;
  area?: number;
  descriptionAr?: string;
  duplicateRisk: "none" | "low" | "medium" | "high";
  matchedFields?: string[];
}

export interface DuplicateRiskResponse extends AIBaseResponse {
  summaryAr?: string;
  riskLevel?: AIRiskLevel;
  similarFieldsAr?: string[];
  recommendedActionAr?: string;
}

// ── Listing quality ────────────────────────────────────────────────────────────
export interface ListingQualityRequest {
  qualityScore: number;
  titleAr: string;
  descriptionAr: string;
  imageCount: number;
  hasDocuments: boolean;
  hasHighlights: boolean;
  price?: number;
  areaAr?: string;
  bedrooms?: number | null;
  area?: number;
  purpose: string;
  propertyType: string;
}

export interface ListingQualitySuggestion {
  categoryAr: string;   // e.g. "الوصف", "الصور", "السعر"
  suggestionAr: string;
  priority: "high" | "medium" | "low";
}

export interface ListingQualityResponse extends AIBaseResponse {
  overallFeedbackAr?: string;
  suggestions?: ListingQualitySuggestion[];
}

// ── Smart reply ────────────────────────────────────────────────────────────────
export type SmartReplyTrigger =
  | "is_available"
  | "request_visit"
  | "price_negotiable"
  | "send_location"
  | "financing_question"
  | "general";

export interface SmartReplyRequest {
  trigger: SmartReplyTrigger;
  leadMessageAr?: string;
  listingTitleAr?: string;
  agentNameAr?: string;
  price?: number;
  areaAr?: string;
}

export interface SmartReplyResponse extends AIBaseResponse {
  replies?: string[];     // 2-3 suggested Arabic WhatsApp replies
}

// ── AI usage log (placeholder — persisted in Phase 13) ────────────────────────
export interface AIUsageLog {
  userId?: string;
  feature: AIFeature;
  inputTokenEstimate: number;
  outputTokenEstimate: number;
  timestamp: string;
  success: boolean;
  isMockFallback: boolean;
  planId?: string;          // "free" | "agent_pro" | "agency"
  dailyUsageCount?: number; // placeholder
}
