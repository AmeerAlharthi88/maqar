// POST /api/ai/assistant
// Buyer/renter AI assistant. Guest allowed with placeholder rate limiting.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assistant } from "@/lib/ai/provider";
import { guardMessages } from "@/lib/ai/safety";
import { createClient } from "@/lib/supabase/server";

const messageSchema = z.object({
  role:    z.enum(["user", "assistant"]),
  content: z.string().min(1).max(1200),
});

const bodySchema = z.object({
  messages:  z.array(messageSchema).min(1).max(10),
  sessionId: z.string().max(80).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json().catch(() => null);
    if (!json) return NextResponse.json({ success: false, errorCode: "invalid_input" }, { status: 400 });

    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ success: false, errorCode: "invalid_input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    // Safety check on messages
    const guard = guardMessages(parsed.data.messages);
    if (!guard.safe) {
      return NextResponse.json({ success: false, errorCode: "invalid_input", errorMessage: "المحادثة تحتوي على محتوى غير مقبول." }, { status: 400 });
    }

    let userId: string | undefined;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    } catch { /* guest allowed */ }

    // TODO: Phase 13 — enforce guest rate limit by IP from x-forwarded-for
    // const ip = req.headers.get("x-forwarded-for") ?? "unknown";

    const result = await assistant({ messages: guard.messages, sessionId: parsed.data.sessionId }, userId);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch {
    return NextResponse.json({ success: false, errorCode: "unknown" }, { status: 500 });
  }
}
