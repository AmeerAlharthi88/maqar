/** Remove diacritics (tashkeel) from Arabic text */
export function removeDiacritics(text: string): string {
  return text.replace(/[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۤۧۨ-ۭ]/g, "");
}

/** Normalize Arabic letters (e.g. alef forms, ta marbuta) */
export function normalizeArabic(text: string): string {
  return text
    .replace(/[أإآا]/g, "ا")
    .replace(/[ةه]/g, "ه")
    .replace(/[يى]/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي");
}

/** Sanitize user input for Arabic text fields */
export function sanitizeArabicInput(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[<>'"]/g, "");
}

/** Check if string contains Arabic characters */
export function containsArabic(text: string): boolean {
  return /[؀-ۿ]/.test(text);
}

/** Return "rtl" if text starts with Arabic, else "ltr" */
export function detectTextDir(text: string): "rtl" | "ltr" {
  return containsArabic(text.trim()) ? "rtl" : "ltr";
}
