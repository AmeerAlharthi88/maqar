// ── Dynamic Sitemap — Phase 16 ────────────────────────────────────────────────
// Covers all public, indexable routes.
// Private routes (/account/*, /agent/*, /agency/*, /admin/*, /auth/*, /api/*)
// are intentionally excluded.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/config/app";
import { MOCK_AGENTS } from "@/mock/agents";
import { MOCK_AGENCIES } from "@/mock/agencies";
import { MOCK_LISTINGS } from "@/mock/listings";
import { AREA_GUIDES } from "@/mock/areas";
import { OMAN_GOVERNORATES } from "@/lib/constants/oman-locations";

const BASE_URL = APP_CONFIG.url;

// Helper to build a sitemap entry
function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Static public pages ───────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    entry("/", 1.0, "daily"),
    entry("/search", 0.9, "hourly"),
    entry("/map", 0.8, "daily"),
    entry("/agents", 0.8, "daily"),
    entry("/agencies", 0.8, "daily"),
    entry("/areas", 0.8, "weekly"),
    entry("/market", 0.8, "weekly"),
    entry("/pricing", 0.7, "weekly"),
    entry("/tools", 0.7, "weekly"),
    entry("/tools/mortgage-calculator", 0.6, "monthly"),
    entry("/tools/rental-yield", 0.6, "monthly"),
    entry("/tools/roi-calculator", 0.6, "monthly"),
    entry("/tools/price-per-sqm", 0.6, "monthly"),
    entry("/about", 0.5, "monthly"),
    entry("/privacy", 0.4, "monthly"),
    entry("/terms", 0.4, "monthly"),
    entry("/listing-policy", 0.4, "monthly"),
    entry("/agent-verification-policy", 0.5, "monthly"),
    entry("/assistant", 0.6, "weekly"),
  ];

  // ── Agent profile pages ───────────────────────────────────────────────────
  const agentPages: MetadataRoute.Sitemap = MOCK_AGENTS.map((agent) =>
    entry(`/agents/${agent.id}`, 0.7, "weekly")
  );

  // ── Agency profile pages ──────────────────────────────────────────────────
  const agencyPages: MetadataRoute.Sitemap = MOCK_AGENCIES.map((agency) =>
    entry(`/agencies/${agency.id}`, 0.7, "weekly")
  );

  // ── Listing detail pages ─────────────────────────────────────────────────
  const listingPages: MetadataRoute.Sitemap = MOCK_LISTINGS
    .filter((l) => l.status === "active")
    .map((l) => entry(`/listing/${l.id}`, 0.8, "daily"));

  // ── Area guide pages ─────────────────────────────────────────────────────
  const areaPages: MetadataRoute.Sitemap = AREA_GUIDES.map((area) =>
    entry(`/areas/${area.slug}`, 0.7, "weekly")
  );

  // ── Market pages — derived from oman-locations ────────────────────────────
  const governoratePages: MetadataRoute.Sitemap = OMAN_GOVERNORATES.map((g) =>
    entry(`/market/${g.id}`, 0.7, "weekly")
  );

  const wilayatPages: MetadataRoute.Sitemap = OMAN_GOVERNORATES.flatMap((g) =>
    g.wilayats.map((w) => entry(`/market/${g.id}/${w.id}`, 0.6, "weekly"))
  );

  return [
    ...staticPages,
    ...agentPages,
    ...agencyPages,
    ...listingPages,
    ...areaPages,
    ...governoratePages,
    ...wilayatPages,
  ];
}
