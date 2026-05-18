// GET /api/admin/aml
// Returns AML flags queue. Optional ?status= filter (TS AMLStatus values).
// Requires: admin or super_admin role.

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { fetchAMLFlags } from "@/lib/supabase/admin.server";
import type { AMLStatus } from "@/types/admin";

const VALID_STATUSES: AMLStatus[] = ["flagged", "cleared", "escalated", "rejected_listing"];

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const url    = new URL(req.url);
  const status = url.searchParams.get("status") as AMLStatus | null;

  const flags = await fetchAMLFlags(
    status && VALID_STATUSES.includes(status) ? status : undefined
  );

  return NextResponse.json({ success: true, data: flags });
}
