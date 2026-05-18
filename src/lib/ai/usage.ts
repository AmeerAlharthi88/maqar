// ── AI usage tracking — Phase H ──────────────────────────────────────────────
// Server-side only. Never import from client components.
//
// logAIUsage()      — inserts a row into ai_usage_logs via service role.
//                     Fire-and-forget: never blocks the AI response.
// checkUsageLimit() — fetches the user's plan from subscriptions, counts
//                     today's successful calls from ai_usage_logs, and
//                     returns { allowed, remaining, resetAt }.
//
// Both functions use createServiceClient() which bypasses RLS. This is
// intentional — log inserts must succeed regardless of user auth state,
// and daily-count queries must be reliable (not filtered by session).
//
// DEV behaviour when service role key is missing:
//   · logAIUsage()      → logs to console only, no DB write.
//   · checkUsageLimit() → always returns { allowed: true } (no enforcement).

import { createServiceClient } from "@/lib/supabase/service";
import type { AIFeature, AIUsageLog } from "./types";

// ── Plan limits (daily per feature) ──────────────────────────────────────────
// Source of truth for plan-based AI rate limits.
// Mirrors Phase G subscription entitlements in src/lib/payments/plans.ts.
export const AI_PLAN_LIMITS: Record<string, Record<AIFeature, number>> = {
  free: {
    "generate-description": 3,
    "valuation":            5,
    "assistant":            10,
    "roi-explanation":      10,
    "market-summary":       5,
    "duplicate-risk":       3,
    "listing-quality":      3,
    "smart-reply":          0,    // not available on free plan
  },
  agent_pro: {
    "generate-description": 50,
    "valuation":            100,
    "assistant":            200,
    "roi-explanation":      200,
    "market-summary":       50,
    "duplicate-risk":       100,
    "listing-quality":      50,
    "smart-reply":          200,
  },
  agency: {
    "generate-description": 200,
    "valuation":            500,
    "assistant":            500,
    "roi-explanation":      500,
    "market-summary":       200,
    "duplicate-risk":       500,
    "listing-quality":      200,
    "smart-reply":          1000,
  },
};

// ── Guest limits (per-feature, no user tracking) ──────────────────────────────
// Guest calls are allowed for these features with no reliable IP-based
// enforcement (requires additional infra). The limit value is informational.
export const AI_GUEST_LIMITS: Partial<Record<AIFeature, number>> = {
  "assistant":       3,
  "roi-explanation": 5,
  "market-summary":  5,
  "valuation":       2,
};

// ── Feature name ↔ DB enum mapper ────────────────────────────────────────────
// TypeScript AIFeature uses hyphens ("generate-description").
// DB ai_feature enum uses underscores ("generate_description").
function featureToDbEnum(feature: AIFeature): string {
  return feature.replace(/-/g, "_");
}

// ─────────────────────────────────────────────────────────────────────────────
// logAIUsage
// Inserts an AI usage event into ai_usage_logs via service role.
// Fire-and-forget: errors are caught and logged but never thrown to caller.
// NEVER includes prompt content, user PII, or stack traces in the log row.
// ─────────────────────────────────────────────────────────────────────────────
export async function logAIUsage(log: AIUsageLog): Promise<void> {
  // Always log to console in development for visibility
  if (process.env.NODE_ENV === "development") {
    console.log("[AI Usage]", {
      feature:   log.feature,
      userId:    log.userId ?? "guest",
      tokens:    `${log.inputTokenEstimate}in / ${log.outputTokenEstimate}out`,
      success:   log.success,
      mock:      log.isMockFallback,
      timestamp: log.timestamp,
    });
  }

  // Async DB insert — fire-and-forget so AI response is never delayed
  void (async () => {
    try {
      const supabase = createServiceClient();

      // Resolve plan at time of call for audit trail
      let planId: string | null = null;
      if (log.userId) {
        const { data } = await supabase
          .from("subscriptions")
          .select("plan_id")
          .eq("user_id", log.userId)
          .maybeSingle();
        planId = (data?.plan_id as string) ?? null;
      }

      await supabase.from("ai_usage_logs").insert({
        user_id:          log.userId ?? null,
        feature:          featureToDbEnum(log.feature),
        plan_id:          planId,
        input_token_est:  log.inputTokenEstimate || null,
        output_token_est: log.outputTokenEstimate || null,
        success:          log.success,
        is_mock_fallback: log.isMockFallback,
        metadata:         log.planId ? { plan_at_call: log.planId } : {},
        error_message:    null, // never store prompt content or traces
      });
    } catch (err) {
      // Service role not configured or DB unavailable — log and move on
      console.error("[AI Usage] logAIUsage DB error (non-fatal):", err instanceof Error ? err.message : err);
    }
  })();
}

// ─────────────────────────────────────────────────────────────────────────────
// checkUsageLimit
// 1. Resolves the user's current plan from the subscriptions table.
// 2. Looks up the daily limit for plan + feature.
// 3. Counts today's successful calls from ai_usage_logs.
// 4. Returns { allowed, remaining, resetAt }.
//
// Guests (no userId): allowed if feature is in AI_GUEST_LIMITS, no DB tracking.
// Service role missing (dev): always returns allowed = true.
// ─────────────────────────────────────────────────────────────────────────────
export async function checkUsageLimit(
  feature: AIFeature,
  userId?: string,
  _planId?: string   // kept for interface compatibility — resolved internally
): Promise<{ allowed: boolean; remaining?: number; resetAt?: string }> {
  // ── Guest path ──────────────────────────────────────────────────────────────
  if (!userId) {
    const guestLimit = AI_GUEST_LIMITS[feature];
    if (guestLimit === undefined) {
      // Feature not available to guests
      return { allowed: false, remaining: 0 };
    }
    // Allow guests — no reliable per-IP daily tracking without extra infra
    return { allowed: true, remaining: guestLimit };
  }

  // ── Authenticated user path ─────────────────────────────────────────────────
  try {
    const supabase = createServiceClient();

    // 1. Fetch user's current plan
    const { data: subRow } = await supabase
      .from("subscriptions")
      .select("plan_id")
      .eq("user_id", userId)
      .maybeSingle();

    const planId = (subRow?.plan_id as string) ?? "free";
    const planLimits = AI_PLAN_LIMITS[planId] ?? AI_PLAN_LIMITS["free"];
    const dailyLimit = planLimits[feature] ?? 0;

    // 2. Feature unavailable on this plan
    if (dailyLimit === 0) {
      return {
        allowed:   false,
        remaining: 0,
      };
    }

    // 3. Count today's successful calls for this user + feature
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from("ai_usage_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("feature", featureToDbEnum(feature))
      .eq("success", true)
      .eq("is_mock_fallback", false)   // mock calls don't count against quota
      .gte("created_at", todayStart.toISOString());

    if (error) {
      console.error("[AI Usage] checkUsageLimit count error:", error);
      // Fail open on DB error — don't block users because of logging infra issues
      return { allowed: true };
    }

    const dailyCount = count ?? 0;
    const remaining  = Math.max(0, dailyLimit - dailyCount);

    // Reset time: start of tomorrow (Oman time approximated as UTC+4)
    const resetAt = new Date();
    resetAt.setDate(resetAt.getDate() + 1);
    resetAt.setHours(0, 0, 0, 0);

    return {
      allowed:  dailyCount < dailyLimit,
      remaining,
      resetAt:  resetAt.toISOString().slice(0, 10),
    };
  } catch (err) {
    // Service role not configured (dev without service key) — fail open
    console.warn("[AI Usage] checkUsageLimit unavailable (non-fatal):", err instanceof Error ? err.message : err);
    return { allowed: true };
  }
}
