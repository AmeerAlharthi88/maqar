"use client";

import { createClient } from "./client";
import type { UserProfile, VerificationStatus } from "@/types/profile";
import { DEFAULT_NOTIFICATION_PREFS } from "@/types/profile";
import type { AppRole } from "@/config/roles";

// ── Internal helper ───────────────────────────────────────────────────────────

function buildProfileFromUser(user: {
  id: string;
  phone?: string | null;
  email?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user_metadata: Record<string, any>;
}): UserProfile {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    nameAr: (meta.name_ar as string) ?? "مستخدم جديد",
    phone: user.phone ?? meta.phone,
    email: user.email ?? meta.email,
    role: ((meta.role as AppRole) ?? "user") as AppRole,
    avatarUrl: meta.avatar_url as string | undefined,
    isVerified: Boolean(meta.is_verified ?? false),
    verificationStatus: (
      (meta.verification_status as VerificationStatus) ?? "not_started"
    ),
    onboardingCompleted: Boolean(meta.onboarding_completed ?? false),
    preferredLocale: (meta.preferred_locale as "ar" | "en") ?? "ar",
    notificationPreferences:
      meta.notification_preferences ?? DEFAULT_NOTIFICATION_PREFS,
    createdAt: meta.created_at as string | undefined,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Get the current user's profile built from auth user_metadata.
 *  TODO: Replace with profiles table query once DB migration is applied. */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  // TODO: const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return buildProfileFromUser({
    id: user.id,
    phone: user.phone,
    email: user.email,
    user_metadata: user.user_metadata,
  });
}

/** Update mutable profile fields. Persists to auth user_metadata.
 *  TODO: Also upsert into profiles table once DB migration is applied. */
export async function updateProfile(
  partial: Partial<
    Pick<
      UserProfile,
      | "nameAr"
      | "preferredLocale"
      | "notificationPreferences"
      | "onboardingCompleted"
      | "role"
    >
  >
): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const meta: Record<string, unknown> = {};
  if (partial.nameAr !== undefined) meta.name_ar = partial.nameAr;
  if (partial.preferredLocale !== undefined)
    meta.preferred_locale = partial.preferredLocale;
  if (partial.notificationPreferences !== undefined)
    meta.notification_preferences = partial.notificationPreferences;
  if (partial.onboardingCompleted !== undefined)
    meta.onboarding_completed = partial.onboardingCompleted;
  if (partial.role !== undefined) meta.role = partial.role;

  const { error } = await supabase.auth.updateUser({ data: meta });
  // TODO: await supabase.from("profiles").upsert({ id, ...mapped })
  return { error: error ?? null };
}

/** Called once after OTP verification to set the user's name and role. */
export async function createInitialProfile(
  nameAr: string,
  role: AppRole
): Promise<{ error: Error | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      name_ar: nameAr,
      role,
      onboarding_completed: true,
      preferred_locale: "ar",
      notification_preferences: DEFAULT_NOTIFICATION_PREFS,
    },
  });
  // TODO: await supabase.from("profiles").insert({ id: user.id, name_ar: nameAr, role, ... })
  return { error: error ?? null };
}
