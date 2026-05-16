import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

// Private agent dashboard — do not index
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Auth-guard only — no AppShell here.
// Each page wraps with AgentDashboardShell which provides AppShell + DashboardNav.
export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/agent/dashboard");
  }

  return <>{children}</>;
}
