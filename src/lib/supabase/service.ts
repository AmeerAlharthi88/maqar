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
 * Sanitizes an environment-variable value that is destined for an HTTP header
 * (e.g. the Supabase URL or service-role key). Copy/paste from editors or files
 * can prepend a UTF-8 BOM (U+FEFF) or add stray whitespace/newlines. When such a
 * value is later placed into a fetch() header, the request throws
 * "Cannot convert argument to a ByteString ..." and every service-role call
 * fails silently (this is exactly what broke Production admin endpoints).
 *
 * Strips a leading BOM and trims surrounding whitespace/newlines. Returns the
 * cleaned string (never logs or returns the secret anywhere visible).
 */
function sanitizeEnv(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/^﻿/, "").trim();
}

/**
 * Returns a Supabase client authenticated with the service role key.
 * Bypasses RLS — use only in server-side code for privileged operations.
 *
 * The key/URL are sanitized (BOM + whitespace stripped) so an accidentally
 * BOM-prefixed value still works. A genuinely missing or malformed key throws a
 * clear server-side configuration error — WITHOUT ever printing the secret.
 *
 * @throws {Error} If SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL are
 *                 missing or malformed after sanitization.
 */
export function createServiceClient() {
  const url = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const key = sanitizeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!url || !key) {
    throw new Error(
      "[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "These must be set as server-side environment variables. " +
        "NEVER add SUPABASE_SERVICE_ROLE_KEY as a NEXT_PUBLIC_ variable."
    );
  }

  // The service-role key is a JWT — it must start with "eyJ" and contain only
  // header-safe (Latin-1) characters. If not, fail clearly rather than letting a
  // ByteString error surface deep inside an opaque fetch call. The key itself is
  // never included in the error message.
  if (!key.startsWith("eyJ") || /[^\x20-\x7E]/.test(key)) {
    throw new Error(
      "[Supabase] SUPABASE_SERVICE_ROLE_KEY is malformed (not a clean JWT). " +
        "It must start with 'eyJ' and contain no BOM/invisible/non-ASCII characters. " +
        "Re-enter the key in the host environment without a leading BOM or whitespace."
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
