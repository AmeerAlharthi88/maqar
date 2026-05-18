"use client";

import { createClient } from "./client";
import type { UserProfile, VerificationStatus, NotificationPreferences } from "@/types/profile";
import { DEFAULT_NOTIFICATION_PREFS } from "@/types/profile";
import type { AppRole } from "@/config/roles";

// ── DB row → UserProfile mapper ───────────────────────────────────────────────
// email is not stored in public.profiles — must come from auth.users.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProfileRow(row: Record<string, any>, email?: string): UserProfile {
  return {
    id:                      row.id as string,
    nameAr:                  (row.name_ar as string) ?? "مستخدم جديد",
    phone:                   (row.phone as string) ?? undefined,
    email,
    role:                    ((row.role as AppRole) ?? "user") as AppRole,
    avatarUrl:               (row.avatar_url as string) ?? undefined,
    isVerified:              Boolean(row.is_verified ?? false),
    verificationStatus:      ((row.verification_status as VerificationStatus) ?? "not_started"),
    onboardingCompleted:     Boolean(row.onboarding_completed ?? false),
    preferredLocale:         ((row.preferred_locale as "ar" | "en") ?? "ar"),
    notificationPreferences: (row.notification_prefs as NotificationPreferences) ?? DEFAULT_NOTIFICATION_PREFS,
    createdAt:               (row.created_at as string) ?? undefined,
  };
}

// ── Fallback builder (auth.user_metadata) ────────────────────────────────────
// Used when the profiles table query fails (e.g. offline dev, missing DB).
function buildProfileFromMeta(user: {
  id: string;
  phone?: string | null;
  email?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user_metadata: Record<string, any>;
}): UserProfile {
  const meta = user.user_metadata ?? {};
  return {
    id:                      user.id,
    nameAr:                  (meta.name_ar as string) ?? "مستخدم جديد",
    phone:                   user.phone ?? meta.phone,
    email:                   user.email ?? meta.email,
    role:                    ((meta.role as AppRole) ?? "user") as AppRole,
    avatarUrl:               meta.avatar_url as string | undefined,
    isVerified:              Boolean(meta.is_verified ?? false),
    verificationStatus:      ((meta.verification_status as VerificationStatus) ?? "not_started"),
    onboardingCompleted:     Boolean(meta.onboarding_completed ?? false),
    preferredLocale:         ((meta.preferred_locale as "ar" | "en") ?? "ar"),
    notificationPreferences: (meta.notification_preferences as NotificationPreferences) ?? DEFAULT_NOTIFICATION_PREFS,
    createdAt:               meta.created_at as string | undefined,
  };
}

// ── J1: getCurrentProfile ─────────────────────────────────────────────────────
/** Reads the authenticated user's profile from public.profiles (source of truth).
 *  Falls back to auth.user_metadata if the DB row is unavailable (dev/offline). */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const { data: row, error: dbError } = await supabase
    .from("profiles")
    .select(
      "id, name_ar, phone, avatar_url, role, account_status, is_verified, " +
      "verification_status, onboarding_completed, preferred_locale, " +
      "notification_prefs, created_at"
    )
    .eq("id", user.id)
    .single();

  if (dbError || !row) {
    // Fallback: build from auth.user_metadata so the app stays functional
    console.warn("[profile] profiles table unavailable — using auth.user_metadata fallback:", dbError?.message);
    return buildProfileFromMeta({
      id: user.id,
      phone: user.phone,
      email: user.email,
      user_metadata: user.user_metadata,
    });
  }

  return mapProfileRow(row, user.email);
}

// ── getProfileById (server-callable helper) ───────────────────────────────────
/** Look up any profile by user ID. Uses the browser client — profiles are publicly
 *  readable so anon key is sufficient. Prefer getAgentProfile for agent-specific
 *  server-side fetches (which use the server client). */
export async function getProfileById(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();

  const { data: row, error } = await supabase
    .from("profiles")
    .select(
      "id, name_ar, phone, avatar_url, role, is_verified, " +
      "verification_status, onboarding_completed, preferred_locale, " +
      "notification_prefs, created_at"
    )
    .eq("id", userId)
    .single();

  if (error || !row) return null;
  return mapProfileRow(row);
}

// ── J2: updateProfile ─────────────────────────────────────────────────────────
/** Updates allowed editable fields in public.profiles.
 *
 *  Protected fields (role, is_verified, verification_status, agency_id,
 *  account_status, admin_notes, reviewed_by) are intentionally EXCLUDED from
 *  the allowed input type and are never written here.
 *
 *  RLS (profiles_own_update) ensures only the authenticated user's own row
 *  can be updated, even if this function is called with another user's ID. */
export async function updateProfile(
  partial: Partial<
    Pick<
      UserProfile,
      | "nameAr"
      | "preferredLocale"
      | "notificationPreferences"
      | "onboardingCompleted"
    >
  >
): Promise<{ error: Error | null }> {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: new Error("Not authenticated") };

  // Build safe DB update payload — only allowed fields
  const dbUpdate: Record<string, unknown> = {};
  if (partial.nameAr              !== undefined) dbUpdate.name_ar            = partial.nameAr;
  if (partial.preferredLocale     !== undefined) dbUpdate.preferred_locale   = partial.preferredLocale;
  if (partial.notificationPreferences !== undefined) dbUpdate.notification_prefs = partial.notificationPreferences;
  if (partial.onboardingCompleted !== undefined) dbUpdate.onboarding_completed = partial.onboardingCompleted;

  if (Object.keys(dbUpdate).length === 0) return { error: null }; // nothing to do

  const { error: dbError } = await supabase
    .from("profiles")
    .update(dbUpdate)
    .eq("id", user.id);

  if (dbError) return { error: dbError };

  // Secondary: keep auth.user_metadata in sync for session fallback
  const metaUpdate: Record<string, unknown> = {};
  if (partial.nameAr              !== undefined) metaUpdate.name_ar = partial.nameAr;
  if (partial.preferredLocale     !== undefined) metaUpdate.preferred_locale = partial.preferredLocale;
  if (partial.onboardingCompleted !== undefined) metaUpdate.onboarding_completed = partial.onboardingCompleted;

  if (Object.keys(metaUpdate).length > 0) {
    // Fire-and-forget — auth metadata sync failure should not surface to users
    supabase.auth.updateUser({ data: metaUpdate }).catch(() => {
      console.warn("[profile] auth.updateUser metadata sync failed (non-critical)");
    });
  }

  return { error: null };
}

// ── J3: createInitialProfile ──────────────────────────────────────────────────
/** Called once after OTP verification to set the user's display name and role.
 *
 *  Role is clamped to "user" | "agent" — self-elevation to admin/super_admin
 *  is blocked at this layer (admin role requires manual DB promotion).
 *
 *  Uses UPSERT because handle_new_user() trigger already inserted a skeleton row
 *  on auth.users INSERT; this enriches it with onboarding data. */
export async function createInitialProfile(
  nameAr: string,
  role: AppRole
): Promise<{ error: Error | null }> {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: new Error("Not authenticated") };

  // Safety: never allow client-driven elevation to privileged roles
  const safeRole: "user" | "agent" = role === "agent" ? "agent" : "user";

  const { error: dbError } = await supabase
    .from("profiles")
    .upsert(
      {
        id:                   user.id,
        name_ar:              nameAr,
        role:                 safeRole,
        onboarding_completed: true,
        preferred_locale:     "ar",
        notification_prefs:   DEFAULT_NOTIFICATION_PREFS,
      },
      { onConflict: "id" }
    );

  if (dbError) return { error: dbError };

  // Secondary: keep auth.user_metadata in sync for session fallback
  supabase.auth.updateUser({
    data: {
      name_ar:              nameAr,
      role:                 safeRole,
      onboarding_completed: true,
      preferred_locale:     "ar",
      notification_preferences: DEFAULT_NOTIFICATION_PREFS,
    },
  }).catch(() => {
    console.warn("[profile] auth.updateUser metadata sync failed (non-critical)");
  });

  return { error: null };
}

// ── J4: uploadAvatar ──────────────────────────────────────────────────────────
/** Uploads an image file to the avatars bucket and updates profiles.avatar_url.
 *
 *  Rules:
 *  - Allowed types: JPEG, PNG, WebP, GIF
 *  - Max size: 5 MB
 *  - Path: {user_id}/avatar.{ext}  (upsert so re-upload replaces the file)
 *  - KYC documents must use the documents bucket — never this function.
 *
 *  Returns the public URL on success. */
export async function uploadAvatar(
  file: File
): Promise<{ avatarUrl: string | null; error: Error | null }> {
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      avatarUrl: null,
      error: new Error("نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP."),
    };
  }
  if (file.size > MAX_BYTES) {
    return {
      avatarUrl: null,
      error: new Error("حجم الصورة يتجاوز الحد المسموح (5 ميغابايت)."),
    };
  }

  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { avatarUrl: null, error: new Error("Not authenticated") };
  }

  // Derive extension from MIME type (image/jpeg → jpeg, image/png → png …)
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const storagePath = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(storagePath, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return { avatarUrl: null, error: uploadError };
  }

  // Build the public URL (no expiry — bucket is public)
  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(storagePath);

  // Persist to profiles.avatar_url — RLS (profiles_own_update) guards this row
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (updateError) {
    return { avatarUrl: null, error: updateError };
  }

  return { avatarUrl: publicUrl, error: null };
}
