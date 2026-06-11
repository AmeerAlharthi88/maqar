// GET /api/admin/duplicates
// Returns duplicate alert queue. Optional ?status= filter.
// Requires: admin or super_admin role.

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { fetchDuplicateAlerts } from "@/lib/supabase/admin.server";
import type { DuplicateStatus } from "@/types/admin";

const VALID_STATUSES: DuplicateStatus[] = [
  "pending", "confirmed_duplicate", "not_duplicate", "merged",
];

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const url    = new URL(req.url);
  const status = url.searchParams.get("status") as DuplicateStatus | null;

  try {
    const alerts = await fetchDuplicateAlerts(
      status && VALID_STATUSES.includes(status) ? status : undefined
    );
    return NextResponse.json({ success: true, data: alerts });
  } catch (err) {
    console.error("[api/admin/duplicates] fetch failed:", err);
    return NextResponse.json({ success: false, error: "fetch_failed" }, { status: 500 });
  }
}
