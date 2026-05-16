import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";
import { KYCVerificationForm } from "@/components/auth/KYCVerificationForm";

export const metadata: Metadata = {
  title: "التوثيق الرسمي | مقر",
  description: "وثّق حسابك كوسيط عقاري موثوق في مقر.",
};

export default async function AgentVerificationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/agent/verification");
  }

  return (
    <AppShell>
      <div className="bg-white border-b border-[#F0EBE3] px-4 py-3 flex items-center gap-3" dir="rtl">
        <div className="w-8 h-8 rounded-xl bg-[#C65D3B] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-[#1E1E1E]">التوثيق الرسمي</h1>
          <p className="text-xs text-[#A89480]">احصل على شارة الوسيط الموثوق</p>
        </div>
      </div>
      <KYCVerificationForm />
    </AppShell>
  );
}
