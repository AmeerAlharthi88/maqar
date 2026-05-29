import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AccountDashboard } from "@/components/account/AccountDashboard";

export const metadata: Metadata = {
  title: "حسابي | مقر",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch authoritative profile row from DB.
  // profiles.role is the source of truth — user_metadata.role is never set
  // for manually-promoted admin/agent users and must not be used for display.
  // The profiles_own_select RLS policy allows authenticated users to read
  // their own row, so this query runs under the user's session cookie.
  const { data: profileRow } = user
    ? await supabase
        .from("profiles")
        .select("name_ar, role, avatar_url, is_verified, verification_status, onboarding_completed")
        .eq("id", user.id)
        .single()
    : { data: null };

  const meta = user?.user_metadata ?? {};

  const profile = {
    // Prefer DB values; fall back to user_metadata for robustness
    nameAr:              profileRow?.name_ar              ?? (meta.name_ar as string)              ?? "مستخدم",
    phone:               user?.phone                      ?? "",
    role:                profileRow?.role                 ?? (meta.role as string)                 ?? "user",
    isVerified:          profileRow?.is_verified          ?? Boolean(meta.is_verified),
    verificationStatus:  profileRow?.verification_status  ?? (meta.verification_status as string)  ?? "not_started",
    onboardingCompleted: profileRow?.onboarding_completed ?? Boolean(meta.onboarding_completed),
    avatarUrl:           profileRow?.avatar_url           ?? (meta.avatar_url as string | undefined),
  };

  return <AccountDashboard profile={profile} />;
}
