// ── Analytics Supabase Service — Phase F ──────────────────────────────────────
// Client-callable functions for analytics event tracking and aggregate reads.
//
// Security model:
//   · trackEvent()               — POSTs to /api/analytics/event (server route,
//                                  service role; no direct Supabase write from client)
//   · fetchAgentAnalyticsSummary — uses browser client; RLS restricts to own agent_id
//
// DEV_SKIP_AUTH: trackEvent is a no-op; fetchAgentAnalyticsSummary returns null
// so pages fall back to MOCK data.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";
import type {
  AgentAnalyticsSummary,
  AnalyticsTimePoint,
  ListingPerformance,
} from "@/mock/agent-analytics";

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

// ── Event type ────────────────────────────────────────────────────────────────

export type AnalyticsEventType =
  | "view"
  | "whatsapp_click"
  | "call_click"
  | "save"
  | "share"
  | "appointment_request"
  | "offer_submit";

export interface TrackEventPayload {
  listingId: string;
  agentId?: string | null;
  agencyId?: string | null;
  userId?: string | null;
  eventType: AnalyticsEventType;
  sessionId?: string | null;
  source?: string | null;
  metadata?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// trackEvent
// Sends an analytics event to the server API route (/api/analytics/event).
// Uses fetch so it works in any browser context. Fire-and-forget safe.
// Never throws — errors are caught and logged so they don't break the UI.
// ─────────────────────────────────────────────────────────────────────────────
export async function trackEvent(payload: TrackEventPayload): Promise<void> {
  if (DEV_SKIP_AUTH) return;

  try {
    const res = await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listing_id: payload.listingId,
        agent_id:   payload.agentId   ?? null,
        agency_id:  payload.agencyId  ?? null,
        user_id:    payload.userId    ?? null,
        event_type: payload.eventType,
        session_id: payload.sessionId ?? null,
        source:     payload.source    ?? null,
        metadata:   payload.metadata  ?? {},
      }),
    });
    if (!res.ok) {
      console.warn("[Analytics] trackEvent non-OK response:", res.status);
    }
  } catch (err) {
    console.error("[Analytics] trackEvent fetch error:", err);
  }
}

// ── DB row shapes ─────────────────────────────────────────────────────────────

interface DbAnalyticsRow {
  listing_id: string;
  event_type: string;
  created_at: string;
}

interface DbListingRow {
  id: string;
  title_ar: string;
  price_omr: number;
  status: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchAgentAnalyticsSummary
// Returns aggregate analytics for the given agentId over the last `days` days.
// Uses browser client — RLS ensures the agent only sees their own data.
// Returns null if no data exists (caller shows mock fallback).
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchAgentAnalyticsSummary(
  agentId: string,
  days = 30
): Promise<AgentAnalyticsSummary | null> {
  if (DEV_SKIP_AUTH) return null;

  const supabase = createClient();
  const since = new Date(Date.now() - days * 86_400_000).toISOString();

  // ── Step 1: Fetch all events for this agent in the window ──────────────────
  const { data: rows, error } = await supabase
    .from("listing_analytics")
    .select("listing_id, event_type, created_at")
    .eq("agent_id", agentId)
    .gte("created_at", since)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[Analytics] fetchAgentAnalyticsSummary error:", error);
    return null;
  }
  if (!rows || rows.length === 0) return null;

  const analyticsRows = rows as DbAnalyticsRow[];

  // ── Step 2: Aggregate totals by event type ─────────────────────────────────
  const counts: Record<string, number> = {};
  for (const row of analyticsRows) {
    counts[row.event_type] = (counts[row.event_type] ?? 0) + 1;
  }

  const totalViews          = counts["view"]                 ?? 0;
  const totalWhatsappClicks = counts["whatsapp_click"]       ?? 0;
  const totalCallClicks     = counts["call_click"]           ?? 0;
  const totalSaves          = counts["save"]                 ?? 0;
  const totalLeads          = counts["appointment_request"]  ?? 0;
  const totalAppointments   = counts["appointment_request"]  ?? 0;
  const totalOffers         = counts["offer_submit"]         ?? 0;
  const conversionRate =
    totalViews > 0 ? +((totalLeads / totalViews) * 100).toFixed(1) : 0;

  // ── Step 3: Build time-series grouped by date ─────────────────────────────
  const byDate: Record<string, AnalyticsTimePoint> = {};
  for (const row of analyticsRows) {
    const date = row.created_at.slice(0, 10);
    if (!byDate[date]) {
      byDate[date] = { date, views: 0, whatsappClicks: 0, callClicks: 0, leads: 0 };
    }
    const pt = byDate[date];
    if (row.event_type === "view")                 pt.views++;
    else if (row.event_type === "whatsapp_click")  pt.whatsappClicks++;
    else if (row.event_type === "call_click")      pt.callClicks++;
    else if (row.event_type === "appointment_request") pt.leads++;
  }
  const timeSeries: AnalyticsTimePoint[] = Object.values(byDate).sort(
    (a, b) => a.date.localeCompare(b.date)
  );

  // ── Step 4: Find top listings by view count ────────────────────────────────
  const viewsByListing: Record<string, number> = {};
  for (const row of analyticsRows) {
    if (row.event_type === "view") {
      viewsByListing[row.listing_id] = (viewsByListing[row.listing_id] ?? 0) + 1;
    }
  }
  const topListingIds = Object.entries(viewsByListing)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);

  let topListings: ListingPerformance[] = [];
  if (topListingIds.length > 0) {
    const { data: listingRows } = await supabase
      .from("listings")
      .select("id, title_ar, price_omr, status")
      .in("id", topListingIds);

    if (listingRows) {
      topListings = (listingRows as DbListingRow[]).map((l) => {
        // Count per-listing events
        const lRows = analyticsRows.filter((r) => r.listing_id === l.id);
        const lCounts: Record<string, number> = {};
        for (const r of lRows) {
          lCounts[r.event_type] = (lCounts[r.event_type] ?? 0) + 1;
        }
        // Map DB status → UI status
        const rawStatus = l.status as string;
        const uiStatus: ListingPerformance["status"] =
          rawStatus === "pending_review" ? "pending"
          : (["active", "draft", "sold", "rejected"].includes(rawStatus)
              ? (rawStatus as ListingPerformance["status"])
              : "active");

        return {
          listingId:      l.id,
          titleAr:        l.title_ar,
          views:          lCounts["view"]                ?? 0,
          whatsappClicks: lCounts["whatsapp_click"]      ?? 0,
          callClicks:     lCounts["call_click"]          ?? 0,
          saves:          lCounts["save"]                ?? 0,
          leads:          lCounts["appointment_request"] ?? 0,
          status:         uiStatus,
          daysOnMarket:   0,
          price:          Number(l.price_omr),
        };
      });
    }
  }

  return {
    agentId,
    period: "30d",
    totalViews,
    totalWhatsappClicks,
    totalCallClicks,
    totalSaves,
    totalLeads,
    totalAppointments,
    totalOffers,
    conversionRate,
    avgResponseTime: "—",
    topListings,
    timeSeries,
  };
}
