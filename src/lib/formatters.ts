import type { Locale } from "@/i18n/types";

const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicNumerals(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
}

export function toWesternNumerals(s: string): string {
  return s.replace(/[٠-٩]/g, (d) => String(arabicNumerals.indexOf(d)));
}

export function formatOMR(
  amount: number,
  opts: { arabic?: boolean; compact?: boolean } = {}
): string {
  const { arabic = true, compact = false } = opts;

  if (!arabic) {
    if (compact && amount >= 1_000_000) {
      const val = (amount / 1_000_000).toFixed(1).replace(/\.0$/, "");
      return `${val}M OMR`;
    }
    if (compact && amount >= 1_000) {
      const val = Math.round(amount / 1_000);
      return `${val}K OMR`;
    }
    const formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `${formatted} OMR`;
  }

  // Arabic compact display — no Latin abbreviations ever
  if (compact && amount >= 1_000_000) {
    const val = (amount / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${toArabicNumerals(val)} مليون ر.ع`;
  }
  if (compact && amount >= 1_000) {
    const val = Math.round(amount / 1_000).toString();
    return `${toArabicNumerals(val)} ألف ر.ع`;
  }

  // Full number
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  const digits = toArabicNumerals(formatted.replace(/,/g, "،"));
  return `${digits} ر.ع`;
}

export function formatArea(sqm: number, arabic = true): string {
  const formatted = new Intl.NumberFormat("en-US").format(sqm);
  const digits = arabic ? toArabicNumerals(formatted) : formatted;
  return arabic ? `${digits} م²` : `${formatted} sqm`;
}

export function formatDate(iso: string, arabic = true): string {
  const date = new Date(iso);
  const locale = arabic ? "ar-OM" : "en-OM";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatRelativeDate(iso: string): string {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "اليوم";
  if (diffDays === 1) return "أمس";
  if (diffDays < 7) return `منذ ${toArabicNumerals(diffDays)} أيام`;
  if (diffDays < 30) return `منذ ${toArabicNumerals(Math.floor(diffDays / 7))} أسابيع`;
  if (diffDays < 365) return `منذ ${toArabicNumerals(Math.floor(diffDays / 30))} أشهر`;
  return `منذ ${toArabicNumerals(Math.floor(diffDays / 365))} سنوات`;
}

export function formatPhoneDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("968") && cleaned.length === 11) {
    return `+968 ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

// ── Locale-aware formatting API ───────────────────────────────────────────────
// These functions replace the `arabic: boolean` parameter pattern with a
// `locale: Locale` parameter for clarity and consistency.

/**
 * Format a number using locale-aware numeral system.
 * Arabic → Arabic-Indic digits (٣٤٥), English → Western digits.
 */
export function formatNumber(num: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat("en-US").format(num);
  return locale === "ar" ? toArabicNumerals(formatted) : formatted;
}

/**
 * Format an OMR currency amount for the given locale.
 * Supports compact mode (e.g. "٨٥ ألف ر.ع" / "85K OMR").
 */
export function formatCurrency(
  amount: number,
  locale: Locale,
  opts: { compact?: boolean } = {}
): string {
  return formatOMR(amount, { arabic: locale === "ar", compact: opts.compact });
}

/**
 * Format a square-meter area value for the given locale.
 */
export function formatAreaLocale(sqm: number, locale: Locale): string {
  return formatArea(sqm, locale === "ar");
}

/**
 * Format an ISO date string for the given locale.
 */
export function formatDateLocale(iso: string, locale: Locale): string {
  return formatDate(iso, locale === "ar");
}

/**
 * Relative date string (e.g. "٣ أيام" / "3 days ago") for the given locale.
 * Uses Intl.RelativeTimeFormat for English; Arabic keeps custom strings.
 */
export function formatRelativeDateLocale(iso: string, locale: Locale): string {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (locale === "en") {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    if (diffDays === 0) return rtf.format(0, "day");
    if (diffDays < 7) return rtf.format(-diffDays, "day");
    if (diffDays < 30) return rtf.format(-Math.floor(diffDays / 7), "week");
    if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), "month");
    return rtf.format(-Math.floor(diffDays / 365), "year");
  }

  // Arabic
  if (diffDays === 0) return "اليوم";
  if (diffDays === 1) return "أمس";
  if (diffDays < 7) return `منذ ${toArabicNumerals(diffDays)} أيام`;
  if (diffDays < 30) return `منذ ${toArabicNumerals(Math.floor(diffDays / 7))} أسابيع`;
  if (diffDays < 365) return `منذ ${toArabicNumerals(Math.floor(diffDays / 30))} أشهر`;
  return `منذ ${toArabicNumerals(Math.floor(diffDays / 365))} سنوات`;
}
