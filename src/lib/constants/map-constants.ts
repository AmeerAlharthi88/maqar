import type { MapCenter } from "@/store/map.store";
import type { Locale } from "@/i18n/types";

// ── Default centers ────────────────────────────────────────────────────────────

export const OMAN_CENTER: MapCenter = { lat: 21.4735, lng: 55.9754 };
export const MUSCAT_CENTER: MapCenter = { lat: 23.588, lng: 58.3829 };

// ── Zoom levels ────────────────────────────────────────────────────────────────

export const OMAN_DEFAULT_ZOOM = 6;
export const MUSCAT_DEFAULT_ZOOM = 12;
export const MAP_MIN_ZOOM = 5;
export const MAP_MAX_ZOOM = 18;

// ── Oman bounding box [SW lat/lng, NE lat/lng] ─────────────────────────────────
// Covers the main territory including Musandam and Dhofar

export const OMAN_BOUNDS: [[number, number], [number, number]] = [
  [16.0, 51.0],
  [26.5, 60.5],
];

// ── Tile layer ─────────────────────────────────────────────────────────────────

export const TILE_URL =
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

// ── Layer labels ──────────────────────────────────────────────────────────────

export interface LayerLabelI18n { ar: string; en: string; }

export const LAYER_LABELS_I18N: Record<string, LayerLabelI18n> = {
  schools:      { ar: "المدارس",              en: "Schools"          },
  mosques:      { ar: "المساجد",              en: "Mosques"          },
  hospitals:    { ar: "المستشفيات",           en: "Hospitals"        },
  beaches:      { ar: "الشواطئ",              en: "Beaches"          },
  malls:        { ar: "المجمعات التجارية",   en: "Shopping malls"   },
  fuelStations: { ar: "محطات الوقود",        en: "Fuel stations"    },
  wadiRisk:     { ar: "مناطق الأودية",       en: "Wadi risk zones"  },
};

/** Return the localised label for a map layer */
export function getLayerLabel(key: string, locale: Locale): string {
  return LAYER_LABELS_I18N[key]?.[locale] ?? key;
}

/** @deprecated Use LAYER_LABELS_I18N + getLayerLabel() */
export const LAYER_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(LAYER_LABELS_I18N).map(([k, v]) => [k, v.ar])
);

export const LAYER_ICONS: Record<string, string> = {
  schools:      "M12 3L2 12h3v9h14v-9h3L12 3z",
  mosques:      "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  hospitals:    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z",
  beaches:      "M12 3L2 12h3v9h14v-9h3L12 3z",
  malls:        "M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1z",
  fuelStations: "M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6C4.9 3 4 3.9 4 5v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM18 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM8 18v-4.5H6V18H4V5h10v13H8z",
  wadiRisk:     "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
};
