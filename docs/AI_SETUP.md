# AI Setup Guide — مقر

This document covers the AI features in مقر and how to configure them for production.

---

## Overview

مقر uses the Anthropic Claude API for two AI features:

1. **Valuation Assistant** (`/listing/[id]` → تحليل السعر بالذكاء الاصطناعي)
   - Analyzes a property's price vs. market average
   - Explains price positioning in Arabic
   - Provides investment insight

2. **Listing Description Generator** (Add Listing → Step 8)
   - Generates Arabic property descriptions from specs
   - Respects ethical guidelines (no exaggerated claims)

---

## Environment Variable

```env
ANTHROPIC_API_KEY=sk-ant-...    # server-side ONLY — never NEXT_PUBLIC_
```

> ⚠️ This key must NEVER be exposed to the client. It is only used in Server Actions and API Routes.

---

## Current Implementation

### Valuation Assistant

**File:** `src/components/ai/ValuationAssistant.tsx`  
**Server Action:** `src/app/actions/ai/analyze-price.ts`

The assistant receives:
- Property type, purpose (sale/rent), price, area (sqm), bedrooms, bathrooms
- Location (area name, wilayat)
- Market average price and price-per-sqm from mock data

**Prompt structure:**
```
أنت محلل عقاري متخصص في السوق العُماني.
تحلل سعر العقار التالي مقارنة بمتوسط السوق في منطقته:
[property details]
قدم تحليلاً موجزاً باللغة العربية (3-4 أسطر)...
```

### Usage Limits

| Plan | Daily AI Analyses |
|------|------------------|
| Free | 5 |
| Agent Pro | 50 |
| Agency | Unlimited |

Limits are currently enforced via mock counters. Wire to Supabase in production:

```sql
CREATE TABLE ai_usage (
  user_id   UUID REFERENCES profiles(id),
  date      DATE NOT NULL DEFAULT CURRENT_DATE,
  count     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, date)
);
```

---

## Model Configuration

Current model: `claude-3-5-haiku-20241022` (fast, cost-effective for short responses)

For higher quality valuations, upgrade to `claude-sonnet-4-5` or `claude-opus-4-5`:

```typescript
// src/app/actions/ai/analyze-price.ts
const response = await anthropic.messages.create({
  model: "claude-3-5-haiku-20241022",  // change if needed
  max_tokens: 300,
  messages: [{ role: "user", content: prompt }],
});
```

---

## Cost Estimates

Using `claude-3-5-haiku-20241022` (2024 pricing):
- Input: ~$0.80 / million tokens
- Output: ~$4.00 / million tokens
- Average valuation call: ~500 input + ~200 output tokens
- **Cost per call: ~$0.0012** (~0.00046 OMR)

At 1,000 analyses/day: **~$1.20/day (~$36/month)**

---

## Safety Guidelines

The AI prompts include explicit instructions to:
- NOT guarantee investment returns
- NOT make claims about government-regulated prices
- Clearly label all outputs as estimates (`تقدير - ليس تقييماً رسمياً`)
- Respond in Arabic only
- Keep responses concise (max 4 sentences)

---

## Adding New AI Features

1. Create a Server Action in `src/app/actions/ai/`
2. Import `Anthropic` from `@anthropic-ai/sdk` (server-side only)
3. Pass only the minimum required data — no PII in prompts
4. Add usage tracking before the API call
5. Handle errors gracefully (show fallback UI, never expose API errors to client)

---

## Production Checklist

- [ ] `ANTHROPIC_API_KEY` set in Vercel environment variables (Production + Preview)
- [ ] Usage limits wired to Supabase (not mock)
- [ ] Error monitoring for API failures (e.g., Sentry)
- [ ] Rate limiting on AI routes (`/api/ai/`)
- [ ] Test Arabic output quality on real property data
