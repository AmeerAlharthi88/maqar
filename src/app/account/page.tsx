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

  const meta = user?.user_metadata ?? {};

  const profile = {
    nameAr: (meta.name_ar as string) ?? "مستخدم",
    phone: user?.phone ?? "",
    role: (meta.role as string) ?? "user",
    isVerified: Boolean(meta.is_verified),
    verificationStatus: (meta.verification_status as string) ?? "not_started",
    onboardingCompleted: Boolean(meta.onboarding_completed),
    avatarUrl: meta.avatar_url as string | undefined,
  };

  return <AccountDashboard profile={profile} />;
}
