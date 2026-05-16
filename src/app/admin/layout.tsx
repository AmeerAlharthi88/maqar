import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

// Private admin route — do not index
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Auth-guard only — no AppShell here.
// AdminDashboardShell (client) provides AppShell + AdminNav + role check.
// TODO Phase 12: also verify user.role === "admin" | "super_admin" here
// from the Supabase `profiles` table before rendering children.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/admin");
  }

  return <>{children}</>;
}
