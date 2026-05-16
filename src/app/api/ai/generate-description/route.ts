// POST /api/ai/generate-description
// Generates an Arabic property title + description from draft data.
// Auth: logged-in user preferred; dev mock fallback if API key missing.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateDescription } from "@/lib/ai/provider";
import { guardInput } from "@/lib/ai/safety";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  propertyType: z.string().min(1).max(60),
  purpose:      z.enum(["sale", "rent", "investment"]),
  titleAr:      z.string().max(100).default(""),
  areaAr:       z.string().min(1).max(80),
  wilayatAr:    z.string().min(1).max(80),
  governorateAr: z.string().max(80).optional(),
  price:         z.number().positive().optional(),
  area:          z.number().positive().optional(),
  bedrooms:      z.number().int().min(0).max(20).nullable().optional(),
  bathrooms:     z.number().int().min(0).max(20).nullable().optional(),
  floors:        z.number().int().min(1).max(20).nullable().optional(),
  furnishing:    z.string().max(40).nullable().optional(),
  highlights:    z.array(z.string().max(60)).max(10).optional(),
  amenities:     z.array(z.string().max(60)).max(30).optional(),
  propertyAge:   z.string().max(20).nullable().optional(),
  hasPool:       z.boolean().optional(),
  hasMaidsRoom:  z.boolean().optional(),
  hasDriverRoom: z.boolean().optional(),
  hasCourtyard:  z.boolean().optional(),
  isFreehold:    z.boolean().optional(),
  hasRooftop:    z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate body
    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ success: false, errorCode: "invalid_input", errorMessage: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errorCode: "invalid_input", errorMessage: "Validation failed.", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const data = parsed.data;

    // Safety check on free-text fields
    const titleGuard = guardInput(data.titleAr || "عقار", 100);
    const areaGuard  = guardInput(data.areaAr, 80);
    if (!areaGuard.safe) {
      return NextResponse.json({ success: false, errorCode: "invalid_input", errorMessage: "المدخلات تحتوي على محتوى غير مقبول." }, { status: 400 });
    }

    // Optional auth — get userId if available
    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch {
      // Non-fatal — guests can use with lower limits
    }

    // Sanitize highlights/amenities
    const safeHighlights = (data.highlights ?? [])
      .map((h) => { const g = guardInput(h, 60); return g.safe ? g.value : null; })
      .filter((h): h is string => h !== null);

    const result = await generateDescription({
      ...data,
      titleAr:  titleGuard.safe ? titleGuard.value : "",
      areaAr:   areaGuard.value,
      highlights: safeHighlights,
    }, userId);

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch {
    // Never leak internal errors
    return NextResponse.json({ success: false, errorCode: "unknown", errorMessage: "خطأ داخلي." }, { status: 500 });
  }
}
