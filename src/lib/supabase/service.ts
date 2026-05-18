// ── Supabase Service Role Client ──────────────────────────────────────────────
// SECURITY: This client uses SUPABASE_SERVICE_ROLE_KEY which BYPASSES RLS.
//
// Rules:
//  · ONLY import this file from server-side code:
//      - /src/app/api/**/route.ts  (API route handlers)
//      - /src/app/**/actions.ts    (Server Actions)
//  · NEVER import in:
//      - Client components ("use client")
//      - src/lib/supabase/client.ts (browser client)
//      - Any file without explicit server-side guarantee
//  · NEVER expose SUPABASE_SERVICE_ROLE_KEY via NEXT_PUBLIC_ variables
//
// Use cases for service role:
//  · Admin operations (approve listings, review KYC, ban users)
//  · Payment webhook handling (update subscriptions after payment)
//  · AI usage logging (insert into ai_usage_logs from API routes)
//  · Analytics event tracking
// ─────────────────────────────────────────────────────────────────────────────

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Returns a Supabase client authenticated with the service role key.
 * Bypasses RLS — use only in server-side code for privileged operations.
 *
 * @throws {Error} If SUPABASE_SERVICE_ROLE_KEY is not set (misconfigured server env)
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "These must be set as server-side environment variables. " +
        "NEVER add SUPABASE_SERVICE_ROLE_KEY as a NEXT_PUBLIC_ variable."
    );
  }

  return createSupabaseClient(url, key, {
    auth: {
      // Disable auto token refresh and session persistence —
      // service role key does not participate in user auth flows.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
