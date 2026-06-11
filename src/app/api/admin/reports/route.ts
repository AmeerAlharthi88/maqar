// GET /api/admin/reports
// Returns admin reports queue. Optional ?status= filter.
// Requires: admin or super_admin role.

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { fetchAdminReports } from "@/lib/supabase/admin.server";
import type { ReportStatus } from "@/types/admin";

const VALID_STATUSES: ReportStatus[] = ["new", "reviewing", "resolved", "dismissed", "escalated"];

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const url    = new URL(req.url);
  const status = url.searchParams.get("status") as ReportStatus | null;

  try {
    const reports = await fetchAdminReports(
      status && VALID_STATUSES.includes(status) ? status : undefined
    );
    return NextResponse.json({ success: true, data: reports });
  } catch (err) {
    console.error("[api/admin/reports] fetch failed:", err);
    return NextResponse.json({ success: false, error: "fetch_failed" }, { status: 500 });
  }
}
