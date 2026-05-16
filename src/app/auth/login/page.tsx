import type { Metadata } from "next";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PhoneOtpForm } from "@/components/auth/PhoneOtpForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول | مقر",
  description: "سجّل دخولك برقم الجوال العُماني.",
};

export default function LoginPage() {
  return (
    <AppShell>
      <Suspense>
        <PhoneOtpForm />
      </Suspense>
    </AppShell>
  );
}
