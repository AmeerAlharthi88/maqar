// Server-side agent profile fetching.
// Do NOT add "use client" — this file is imported by Server Components only.

import { createClient } from "./server";
import type { Agent } from "@/types/agent";

// ── DB row shape returned by the joined query ─────────────────────────────────
interface ProfileWithAgency {
  id: string;
  name_ar: string;
  name_en: string | null;
  phone: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  license_number: string | null;
  specialization_ar: string[] | null;
  service_areas_ar: string[] | null;
  created_at: string;
  agencies: {
    name_ar: string;
    name_en: string | null;
    logo_url: string | null;
  } | null;
}

// ── Mapper ────────────────────────────────────────────────────────────────────
function mapProfileToAgent(p: ProfileWithAgency): Agent {
  return {
    id:              p.id,
    nameAr:          p.name_ar,
    nameEn:          p.name_en ?? undefined,
    phone:           p.phone ?? "",
    whatsapp:        p.whatsapp ?? p.phone ?? "",
    avatar:          p.avatar_url ?? undefined,
    agency:          p.agencies
      ? {
          nameAr: p.agencies.name_ar,
          nameEn: p.agencies.name_en ?? undefined,
          logo:   p.agencies.logo_url ?? undefined,
        }
      : undefined,
    licenseNumber:   p.license_number ?? undefined,
    isVerified:      p.is_verified,
    specializationAr: p.specialization_ar ?? [],
    areasAr:          p.service_areas_ar ?? [],
    // Stats are not stored on the profile row; set to neutral defaults.
    // A future phase can join listings/reviews tables to compute these.
    stats: {
      totalListings:   0,
      activeListings:  0,
      soldListings:    0,
      avgResponseTime: "—",
      rating:          0,
      reviewCount:     0,
    },
    joinedAt: p.created_at,
  };
}

// ── Shared select string ──────────────────────────────────────────────────────
const AGENT_SELECT = `
  id,
  name_ar,
  phone,
  whatsapp,
  avatar_url,
  is_verified,
  license_number,
  specialization_ar,
  service_areas_ar,
  created_at,
  agencies ( name_ar, name_en, logo_url )
` as const;

// ── getAgentProfiles ──────────────────────────────────────────────────────────
/** Returns all active agent profiles joined with their agency.
 *  Falls back to an empty array on error (caller supplies mock fallback).
 *  Filters: role = 'agent', account_status = 'active'. */
export async function getAgentProfiles(): Promise<Agent[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(AGENT_SELECT)
      .eq("role", "agent")
      .eq("account_status", "active")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return [];
    return (data as unknown as ProfileWithAgency[]).map(mapProfileToAgent);
  } catch {
    return [];
  }
}

// ── getAgentProfile ───────────────────────────────────────────────────────────
/** Looks up a single agent profile by UUID.
 *  Returns null if the ID is not a valid UUID or if no matching row is found.
 *  The caller should fall back to mock data when null is returned. */
export async function getAgentProfile(id: string): Promise<Agent | null> {
  // Only attempt DB lookup for valid UUID strings
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(id)) return null;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(AGENT_SELECT)
      .eq("id", id)
      .eq("role", "agent")
      .single();

    if (error || !data) return null;
    return mapProfileToAgent(data as unknown as ProfileWithAgency);
  } catch {
    return null;
  }
}
