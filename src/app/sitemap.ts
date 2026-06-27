// ── Dynamic Sitemap ───────────────────────────────────────────────────────────
// Lists only real, public, indexable routes. Listing entries come from the live
// Supabase inventory (status=active AND review_status=approved) — never mock —
// so crawlers never see /listing/lst-* URLs that 404, and real listings are
// discoverable (FP16). Private routes and still-mock/demo surfaces (agents,
// agencies, area guides) are intentionally excluded.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { APP_CONFIG } from "@/config/app";
import { OMAN_GOVERNORATES } from "@/lib/constants/oman-locations";

// Revalidate hourly so newly-approved listings appear without a redeploy.
export const revalidate = 3600;

const BASE_URL = APP_CONFIG.url;

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  lastModified: Date = new Date()
): MetadataRoute.Sitemap[number] {
  return { url: `${BASE_URL}${path}`, lastModified, changeFrequency, priority };
}

/** Real approved public listings, read with the anon key (no cookies → build-safe). */
async function approvedListingEntries(): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url.startsWith("https://") || !key) return [];
  try {
    const sb = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await sb
      .from("listings")
      .select("id, updated_at")
      .eq("status", "active")
      .eq("review_status", "approved")
      .order("updated_at", { ascending: false })
      .limit(5000);
    if (error || !data) return [];
    return data.map((r) =>
      entry(
        `/listing/${r.id}`,
        0.8,
        "daily",
        r.updated_at ? new Date(r.updated_at) : new Date()
      )
    );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static public pages (verified to return 200). /agents, /agencies and /areas
  // are excluded while they are still mock/demo; /agent-verification-policy is
  // excluded because it currently redirects (307), not a public 200.
  const staticPages: MetadataRoute.Sitemap = [
    entry("/", 1.0, "daily"),
    entry("/search", 0.9, "hourly"),
    entry("/map", 0.8, "daily"),
    entry("/market", 0.8, "weekly"),
    entry("/pricing", 0.7, "weekly"),
    entry("/tools", 0.7, "weekly"),
    entry("/tools/mortgage-calculator", 0.6, "monthly"),
    entry("/tools/rental-yield", 0.6, "monthly"),
    entry("/tools/roi-calculator", 0.6, "monthly"),
    entry("/tools/price-per-sqm", 0.6, "monthly"),
    entry("/assistant", 0.6, "weekly"),
    entry("/about", 0.5, "monthly"),
    entry("/privacy", 0.4, "monthly"),
    entry("/terms", 0.4, "monthly"),
    entry("/listing-policy", 0.4, "monthly"),
  ];

  // Real listing pages from the live DB (never mock).
  const listingPages = await approvedListingEntries();

  // Market pages — derived from real Oman locations.
  const governoratePages: MetadataRoute.Sitemap = OMAN_GOVERNORATES.map((g) =>
    entry(`/market/${g.id}`, 0.7, "weekly")
  );
  const wilayatPages: MetadataRoute.Sitemap = OMAN_GOVERNORATES.flatMap((g) =>
    g.wilayats.map((w) => entry(`/market/${g.id}/${w.id}`, 0.6, "weekly"))
  );

  return [...staticPages, ...listingPages, ...governoratePages, ...wilayatPages];
}
