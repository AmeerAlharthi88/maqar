// PATCH /api/admin/verification/[id]
// Update a KYC verification request (service-role; bypasses RLS).
// Requires: admin or super_admin role.
// Body: { status: "approved" | "rejected" | "needs_more_info", note?: string }

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { updateVerificationAdmin } from "@/lib/supabase/admin.server";

const bodySchema = z.object({
  status: z.enum(["approved", "rejected", "needs_more_info"]),
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

  const result = await updateVerificationAdmin(id, parsed.data.status, auth.userId, parsed.data.note);
  if (!result.ok) {
    return NextResponse.json(
      { success: false, error: result.error ?? "db_error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
