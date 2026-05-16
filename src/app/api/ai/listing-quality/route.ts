// POST /api/ai/listing-quality
// Listing quality improvement suggestions. Auth preferred.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { listingQuality } from "@/lib/ai/provider";
import { guardInput } from "@/lib/ai/safety";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  qualityScore:   z.number().min(0).max(100),
  titleAr:        z.string().min(1).max(120),
  descriptionAr:  z.string().max(2000),
  imageCount:     z.number().int().min(0),
  hasDocuments:   z.boolean(),
  hasHighlights:  z.boolean(),
  price:          z.number().positive().optional(),
  areaAr:         z.string().max(80).optional(),
  bedrooms:       z.number().int().min(0).max(20).nullable().optional(),
  area:           z.number().positive().optional(),
  purpose:        z.string().min(1).max(40),
  propertyType:   z.string().min(1).max(60),
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
    const titleGuard = guardInput(data.titleAr, 120);
    if (!titleGuard.safe) {
      return NextResponse.json({ success: false, errorCode: "invalid_input" }, { status: 400 });
    }

    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch { /* non-fatal */ }

    const result = await listingQuality({ ...data, titleAr: titleGuard.value }, userId);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch {
    return NextResponse.json({ success: false, errorCode: "unknown" }, { status: 500 });
  }
}
