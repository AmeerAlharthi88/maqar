import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Phone OTP uses a direct token exchange (no redirect).
        // @supabase/ssr defaults to "pkce" which requires a redirect-based
        // code exchange and causes verifyOtp to hang indefinitely.
        // "implicit" flow returns tokens directly from verifyOtp — correct
        // for phone OTP without a callback route.
        flowType: "implicit",
        // NOTE: Do NOT add a lock override here.
        // Bypassing navigator.locks causes concurrent token refresh races:
        // two simultaneous getSession() calls both attempt to refresh the
        // single-use refresh token — the second fails, Supabase fires
        // SIGNED_OUT, and AuthSessionProvider clears the session (auto-logout).
        // signOut() UI hang is handled in AccountSettings.tsx (fire-and-forget).
      },
    }
  );
}
