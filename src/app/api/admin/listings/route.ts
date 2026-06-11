// GET /api/admin/listings
// Returns pending + suspicious listings for admin review queue.
// Requires: admin or super_admin role.

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { fetchPendingListings } from "@/lib/supabase/admin.server";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const listings = await fetchPendingListings();
    return NextResponse.json({ success: true, data: listings });
  } catch (err) {
    console.error("[api/admin/listings] fetch failed:", err);
    return NextResponse.json({ success: false, error: "fetch_failed" }, { status: 500 });
  }
}
