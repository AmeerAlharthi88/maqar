// ── AI prompts — Phase 12 ────────────────────────────────────────────────────
// All prompt templates are defined here.
// These are server-side only — never imported by client components.
//
// Design principles:
// - Arabic-first output
// - Oman/GCC real estate context
// - Professional, realistic tone — no hyperbole
// - No false legal/financial claims
// - Clear disclaimers where required

import type {
  GenerateDescriptionRequest,
  ValuationRequest,
  ROIExplanationRequest,
  MarketSummaryRequest,
  DuplicateRiskRequest,
  ListingQualityRequest,
  SmartReplyRequest,
} from "./types";

// ── System prompt (shared base) ───────────────────────────────────────────────
export const SYSTEM_BASE = `أنت مساعد عقاري متخصص في سوق العقارات العُماني والخليجي.
ردودك دائماً باللغة العربية الفصيحة، مهنية وواضحة.
لا تدّعي أرقاماً رسمية أو معلومات قانونية — دائماً أوضح أن المعلومات إرشادية فقط.
لا تستخدم الرموز التعبيرية أو المبالغة في الوصف.
اجعل ردودك مختصرة ومفيدة.`;

// ── Property description generator ────────────────────────────────────────────
export function buildDescriptionPrompt(req: GenerateDescriptionRequest): string {
  const featuresList: string[] = [];
  if (req.hasPool)        featuresList.push("مسبح خاص");
  if (req.hasMaidsRoom)   featuresList.push("غرفة خادمة");
  if (req.hasDriverRoom)  featuresList.push("غرفة سائق");
  if (req.hasCourtyard)   featuresList.push("فناء داخلي");
  if (req.isFreehold)     featuresList.push("ملكية حرة (فريهولد)");
  if (req.hasRooftop)     featuresList.push("سطح خاص");
  if (req.highlights?.length) featuresList.push(...req.highlights);

  const specsText = [
    req.bedrooms != null ? `${req.bedrooms} غرفة نوم` : null,
    req.bathrooms != null ? `${req.bathrooms} حمام` : null,
    req.area ? `مساحة ${req.area} م²` : null,
    req.floors ? `${req.floors} طوابق` : null,
    req.furnishing ? `أثاث: ${req.furnishing}` : null,
    req.propertyAge ? `عمر العقار: ${req.propertyAge} سنوات` : null,
  ].filter(Boolean).join("، ");

  const purposeLabel = req.purpose === "sale" ? "بيع" : req.purpose === "rent" ? "إيجار" : "استثمار";

  return `اكتب عنواناً واضحاً ووصفاً عقارياً احترافياً باللغة العربية للإعلان التالي:

النوع: ${req.propertyType}
الغرض: ${purposeLabel}
الموقع: ${[req.areaAr, req.wilayatAr, req.governorateAr].filter(Boolean).join("، ")}
${req.price ? `السعر: ${req.price.toLocaleString()} ر.ع.` : ""}
${specsText ? `المواصفات: ${specsText}` : ""}
${featuresList.length > 0 ? `المميزات: ${featuresList.join("، ")}` : ""}
${req.amenities?.length ? `المرافق: ${req.amenities.join("، ")}` : ""}

القواعد:
- العنوان: جملة واحدة لا تتجاوز ٧٠ حرفاً — واضح، محدد، لا مبالغة
- الوصف: ٣–٥ جمل، مهنية وموضوعية
- لا تذكر أرقاماً سعرية محددة في الوصف
- لا تستخدم عبارات قانونية أو وعوداً بالعوائد
- لا تستخدم الرموز التعبيرية

أجب بصيغة JSON بالشكل التالي فقط (بدون أي نص خارج JSON):
{"titleAr": "...", "descriptionAr": "..."}`;
}

// ── Valuation assistant ────────────────────────────────────────────────────────
export function buildValuationPrompt(req: ValuationRequest): string {
  const priceDiff = req.marketAvgPrice
    ? Math.round(((req.price - req.marketAvgPrice) / req.marketAvgPrice) * 100)
    : null;

  const diffText = priceDiff !== null
    ? priceDiff > 0
      ? `يبلغ السعر المطلوب ${priceDiff}٪ أعلى من متوسط السوق`
      : priceDiff < 0
      ? `يبلغ السعر المطلوب ${Math.abs(priceDiff)}٪ أقل من متوسط السوق`
      : "يساوي السعر متوسط السوق"
    : "لا تتوفر بيانات مقارنة بالسوق";

  return `قيّم الوضع التسعيري لهذا العقار العُماني بشكل موضوعي وقصير:

النوع: ${req.propertyType}
الغرض: ${req.purpose === "sale" ? "بيع" : "إيجار"}
الموقع: ${req.areaAr}، ${req.wilayatAr}
السعر المطلوب: ${req.price.toLocaleString()} ر.ع.
${req.area ? `المساحة: ${req.area} م²` : ""}
${req.bedrooms != null ? `الغرف: ${req.bedrooms}` : ""}
${req.marketAvgPrice ? `متوسط السوق في المنطقة: ${req.marketAvgPrice.toLocaleString()} ر.ع.` : ""}
${req.pricePerSqm ? `سعر المتر المربع: ${req.pricePerSqm} ر.ع/م²` : ""}
مقارنة السعر: ${diffText}

القواعد:
- ملخص موضوعي في ٢–٣ جمل
- مستوى الثقة: اختر أحد الخيارات التالية فقط: منخفض / متوسط / مرتفع
- نوع الموضع: fair / above / below
- لا تدّعي أرقاماً رسمية أو تقييم معتمد
- لا تذكر عوامل غير مذكورة في البيانات

أجب بصيغة JSON فقط:
{"summaryAr": "...", "positionLabel": "...", "positionType": "fair|above|below", "confidence": "منخفض|متوسط|مرتفع"}`;
}

// ── Buyer/Renter assistant ─────────────────────────────────────────────────────
export const ASSISTANT_SYSTEM = `${SYSTEM_BASE}

أنت مساعد عقاري للمشترين والمستأجرين في سلطنة عُمان.
تساعد المستخدمين على اتخاذ قرارات عقارية مدروسة.
إذا سأل المستخدم عن عقار محدد، وضّح أنك تقدم إرشادات عامة وليس توصيات رسمية.
في نهاية ردودك على أسئلة الاستثمار، أضف: "ملاحظة: هذه معلومات إرشادية وليست نصيحة مالية أو قانونية."
اجعل ردودك بين ٥٠ و٢٠٠ كلمة.`;

// ── ROI explanation ────────────────────────────────────────────────────────────
export function buildROIPrompt(req: ROIExplanationRequest): string {
  const annualReturn = req.estimatedRent ? req.estimatedRent * 12 : null;
  const roiPct = req.roiEstimate ?? (annualReturn ? ((annualReturn / req.price) * 100).toFixed(1) : null);

  return `اشرح العائد الاستثماري التقديري لهذا العقار بأسلوب واضح ومختصر:

العقار: ${req.propertyType} في ${req.areaAr}، ${req.wilayatAr}
السعر: ${req.price.toLocaleString()} ر.ع.
${req.estimatedRent ? `الإيجار الشهري التقديري: ${req.estimatedRent.toLocaleString()} ر.ع.` : ""}
${roiPct ? `العائد التقديري: ${roiPct}٪ سنوياً` : ""}

القواعد:
- شرح بسيط للعائد في جملتين
- جملة للسيناريو الإيجابي (أفضل حالة)
- جملة للمخاطر الرئيسية
- لا تعطِ توصيات استثمار قاطعة
- لا تذكر أرقاماً بنكية أو ضمانات

أجب بصيغة JSON فقط:
{"explanationAr": "...", "bestCaseNote": "...", "worstCaseNote": "...", "mainRisksAr": "..."}`;
}

// ── Market summary ─────────────────────────────────────────────────────────────
export function buildMarketSummaryPrompt(req: MarketSummaryRequest): string {
  const location = [req.areaAr, req.wilayatAr, req.governorateAr].filter(Boolean).join("، ") || "سلطنة عُمان";
  const md = req.marketData ?? {};

  return `اكتب ملخصاً موجزاً لسوق العقارات في ${location}:

${md.avgSalePrice ? `متوسط سعر البيع: ${md.avgSalePrice.toLocaleString()} ر.ع.` : ""}
${md.avgRentPrice ? `متوسط الإيجار الشهري: ${md.avgRentPrice.toLocaleString()} ر.ع.` : ""}
${md.pricePerSqm ? `سعر المتر المربع: ${md.pricePerSqm} ر.ع/م²` : ""}
${md.demandScore != null ? `مؤشر الطلب: ${md.demandScore}/١٠٠` : ""}
${md.rentalYield != null ? `العائد الإيجاري: ${md.rentalYield}٪` : ""}
${md.priceChangePct != null ? `تغيّر الأسعار السنوي: ${md.priceChangePct > 0 ? "+" : ""}${md.priceChangePct}٪` : ""}

القواعد:
- الملخص: ٢–٣ جمل موضوعية
- اتجاه الطلب: جملة واحدة
- اتجاه الأسعار: جملة واحدة
- لا تدّعي بيانات رسمية
- لا تقدم توصيات شراء محددة

أجب بصيغة JSON فقط:
{"summaryAr": "...", "demandTrendAr": "...", "priceTrendAr": "..."}`;
}

// ── Duplicate risk ─────────────────────────────────────────────────────────────
export function buildDuplicateRiskPrompt(req: DuplicateRiskRequest): string {
  const riskLabels: Record<string, string> = {
    none: "منعدم", low: "منخفض", medium: "متوسط", high: "مرتفع",
  };

  return `حلّل خطر تكرار هذا الإعلان العقاري وقدّم ملخصاً مختصراً:

العنوان: ${req.listingTitleAr}
الموقع: ${req.areaAr}
السعر: ${req.price.toLocaleString()} ر.ع.
${req.bedrooms != null ? `الغرف: ${req.bedrooms}` : ""}
${req.area ? `المساحة: ${req.area} م²` : ""}
مستوى الخطر المكتشف تلقائياً: ${riskLabels[req.duplicateRisk] ?? "غير محدد"}
${req.matchedFields?.length ? `الحقول المتطابقة: ${req.matchedFields.join("، ")}` : ""}

القواعد:
- ملخص سبب الخطر في جملة أو جملتين
- حدد مستوى الخطر: منخفض / متوسط / مرتفع
- اقترح إجراء واحداً موصى به
- لا تحكم على نية الوسيط

أجب بصيغة JSON فقط:
{"summaryAr": "...", "riskLevel": "منخفض|متوسط|مرتفع", "similarFieldsAr": [...], "recommendedActionAr": "..."}`;
}

// ── Listing quality ────────────────────────────────────────────────────────────
export function buildListingQualityPrompt(req: ListingQualityRequest): string {
  return `حلّل جودة هذا الإعلان العقاري وقدّم اقتراحات عملية لتحسينه:

درجة الجودة الحالية: ${req.qualityScore}/١٠٠
العنوان: ${req.titleAr}
الوصف (${req.descriptionAr.length} حرف): ${req.descriptionAr.slice(0, 300)}
عدد الصور: ${req.imageCount}
وثائق: ${req.hasDocuments ? "نعم" : "لا"}
مميزات بارزة: ${req.hasHighlights ? "نعم" : "لا"}
${req.price ? `السعر: ${req.price.toLocaleString()} ر.ع.` : ""}
${req.bedrooms != null ? `الغرف: ${req.bedrooms}` : ""}
${req.area ? `المساحة: ${req.area} م²` : ""}
النوع: ${req.propertyType}، الغرض: ${req.purpose}

القواعد:
- ملاحظة عامة قصيرة (جملة واحدة)
- ٢–٤ اقتراحات محددة وقابلة للتنفيذ
- كل اقتراح له فئة (الوصف / الصور / السعر / الوثائق / الثقة)
- الأولوية: high إذا أثّر على الظهور، medium لتحسين، low لتلميع

أجب بصيغة JSON فقط:
{"overallFeedbackAr": "...", "suggestions": [{"categoryAr": "...", "suggestionAr": "...", "priority": "high|medium|low"}]}`;
}

// ── Smart replies ──────────────────────────────────────────────────────────────
export function buildSmartReplyPrompt(req: SmartReplyRequest): string {
  const triggerLabels: Record<string, string> = {
    is_available:       "السؤال: هل العقار لا يزال متاحاً؟",
    request_visit:      "السؤال: هل يمكن ترتيب زيارة؟",
    price_negotiable:   "السؤال: هل السعر قابل للتفاوض؟",
    send_location:      "السؤال: أرسل الموقع من فضلك",
    financing_question: "السؤال: هل يمكن التمويل البنكي؟",
    general:            "رسالة عامة من عميل",
  };

  return `اقترح ردوداً مهنية مختصرة لوسيط عقاري عُماني على رسالة واتساب من عميل.

سياق الإعلان:
${req.listingTitleAr ? `العقار: ${req.listingTitleAr}` : ""}
${req.areaAr ? `الموقع: ${req.areaAr}` : ""}
${req.price ? `السعر: ${req.price.toLocaleString()} ر.ع.` : ""}
${req.agentNameAr ? `اسم الوسيط: ${req.agentNameAr}` : ""}
${req.leadMessageAr ? `رسالة العميل: "${req.leadMessageAr}"` : ""}
${triggerLabels[req.trigger] ?? ""}

القواعد:
- ٢–٣ ردود مقترحة مختلفة في الأسلوب
- كل رد لا يتجاوز ٤٠ كلمة
- واتساب-فريندلي: مهني لكن ودود
- لا تذكر معلومات غير مؤكدة
- لا ترسل الموقع الدقيق أو رقم الهاتف في الرد
- استخدم صيغة المذكر للوسيط ما لم يُحدد خلاف ذلك

أجب بصيغة JSON فقط:
{"replies": ["...", "...", "..."]}`;
}
