// POST /api/ai/market-summary
// Returns a short Arabic market analysis summary. Guest allowed.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { marketSummary } from "@/lib/ai/provider";

const bodySchema = z.object({
  areaAr:        z.string().max(80).optional(),
  wilayatAr:     z.string().max(80).optional(),
  governorateAr: z.string().max(80).optional(),
  purpose:       z.enum(["sale", "rent", "both"]).optional(),
  marketData: z.object({
    avgSalePrice:  z.number().positive().optional(),
    avgRentPrice:  z.number().positive().optional(),
    pricePerSqm:   z.number().positive().optional(),
    demandScore:   z.number().min(0).max(100).optional(),
    rentalYield:   z.number().min(0).max(100).optional(),
    priceChangePct: z.number().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    if (!json) return NextResponse.json({ success: false, errorCode: "invalid_input" }, { status: 400 });

    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errorCode: "invalid_input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const result = await marketSummary(parsed.data);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch {
    return NextResponse.json({ success: false, errorCode: "unknown" }, { status: 500 });
  }
}
