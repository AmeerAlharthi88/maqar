// GET /api/admin/audit-logs
// Returns audit log entries. Optional ?category= and ?severity= filters.
// Requires: admin or super_admin role.

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { fetchAuditLogs } from "@/lib/supabase/admin.server";
import type { AuditCategory } from "@/types/admin";

const VALID_CATEGORIES: AuditCategory[] = [
  "admin_action","listing_action","verification_action","user_action",
  "payment_action","ai_action","security_action","system_action",
];
const VALID_SEVERITIES = ["low", "medium", "high", "critical"];

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const url      = new URL(req.url);
  const category = url.searchParams.get("category") as AuditCategory | null;
  const severity = url.searchParams.get("severity");

  try {
    const logs = await fetchAuditLogs({
      category: category && VALID_CATEGORIES.includes(category) ? category : undefined,
      severity:  severity && VALID_SEVERITIES.includes(severity) ? severity : undefined,
    });
    return NextResponse.json({ success: true, data: logs });
  } catch (err) {
    console.error("[api/admin/audit-logs] fetch failed:", err);
    return NextResponse.json({ success: false, error: "fetch_failed" }, { status: 500 });
  }
}
