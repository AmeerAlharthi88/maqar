"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useAddListingStore } from "@/store/add-listing.store";
import { useFavoritesStore } from "@/store/favorites.store";
import { useSavedSearchesStore, rowToSavedSearch } from "@/store/saved-searches.store";
import { createClient } from "@/lib/supabase/client";
import { getCurrentProfile } from "@/lib/supabase/profile";
import { fetchSavedSearches } from "@/lib/supabase/saved-searches";
import type { AppRole } from "@/config/roles";

function userFromSupabase(
  sbUser: NonNullable<Awaited<ReturnType<ReturnType<typeof createClient>["auth"]["getUser"]>>["data"]["user"]>
) {
  const meta = sbUser.user_metadata ?? {};
  return {
    id: sbUser.id,
    email: sbUser.email,
    phone: sbUser.phone ?? undefined,
    nameAr: (meta.name_ar as string) ?? undefined,
    role: ((meta.role as AppRole) ?? "user") as AppRole,
    isVerified: Boolean(meta.is_verified ?? false),
    avatarUrl: meta.avatar_url as string | undefined,
  };
}

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";
const DEV_USER_ID = process.env.DEV_BYPASS_USER_ID ?? "83dc5029-d4dc-42c7-ba36-b312260c51c6";

/** Hydrates per-user Supabase data into local stores after authentication. */
async function hydrateUserStores(userId: string) {
  const favoritesStore = useFavoritesStore.getState();
  const savedSearchesStore = useSavedSearchesStore.getState();

  // Run both fetches in parallel — neither depends on the other
  const [, savedSearchRows] = await Promise.allSettled([
    favoritesStore.fetchAndHydrate(userId),
    fetchSavedSearches(userId),
  ]);

  // Apply saved searches if fetch succeeded
  if (savedSearchRows.status === "fulfilled" && savedSearchRows.value.length > 0) {
    savedSearchesStore.setItems(savedSearchRows.value.map(rowToSavedSearch));
  }
}

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, clearSession } = useAuthStore();

  useEffect(() => {
    // ── Dev bypass ───────────────────────────────────────────────────────────
    // Skips all Supabase auth calls when NEXT_PUBLIC_DEV_SKIP_AUTH=true.
    // Allows Phase B/C testing without a working Supabase auth connection.
    // Favorites and saved searches stay local-only in bypass mode.
    if (DEV_SKIP_AUTH) {
      useAddListingStore.getState().reconcileOwner(DEV_USER_ID);
      setUser({
        id: DEV_USER_ID,
        phone: "+96892961266",
        nameAr: "مستخدم تطوير",
        role: "agent",
        isVerified: false,
      });
      setProfile(null); // profile optional — onboarding check skipped below
      return; // no subscription needed
    }

    const supabase = createClient();

    // ── Hydrate on mount ─────────────────────────────────────────────────────
    // Safety timeout: if getSession() hangs (slow network / Supabase unreachable),
    // unblock the UI after 6 seconds rather than spinning forever.
    const authTimeoutId = setTimeout(() => {
      console.warn("[Auth] getSession() timed out — clearing session to unblock UI");
      clearSession();
    }, 6000);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(authTimeoutId);
      // Reconcile the persisted add-listing draft to the current user BEFORE
      // unblocking the UI (setUser flips isLoading=false). This wipes/replaces a
      // draft left by a different account so it never flashes for this user.
      useAddListingStore.getState().reconcileOwner(session?.user?.id ?? null);
      if (session?.user) {
        setUser(userFromSupabase(session.user));
        const profile = await getCurrentProfile();
        setProfile(profile);
        // Sync role from DB: profiles table is source of truth.
        // user_metadata.role may be stale (e.g. manually-promoted admin users
        // whose metadata was never updated to reflect the new role).
        if (profile?.role) {
          const cur = useAuthStore.getState().user;
          if (cur) setUser({ ...cur, role: profile.role });
        }
        // Hydrate user-specific stores from Supabase
        hydrateUserStores(session.user.id).catch((err) =>
          console.error("[Auth] hydrateUserStores error:", err)
        );
      } else {
        clearSession();
      }
    }).catch((err) => {
      clearTimeout(authTimeoutId);
      console.error("[Auth] getSession() error:", err);
      clearSession();
    });

    // ── Listen for future changes ────────────────────────────────────────────
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // IMPORTANT: this callback is synchronous (no async/await).
      // @supabase/auth-js awaits ALL onAuthStateChange callbacks via Promise.all
      // before returning from verifyOtp / signInWithOtp. Any awaited async work
      // here directly adds to the time the caller (e.g. OtpVerificationForm)
      // waits for verifyOtp to resolve — causing timeouts on slow networks.
      // All async work below is deliberately fire-and-forget (void).
      //
      // Scope the persisted add-listing draft to whoever is now signed in. On a
      // SIGNED_IN as a different account this discards the previous user's draft
      // and step; on SIGNED_OUT it wipes the device-local draft entirely. This
      // call is synchronous (plain store updates) so it does not delay verifyOtp.
      useAddListingStore.getState().reconcileOwner(session?.user?.id ?? null);
      if (session?.user) {
        // On TOKEN_REFRESHED: preserve the in-memory role that was already confirmed
        // from the DB (profile fetch) so the admin guard never sees a stale "user"
        // role between the synchronous setUser() and the async profile re-verify.
        // On SIGNED_IN or first load: the store is empty/different user — use metadata
        // (profile fetch will correct the role moments later).
        const existing = useAuthStore.getState().user;
        const baseUser = userFromSupabase(session.user);
        const isSameUser = existing?.id === session.user.id;
        const hasElevatedRole = existing?.role !== undefined && existing.role !== "user";
        setUser(
          event === "TOKEN_REFRESHED" && isSameUser && hasElevatedRole
            ? { ...baseUser, role: existing!.role }
            : baseUser
        );
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          // Fire-and-forget: do not block the auth state change notification
          void getCurrentProfile().then((profile) => {
            setProfile(profile);
            // Sync role from DB: profiles table is source of truth.
            // user_metadata.role may be stale for manually-promoted admin users.
            if (profile?.role) {
              const cur = useAuthStore.getState().user;
              if (cur) setUser({ ...cur, role: profile.role });
            }
          });
          if (event === "SIGNED_IN") {
            void hydrateUserStores(session.user.id).catch((err) =>
              console.error("[Auth] hydrateUserStores error:", err)
            );
          }
        }
      } else {
        clearSession();
        // Clear user-specific stores on sign-out
        useFavoritesStore.getState().reset();
        useSavedSearchesStore.getState().reset();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, clearSession]);

  return <>{children}</>;
}
