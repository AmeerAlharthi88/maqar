// POST /api/ai/roi-explanation
// Returns a simple Arabic ROI explanation. Guest allowed.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { roiExplanation } from "@/lib/ai/provider";
import { guardInput } from "@/lib/ai/safety";

const bodySchema = z.object({
  price:          z.number().positive(),
  estimatedRent:  z.number().positive().optional(),
  roiEstimate:    z.number().positive().optional(),
  areaAr:         z.string().min(1).max(80),
  wilayatAr:      z.string().min(1).max(80),
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
    const areaGuard = guardInput(data.areaAr, 80);
    if (!areaGuard.safe) {
      return NextResponse.json({ success: false, errorCode: "invalid_input" }, { status: 400 });
    }

    const result = await roiExplanation({ ...data, areaAr: areaGuard.value });
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch {
    return NextResponse.json({ success: false, errorCode: "unknown" }, { status: 500 });
  }
}
