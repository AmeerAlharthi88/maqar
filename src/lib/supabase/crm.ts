// ── CRM Supabase Service — Phase D ────────────────────────────────────────────
// Browser-client functions for leads, appointments, and offers.
//
// Security model (mirrors RLS on the DB side):
//   · createLead/createAppointment/createOffer — require authenticated user
//   · fetchAgent* — require the caller to be the listing agent (agent_id)
//   · updateLeadStatus / updateAppointmentStatus / updateOfferStatus — agent only
//
// DEV_SKIP_AUTH: all writes return null, all reads return [] so the agent pages
// fall back to MOCK data in local development.
//
// UUID guard: if listing.agentId is not a real UUID (mock listing data) we skip
// the Supabase insert to avoid FK violations.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/client";
import type { LeadSource, LeadStatus, AppointmentStatus, OfferStatus, FinancingType } from "@/types/lead";

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

/** Validates that a string looks like a UUID v4. */
function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

// ── DB row shapes (snake_case from Supabase) ──────────────────────────────────

interface DbLeadRow {
  id: string;
  listing_id: string;
  user_id: string | null;
  agent_id: string;
  source: string;
  status: string;
  customer_name: string | null;
  customer_phone: string | null;
  message: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  listings?: { title_ar: string } | null;
}

interface DbAppointmentRow {
  id: string;
  listing_id: string;
  user_id: string;
  agent_id: string;
  preferred_date: string; // YYYY-MM-DD
  preferred_time: string; // Arabic text slot
  status: string;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  listings?: { title_ar: string } | null;
}

interface DbOfferRow {
  id: string;
  listing_id: string;
  user_id: string;
  agent_id: string;
  offer_amount_omr: number;
  asking_price_omr: number;
  financing_type: string | null;
  status: string;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  listings?: { title_ar: string } | null;
}

// ── Public interfaces for the UI ──────────────────────────────────────────────

export interface CrmLead {
  id: string;
  listingId: string;
  listingTitleAr: string;
  userId: string | null;
  agentId: string;
  source: LeadSource;
  status: LeadStatus;
  customerName: string;
  customerPhone: string;
  message: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CrmAppointment {
  id: string;
  listingId: string;
  listingTitleAr: string;
  userId: string;
  agentId: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // Arabic text
  status: AppointmentStatus;
  customerName: string;
  customerPhone: string;
  notes: string | null;
  createdAt: string;
}

export interface CrmOffer {
  id: string;
  listingId: string;
  listingTitleAr: string;
  userId: string;
  agentId: string;
  offerAmountOmr: number;
  askingPriceOmr: number;
  financingType: FinancingType | null;
  status: OfferStatus;
  customerName: string;
  customerPhone: string;
  notes: string | null;
  createdAt: string;
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapLead(row: DbLeadRow): CrmLead {
  return {
    id: row.id,
    listingId: row.listing_id,
    listingTitleAr: row.listings?.title_ar ?? "",
    userId: row.user_id,
    agentId: row.agent_id,
    source: row.source as LeadSource,
    status: row.status as LeadStatus,
    customerName: row.customer_name ?? "",
    customerPhone: row.customer_phone ?? "",
    message: row.message,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAppointment(row: DbAppointmentRow): CrmAppointment {
  return {
    id: row.id,
    listingId: row.listing_id,
    listingTitleAr: row.listings?.title_ar ?? "",
    userId: row.user_id,
    agentId: row.agent_id,
    preferredDate: row.preferred_date,
    preferredTime: row.preferred_time,
    status: row.status as AppointmentStatus,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function mapOffer(row: DbOfferRow): CrmOffer {
  return {
    id: row.id,
    listingId: row.listing_id,
    listingTitleAr: row.listings?.title_ar ?? "",
    userId: row.user_id,
    agentId: row.agent_id,
    offerAmountOmr: Number(row.offer_amount_omr),
    askingPriceOmr: Number(row.asking_price_omr),
    financingType: (row.financing_type as FinancingType) ?? null,
    status: row.status as OfferStatus,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEADS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CreateLeadInput {
  listingId: string;
  agentId: string;
  userId: string;
  source: LeadSource;
  customerName?: string;
  customerPhone?: string;
  message?: string;
}

/**
 * Creates a lead record when a user contacts a listing agent.
 * Returns the new lead ID on success, null on failure or dev bypass.
 */
export async function createLead(input: CreateLeadInput): Promise<string | null> {
  if (DEV_SKIP_AUTH) return null;
  if (!isUUID(input.agentId) || !isUUID(input.userId) || !isUUID(input.listingId)) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      listing_id:     input.listingId,
      user_id:        input.userId,
      agent_id:       input.agentId,
      source:         input.source,
      status:         "new",
      customer_name:  input.customerName ?? null,
      customer_phone: input.customerPhone ?? null,
      message:        input.message ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[crm] createLead error:", error.message);
    return null;
  }
  return data.id;
}

/**
 * Fetches all leads where the current user is the listing agent.
 * Returns [] in dev bypass mode or on error (caller falls back to MOCK).
 */
export async function fetchAgentLeads(agentId: string): Promise<CrmLead[]> {
  if (DEV_SKIP_AUTH || !isUUID(agentId)) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*, listings(title_ar)")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[crm] fetchAgentLeads error:", error.message);
    return [];
  }
  return (data ?? []).map((r) => mapLead(r as unknown as DbLeadRow));
}

/**
 * Updates the status (and optionally notes) of a lead the agent owns.
 */
export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
  notes?: string
): Promise<void> {
  if (DEV_SKIP_AUTH) return;

  const supabase = createClient();
  const patch: Record<string, string> = { status };
  if (notes !== undefined) patch.notes = notes;

  const { error } = await supabase
    .from("leads")
    .update(patch)
    .eq("id", leadId);

  if (error) console.error("[crm] updateLeadStatus error:", error.message);
}

// ═══════════════════════════════════════════════════════════════════════════════
// APPOINTMENTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CreateAppointmentInput {
  listingId: string;
  agentId: string;
  userId: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // Arabic time slot
  customerName: string;
  customerPhone: string;
  notes?: string;
}

/**
 * Creates a viewing appointment.
 * Returns the new appointment ID on success, null on failure or dev bypass.
 */
export async function createAppointment(input: CreateAppointmentInput): Promise<string | null> {
  if (DEV_SKIP_AUTH) return null;
  if (!isUUID(input.agentId) || !isUUID(input.userId) || !isUUID(input.listingId)) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      listing_id:     input.listingId,
      user_id:        input.userId,
      agent_id:       input.agentId,
      preferred_date: input.preferredDate,
      preferred_time: input.preferredTime,
      status:         "pending",
      customer_name:  input.customerName,
      customer_phone: input.customerPhone,
      notes:          input.notes ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[crm] createAppointment error:", error.message);
    return null;
  }
  return data.id;
}

/**
 * Fetches all appointments where the current user is the listing agent.
 */
export async function fetchAgentAppointments(agentId: string): Promise<CrmAppointment[]> {
  if (DEV_SKIP_AUTH || !isUUID(agentId)) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*, listings(title_ar)")
    .eq("agent_id", agentId)
    .order("preferred_date", { ascending: false });

  if (error) {
    console.error("[crm] fetchAgentAppointments error:", error.message);
    return [];
  }
  return (data ?? []).map((r) => mapAppointment(r as unknown as DbAppointmentRow));
}

/**
 * Updates the status of an appointment the agent owns.
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
): Promise<void> {
  if (DEV_SKIP_AUTH) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId);

  if (error) console.error("[crm] updateAppointmentStatus error:", error.message);
}

// ═══════════════════════════════════════════════════════════════════════════════
// OFFERS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CreateOfferInput {
  listingId: string;
  agentId: string;
  userId: string;
  offerAmountOmr: number;
  askingPriceOmr: number;
  financingType: FinancingType;
  customerName: string;
  customerPhone: string;
  notes?: string;
}

/**
 * Creates a price offer on a listing.
 * Returns the new offer ID on success, null on failure or dev bypass.
 */
export async function createOffer(input: CreateOfferInput): Promise<string | null> {
  if (DEV_SKIP_AUTH) return null;
  if (!isUUID(input.agentId) || !isUUID(input.userId) || !isUUID(input.listingId)) return null;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("offers")
    .insert({
      listing_id:      input.listingId,
      user_id:         input.userId,
      agent_id:        input.agentId,
      offer_amount_omr: input.offerAmountOmr,
      asking_price_omr: input.askingPriceOmr,
      financing_type:  input.financingType,
      status:          "submitted",
      customer_name:   input.customerName,
      customer_phone:  input.customerPhone,
      notes:           input.notes ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[crm] createOffer error:", error.message);
    return null;
  }
  return data.id;
}

/**
 * Fetches all offers where the current user is the listing agent.
 */
export async function fetchAgentOffers(agentId: string): Promise<CrmOffer[]> {
  if (DEV_SKIP_AUTH || !isUUID(agentId)) return [];

  const supabase = createClient();
  const { data, error } = await supabase
    .from("offers")
    .select("*, listings(title_ar)")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[crm] fetchAgentOffers error:", error.message);
    return [];
  }
  return (data ?? []).map((r) => mapOffer(r as unknown as DbOfferRow));
}

/**
 * Updates the status of an offer the agent owns.
 */
export async function updateOfferStatus(
  offerId: string,
  status: OfferStatus
): Promise<void> {
  if (DEV_SKIP_AUTH) return;

  const supabase = createClient();
  const { error } = await supabase
    .from("offers")
    .update({ status })
    .eq("id", offerId);

  if (error) console.error("[crm] updateOfferStatus error:", error.message);
}
