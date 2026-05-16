// ── AI usage tracking — Phase 12 ────────────────────────────────────────────
// Placeholder structure for usage logging and rate limiting.
// TODO: Phase 13 — persist to Supabase table `ai_usage_logs`
//   Schema:
//     id           uuid primary key
//     user_id      uuid references auth.users (nullable for guests)
//     feature      text not null
//     input_tokens int  not null default 0
//     output_tokens int not null default 0
//     success      bool not null
//     is_mock      bool not null default false
//     plan_id      text  -- "free" | "agent_pro" | "agency"
//     created_at   timestamptz default now()

import type { AIFeature, AIUsageLog } from "./types";

// ── Plan limits (placeholder — enforced in Phase 13) ─────────────────────────
export const AI_PLAN_LIMITS: Record<string, Record<AIFeature, number>> = {
  free: {
    "generate-description": 3,     // per day
    "valuation":            5,
    "assistant":            10,
    "roi-explanation":      10,
    "market-summary":       5,
    "duplicate-risk":       3,
    "listing-quality":      3,
    "smart-reply":          0,     // not available on free
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

// ── Guest limits ───────────────────────────────────────────────────────────────
export const AI_GUEST_LIMITS: Partial<Record<AIFeature, number>> = {
  "assistant":        3,    // per session/IP
  "roi-explanation":  5,
  "market-summary":   5,
  "valuation":        2,
};

// ── logAIUsage ────────────────────────────────────────────────────────────────
/**
 * Log AI feature usage.
 * TODO: Phase 13 — replace with Supabase insert via server action.
 */
export async function logAIUsage(log: AIUsageLog): Promise<void> {
  // Development: log to console only
  if (process.env.NODE_ENV === "development") {
    console.log("[AI Usage]", {
      feature:      log.feature,
      userId:       log.userId ?? "guest",
      tokens:       `${log.inputTokenEstimate}in / ${log.outputTokenEstimate}out`,
      success:      log.success,
      mock:         log.isMockFallback,
      timestamp:    log.timestamp,
    });
  }
  // TODO: Phase 13 — supabase.from("ai_usage_logs").insert(log)
}

// ── checkUsageLimit ───────────────────────────────────────────────────────────
/**
 * Check if a user/guest has reached their daily limit.
 * TODO: Phase 13 — query Supabase for real daily count.
 * Returns { allowed: true } always in Phase 12 (no real enforcement).
 */
export async function checkUsageLimit(
  _feature: AIFeature,
  _userId?: string,
  _planId?: string
): Promise<{ allowed: boolean; remaining?: number; resetAt?: string }> {
  // Phase 12: Always allow — real enforcement in Phase 13
  // TODO: query `ai_usage_logs` grouped by user_id + feature + date
  return { allowed: true };
}
