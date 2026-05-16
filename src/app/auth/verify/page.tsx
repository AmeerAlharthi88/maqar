import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";

export const metadata: Metadata = {
  title: "التحقق من الرمز | مقر",
};

export default function VerifyPage() {
  return (
    <AppShell>
      <Suspense>
        <OtpVerificationForm />
      </Suspense>
    </AppShell>
  );
}
