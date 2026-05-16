import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileCompletionForm } from "@/components/auth/ProfileCompletionForm";

export const metadata: Metadata = {
  title: "إعداد الحساب | مقر",
};

export default function OnboardingPage() {
  return (
    <AppShell>
      <Suspense>
        <ProfileCompletionForm />
      </Suspense>
    </AppShell>
  );
}
