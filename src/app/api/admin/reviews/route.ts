// GET /api/admin/reviews
// Returns the reviews moderation queue (service-role; bypasses RLS).
// Requires: admin or super_admin role.

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { fetchAdminReviews } from "@/lib/supabase/admin.server";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const reviews = await fetchAdminReviews();
    return NextResponse.json({ success: true, data: reviews });
  } catch (err) {
    console.error("[api/admin/reviews] fetch failed:", err);
    return NextResponse.json({ success: false, error: "fetch_failed" }, { status: 500 });
  }
}
