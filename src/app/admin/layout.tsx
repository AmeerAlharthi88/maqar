import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { checkAdminAccess } from "@/lib/admin-auth";
import { AdminRestricted } from "@/components/admin/AdminRestricted";

// Private admin route — do not index
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Server-side role guard for all /admin and /admin/* routes (FP15).
//   · Unauthenticated     → redirect to login (as before).
//   · Authenticated, not  → render the restricted screen. The admin children
//     admin                 (shell / nav / tools / page content) are never
//                           streamed to non-admins.
//   · admin / super_admin  → render normally.
// The client AdminDashboardShell guard and the API requireAdmin() checks stay in
// place as defense-in-depth — this layout is the new authoritative server gate.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const access = await checkAdminAccess();

  if (!access.authenticated) {
    redirect("/auth/login?redirectTo=/admin");
  }

  if (!access.isAdmin) {
    return <AdminRestricted />;
  }

  return <>{children}</>;
}
