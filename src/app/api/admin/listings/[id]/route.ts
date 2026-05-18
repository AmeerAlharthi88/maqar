// PATCH /api/admin/listings/[id]
// Approve, reject, or request changes on a listing.
// Requires: admin or super_admin role.
// Body: { action: "approve" | "reject" | "request_changes", note?: string }

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import {
  approveListingAdmin,
  rejectListingAdmin,
  requestChangesListingAdmin,
} from "@/lib/supabase/admin.server";

const bodySchema = z.object({
  action: z.enum(["approve", "reject", "request_changes"]),
  note:   z.string().max(500).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, error: "missing_id" }, { status: 400 });
  }

  const json = await req.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ success: false, error: "invalid_body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "invalid_input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { action, note } = parsed.data;

  let result: { ok: boolean; error?: string };
  if (action === "approve") {
    result = await approveListingAdmin(id, auth.userId);
  } else if (action === "reject") {
    result = await rejectListingAdmin(id, auth.userId, note);
  } else {
    result = await requestChangesListingAdmin(id, auth.userId, note);
  }

  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: result.error ?? "db_error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
