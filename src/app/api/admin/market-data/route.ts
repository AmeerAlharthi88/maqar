// GET /api/admin/market-data
// Returns all market data rows for admin management page.
// Requires: admin or super_admin role.

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { fetchAdminMarketData } from "@/lib/supabase/admin.server";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  try {
    const rows = await fetchAdminMarketData();
    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    console.error("[api/admin/market-data] fetch failed:", err);
    return NextResponse.json({ success: false, error: "fetch_failed" }, { status: 500 });
  }
}
