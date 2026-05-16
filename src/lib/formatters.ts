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

  let formatted: string;
  if (compact && amount >= 1_000_000) {
    formatted = `${(amount / 1_000_000).toFixed(1)} م`;
  } else if (compact && amount >= 1_000) {
    formatted = `${(amount / 1_000).toFixed(0)} ك`;
  } else {
    formatted = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  if (arabic) {
    const digits = toArabicNumerals(formatted.replace(/,/g, "،"));
    return `${digits} ر.ع.`;
  }
  return `${formatted} OMR`;
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
