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
        // Override the default Web Locks API lock with a simple passthrough.
        // navigator.locks.request() can deadlock in some environments
        // (preview iframes, React strict-mode double-mount) causing getSession()
        // and signOut() to hang indefinitely. Single-tab sessions don't need
        // cross-tab locking.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lock: (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => fn(),
      },
    }
  );
}
