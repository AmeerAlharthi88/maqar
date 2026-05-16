// POST /api/ai/valuation
// Returns an AI-driven price position analysis for a property.
// Auth: logged-in user preferred.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { valuation } from "@/lib/ai/provider";
import { guardInput } from "@/lib/ai/safety";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  propertyType:     z.string().min(1).max(60),
  purpose:          z.enum(["sale", "rent"]),
  price:            z.number().positive(),
  area:             z.number().positive(),
  bedrooms:         z.number().int().min(0).max(20).nullable().optional(),
  bathrooms:        z.number().int().min(0).max(20).nullable().optional(),
  areaAr:           z.string().min(1).max(80),
  wilayatAr:        z.string().min(1).max(80),
  marketAvgPrice:   z.number().positive().nullable().optional(),
  pricePerSqm:      z.number().positive().nullable().optional(),
  marketPricePerSqm: z.number().positive().nullable().optional(),
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
    const areaGuard = guardInput(data.areaAr, 80);
    if (!areaGuard.safe) {
      return NextResponse.json({ success: false, errorCode: "invalid_input", errorMessage: "المدخلات غير صالحة." }, { status: 400 });
    }

    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch { /* guest allowed */ }

    const result = await valuation({ ...data, areaAr: areaGuard.value }, userId);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch {
    return NextResponse.json({ success: false, errorCode: "unknown" }, { status: 500 });
  }
}
