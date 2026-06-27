export const APP_CONFIG = {
  name: "Maqar",
  nameAr: "مقر",
  taglineAr: "مقرك يبدأ هنا",
  version: "0.4.0",
  // Sanitised: strip a stray BOM/zero-width prefix and trailing slash that an
  // env value can carry, so robots.txt Host/Sitemap and OG/canonical URLs are
  // clean UTF-8 (FP16).
  url: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
    .replace(/[\uFEFF\u200B\u200E\u200F]/g, "")
    .trim()
    .replace(/\/+$/, ""),
  supportPhone: "+96824000000",
  supportEmail: "support@maqar.om",
  defaultLocale: "ar" as const,
  supportedLocales: ["ar", "en"] as const,
  defaultDirection: "rtl" as const,
  country: "OM",
  currency: "OMR",
  timezone: "Asia/Muscat",
  brand: {
    primary:    "#0A3C36",  // Deep Emerald Teal
    secondary:  "#E5BA73",  // Champagne Gold
    accent:     "#1A5C54",  // Mid Emerald (hover / active tints)
    background: "#F8F9FA",  // Ice White
    charcoal:   "#102A43",  // Midnight Dark Blue
    muted:      "#627D98",  // Muted Slate
  },
} as const;

export type SupportedLocale = (typeof APP_CONFIG.supportedLocales)[number];
