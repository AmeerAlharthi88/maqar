// ── Robots.txt — Phase 16 ─────────────────────────────────────────────────────
// Allow all public pages.
// Disallow private/auth/dashboard/API routes.
// ─────────────────────────────────────────────────────────────────────────────

import type { MetadataRoute } from "next";
import { APP_CONFIG } from "@/config/app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/account/",
          "/agent/",
          "/agency/",
          "/admin/",
          "/auth/",
          "/api/",
          "/add-listing/",
          "/my-listings/",
          "/add-listing",
          "/my-listings",
        ],
      },
    ],
    sitemap: `${APP_CONFIG.url}/sitemap.xml`,
    host: APP_CONFIG.url,
  };
}
