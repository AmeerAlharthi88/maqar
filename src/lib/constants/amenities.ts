// ── Stable amenity keys ────────────────────────────────────────────────────────
// Filters must never depend on display text (Arabic/English) or exact spelling.
// Each amenity has a stable internal key; display labels are kept separate, and a
// normalised reverse-lookup maps stored amenity strings (which today are Arabic
// display labels, with slight hamza/spacing variation) back to those keys.
// This lets the same filter return identical results in Arabic and English
// regardless of how the amenity text is stored (FP13 #2).

import type { Locale } from "@/types";

export type AmenityKey =
  | "sea_view"
  | "mountain_view"
  | "majlis"
  | "maid_room"
  | "driver_room"
  | "parking"
  | "yard"
  | "pool"
  | "gym"
  | "elevator"
  | "security"
  | "central_ac"
  | "balcony"
  | "store_room"
  | "private_entrance";

export const AMENITY_LABELS: Record<AmenityKey, { ar: string; en: string }> = {
  sea_view:         { ar: "إطلالة بحرية",  en: "Sea view" },
  mountain_view:    { ar: "إطلالة جبلية",  en: "Mountain view" },
  majlis:           { ar: "مجلس",          en: "Majlis" },
  maid_room:        { ar: "غرفة خادمة",    en: "Maid's room" },
  driver_room:      { ar: "غرفة سائق",     en: "Driver's room" },
  parking:          { ar: "موقف سيارات",   en: "Parking" },
  yard:             { ar: "حديقة",         en: "Garden" },
  pool:             { ar: "مسبح",          en: "Pool" },
  gym:              { ar: "صالة رياضية",   en: "Gym" },
  elevator:         { ar: "مصعد",          en: "Elevator" },
  security:         { ar: "حارس أمن",      en: "Security" },
  central_ac:       { ar: "تكييف مركزي",   en: "Central A/C" },
  balcony:          { ar: "شرفة",          en: "Balcony" },
  store_room:       { ar: "غرفة تخزين",    en: "Storage room" },
  private_entrance: { ar: "مدخل خاص",      en: "Private entrance" },
};

export function amenityLabel(key: AmenityKey, locale: Locale): string {
  const l = AMENITY_LABELS[key];
  return locale === "ar" ? l.ar : l.en;
}

/**
 * Normalise an amenity string so spelling/diacritic/spacing differences don't
 * break matching: strip Arabic diacritics, unify alef/hamza/ya/ta-marbuta
 * variants, collapse whitespace, lowercase (for the English side).
 */
function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[ً-ٰٟ]/g, "") // tashkeel / diacritics
    .replace(/[آأإٱ]/g, "ا") // آأإٱ → ا
    .replace(/ى/g, "ي") // ى → ي
    .replace(/ة/g, "ه") // ة → ه
    .replace(/\s+/g, " ");
}

// Reverse map: normalised display text (ar + en) → stable key, plus common aliases.
const TEXT_TO_KEY: Record<string, AmenityKey> = {};
for (const [key, { ar, en }] of Object.entries(AMENITY_LABELS) as [AmenityKey, { ar: string; en: string }][]) {
  TEXT_TO_KEY[normalize(ar)] = key;
  TEXT_TO_KEY[normalize(en)] = key;
}
// Extra aliases / spelling variants seen in stored data.
const EXTRA_ALIASES: [string, AmenityKey][] = [
  ["مسبح خاص", "pool"],
  ["حديقة خاصة", "yard"],
  ["جراج", "parking"],
  ["كراج", "parking"],
  ["موقف", "parking"],
  ["مصعد خاص", "elevator"],
  ["حارس", "security"],
  ["أمن", "security"],
];
for (const [alias, key] of EXTRA_ALIASES) {
  TEXT_TO_KEY[normalize(alias)] = key;
}

/** Map a single stored amenity string to its stable key, or null if unknown. */
export function amenityTextToKey(text: string): AmenityKey | null {
  return TEXT_TO_KEY[normalize(text)] ?? null;
}

/** Derive the set of stable amenity keys a listing has, from its amenity strings. */
export function listingAmenityKeys(amenities: string[] | undefined | null): Set<AmenityKey> {
  const set = new Set<AmenityKey>();
  for (const a of amenities ?? []) {
    const k = amenityTextToKey(a);
    if (k) set.add(k);
  }
  return set;
}
