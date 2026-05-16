export const APP_CONFIG = {
  name: "Maqar",
  nameAr: "مقر",
  taglineAr: "مقرك يبدأ هنا",
  version: "0.4.0",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supportPhone: "+96824000000",
  supportEmail: "support@maqar.om",
  defaultLocale: "ar" as const,
  supportedLocales: ["ar", "en"] as const,
  defaultDirection: "rtl" as const,
  country: "OM",
  currency: "OMR",
  timezone: "Asia/Muscat",
  brand: {
    primary: "#C65D3B",
    secondary: "#D4A373",
    accent: "#5B8C5A",
    background: "#FAF7F2",
    charcoal: "#1E1E1E",
  },
} as const;

export type SupportedLocale = (typeof APP_CONFIG.supportedLocales)[number];
