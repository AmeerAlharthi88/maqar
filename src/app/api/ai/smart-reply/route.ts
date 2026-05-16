// POST /api/ai/smart-reply
// Smart WhatsApp reply suggestions for agents. Auth preferred.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { smartReply } from "@/lib/ai/provider";
import { guardInput } from "@/lib/ai/safety";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  trigger:         z.enum(["is_available", "request_visit", "price_negotiable", "send_location", "financing_question", "general"]),
  leadMessageAr:   z.string().max(400).optional(),
  listingTitleAr:  z.string().max(120).optional(),
  agentNameAr:     z.string().max(80).optional(),
  price:           z.number().positive().optional(),
  areaAr:          z.string().max(80).optional(),
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

    // Guard free-text fields
    if (data.leadMessageAr) {
      const g = guardInput(data.leadMessageAr, 400);
      if (!g.safe) {
        return NextResponse.json({ success: false, errorCode: "invalid_input" }, { status: 400 });
      }
      data.leadMessageAr = g.value;
    }

    // Auth check — agents/agency_admins only ideally
    // TODO: Phase 13 — enforce agent/agency role check via Supabase profiles
    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch { /* non-fatal */ }

    const result = await smartReply(data, userId);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch {
    return NextResponse.json({ success: false, errorCode: "unknown" }, { status: 500 });
  }
}
