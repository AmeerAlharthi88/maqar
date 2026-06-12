// GET /api/admin/verification
// Returns the KYC verification queue (service-role; bypasses RLS).
// Requires: admin or super_admin role.

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { fetchAdminVerifications } from "@/lib/supabase/admin.server";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const requests = await fetchAdminVerifications();
    return NextResponse.json({ success: true, data: requests });
  } catch (err) {
    console.error("[api/admin/verification] fetch failed:", err);
    return NextResponse.json({ success: false, error: "fetch_failed" }, { status: 500 });
  }
}
