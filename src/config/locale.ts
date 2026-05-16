export const LOCALE_CONFIG = {
  defaultLocale: "ar",
  defaultDir: "rtl",
  locales: {
    ar: { label: "العربية", dir: "rtl", flag: "🇴🇲" },
    en: { label: "English", dir: "ltr", flag: "🇬🇧" },
  },
  numberLocale: "ar-OM",
  dateLocale: "ar-OM",
  currency: "OMR",
  currencySymbolAr: "ر.ع.",
} as const;

export type LocaleKey = keyof typeof LOCALE_CONFIG.locales;
