// ── POST /api/analytics/event ─────────────────────────────────────────────────
// Server-side analytics event ingestion.
//
// Security model:
//   · Uses SUPABASE_SERVICE_ROLE_KEY — bypasses RLS, never exposed to client.
//   · Accepts requests from any origin (public/anonymous tracking allowed).
//   · Input is validated and sanitised before any DB write.
//   · No sensitive user data is stored beyond an opaque user_id reference.
//
// Called by: src/lib/supabase/analytics.ts → trackEvent()
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

const VALID_EVENT_TYPES = new Set([
  "view",
  "whatsapp_click",
  "call_click",
  "save",
  "share",
  "appointment_request",
  "offer_submit",
]);

export async function POST(req: NextRequest) {
  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: {
    listing_id?: string;
    agent_id?: string | null;
    agency_id?: string | null;
    user_id?: string | null;
    event_type?: string;
    session_id?: string | null;
    source?: string | null;
    metadata?: Record<string, unknown>;
  };

  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    listing_id,
    agent_id,
    agency_id,
    user_id,
    event_type,
    session_id,
    source,
    metadata,
  } = body;

  // ── Validate required fields ────────────────────────────────────────────────
  if (!listing_id || typeof listing_id !== "string") {
    return NextResponse.json({ error: "listing_id is required" }, { status: 400 });
  }
  if (!event_type || !VALID_EVENT_TYPES.has(event_type)) {
    return NextResponse.json(
      { error: `event_type must be one of: ${[...VALID_EVENT_TYPES].join(", ")}` },
      { status: 400 }
    );
  }

  // ── Write to Supabase via service role (bypasses RLS) ──────────────────────
  try {
    const supabase = createServiceClient();

    // 1. Insert the analytics event row
    const { error: insertError } = await supabase
      .from("listing_analytics")
      .insert({
        listing_id,
        agent_id:   agent_id   ?? null,
        agency_id:  agency_id  ?? null,
        user_id:    user_id    ?? null,
        event_type,
        session_id: session_id ?? null,
        source:     source     ?? null,
        metadata:   metadata   ?? {},
      });

    if (insertError) {
      console.error("[Analytics API] insert error:", insertError);
      return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
    }

    // 2. Atomically increment the denormalised counter on listings
    //    Fire-and-forget — analytics insert already succeeded; counter is best-effort.
    if (event_type === "view") {
      supabase
        .rpc("increment_listing_view_count", { p_listing_id: listing_id })
        .then(({ error }) => {
          if (error) console.error("[Analytics API] increment view_count error:", error);
        });
    } else if (event_type === "whatsapp_click") {
      supabase
        .rpc("increment_listing_whatsapp_clicks", { p_listing_id: listing_id })
        .then(({ error }) => {
          if (error) console.error("[Analytics API] increment whatsapp_clicks error:", error);
        });
    } else if (event_type === "call_click") {
      supabase
        .rpc("increment_listing_call_clicks", { p_listing_id: listing_id })
        .then(({ error }) => {
          if (error) console.error("[Analytics API] increment call_clicks error:", error);
        });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Analytics API] unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
