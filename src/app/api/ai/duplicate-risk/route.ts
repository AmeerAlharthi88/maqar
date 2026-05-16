// POST /api/ai/duplicate-risk
// Admin / agent / add-listing use. Auth recommended.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { duplicateRisk } from "@/lib/ai/provider";
import { guardInput } from "@/lib/ai/safety";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  listingTitleAr: z.string().min(1).max(120),
  areaAr:         z.string().min(1).max(80),
  price:          z.number().positive(),
  bedrooms:       z.number().int().min(0).max(20).nullable().optional(),
  area:           z.number().positive().optional(),
  descriptionAr:  z.string().max(800).optional(),
  duplicateRisk:  z.enum(["none", "low", "medium", "high"]),
  matchedFields:  z.array(z.string().max(40)).max(10).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    if (!json) return NextResponse.json({ success: false, errorCode: "invalid_input" }, { status: 400 });

    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errorCode: "invalid_input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const data = parsed.data;

    // Safety checks
    const titleGuard = guardInput(data.listingTitleAr, 120);
    if (!titleGuard.safe) {
      return NextResponse.json({ success: false, errorCode: "invalid_input" }, { status: 400 });
    }

    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch { /* non-fatal */ }

    const result = await duplicateRisk({ ...data, listingTitleAr: titleGuard.value }, userId);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch {
    return NextResponse.json({ success: false, errorCode: "unknown" }, { status: 500 });
  }
}
