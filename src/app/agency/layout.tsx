import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Auth-guard only — no AppShell here.
// Each page wraps with AgencyDashboardShell which provides AppShell + DashboardNav.
export default async function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/agency/dashboard");
  }

  return <>{children}</>;
}
