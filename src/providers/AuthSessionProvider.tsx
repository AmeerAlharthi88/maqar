"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { createClient } from "@/lib/supabase/client";
import { getCurrentProfile } from "@/lib/supabase/profile";
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

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, clearSession } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // ── Hydrate on mount ─────────────────────────────────────────────────────
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(userFromSupabase(session.user));
        const profile = await getCurrentProfile();
        setProfile(profile);
      } else {
        clearSession();
      }
    });

    // ── Listen for future changes ────────────────────────────────────────────
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(userFromSupabase(session.user));
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const profile = await getCurrentProfile();
          setProfile(profile);
        }
      } else {
        clearSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, clearSession]);

  return <>{children}</>;
}
