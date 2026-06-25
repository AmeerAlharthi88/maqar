// ── Admin display helpers ─────────────────────────────────────────────────────
// Small, dependency-free helpers shared by the admin UI so every screen stays
// fully bilingual and never renders raw/corrupted field values to an admin.

/** Pick the locale-appropriate label. `isAr` comes from the locale store. */
export function bi(isAr: boolean, ar: string, en: string): string {
  return isAr ? ar : en;
}

// Characters that, on their own, signal a missing/garbled value rather than real
// content: ASCII "?", the Arabic question mark "؟" (U+061F), the Unicode
// replacement char "�" (U+FFFD), and surrounding punctuation/whitespace noise.
const CORRUPT_ONLY = /^[\s?؟�.،,_\-–—]+$/;

/**
 * Clean a data-derived metadata field for display. Returns a tidy localized
 * fallback ("غير محدد" / "Not specified") when the value is missing, empty, or
 * corrupted (e.g. shows as "?????" or contains the Unicode replacement char) so
 * an admin never sees raw "??????". This is a DISPLAY-LAYER guard only — it does
 * not mutate or clean the underlying data.
 */
export function displayMeta(
  value: string | null | undefined,
  isAr: boolean
): string {
  const fallback = isAr ? "غير محدد" : "Not specified";
  if (value == null) return fallback;
  const v = String(value).trim();
  if (v === "") return fallback;
  if (v.includes("�")) return fallback; // mojibake / replacement char
  if (CORRUPT_ONLY.test(v)) return fallback; // only "?", "؟", punctuation, spaces
  return v;
}
