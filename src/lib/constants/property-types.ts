import type { PropertyType } from "@/types/listing";
import type { Locale } from "@/i18n/types";

export interface PropertyTypeConfig {
  value: PropertyType;
  labelAr: string;
  labelEn: string;
  icon: string; // phosphor icon name
}

export const PROPERTY_TYPES: PropertyTypeConfig[] = [
  { value: "apartment",      labelAr: "شقة",               labelEn: "Apartment",      icon: "Buildings"    },
  { value: "villa",          labelAr: "فيلا",               labelEn: "Villa",          icon: "House"        },
  { value: "duplex",         labelAr: "دوبلكس",             labelEn: "Duplex",         icon: "HouseLine"    },
  { value: "townhouse",      labelAr: "تاون هاوس",          labelEn: "Townhouse",      icon: "HouseSimple"  },
  { value: "land",           labelAr: "أرض",                labelEn: "Land",           icon: "MapTrifold"   },
  { value: "commercial",     labelAr: "محل تجاري",          labelEn: "Commercial",     icon: "Storefront"   },
  { value: "office",         labelAr: "مكتب",               labelEn: "Office",         icon: "Briefcase"    },
  { value: "warehouse",      labelAr: "مستودع",             labelEn: "Warehouse",      icon: "Package"      },
  { value: "arabic_house",   labelAr: "بيت عربي",           labelEn: "Arabic House",   icon: "House"        },
  { value: "farm",           labelAr: "مزرعة",              labelEn: "Farm",           icon: "Tree"         },
  { value: "chalet",         labelAr: "شاليه",              labelEn: "Chalet",         icon: "Umbrella"     },
  { value: "building",       labelAr: "بناية",              labelEn: "Building",       icon: "Building"     },
  { value: "hotel_apartment",labelAr: "شقة فندقية",         labelEn: "Hotel Apartment",icon: "Buildings"    },
];

export const PROPERTY_TYPE_MAP: Record<PropertyType, PropertyTypeConfig> =
  Object.fromEntries(PROPERTY_TYPES.map((t) => [t.value, t])) as Record<
    PropertyType,
    PropertyTypeConfig
  >;

/** Return the localised display name for a property type */
export function getPropertyTypeName(type: PropertyType, locale: Locale): string {
  const config = PROPERTY_TYPE_MAP[type];
  if (!config) return type;
  return locale === "ar" ? config.labelAr : config.labelEn;
}

// ── Bilingual furnishing labels ───────────────────────────────────────────────

export interface BilingualLabel {
  ar: string;
  en: string;
}

export const FURNISHING_LABELS_I18N: Record<string, BilingualLabel> = {
  furnished:      { ar: "مفروش",       en: "Furnished"      },
  semi_furnished: { ar: "نصف مفروش",   en: "Semi-furnished" },
  unfurnished:    { ar: "غير مفروش",   en: "Unfurnished"    },
};

/** @deprecated Use FURNISHING_LABELS_I18N + getFurnishingLabel() */
export const FURNISHING_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(FURNISHING_LABELS_I18N).map(([k, v]) => [k, v.ar])
);

export function getFurnishingLabel(value: string, locale: Locale): string {
  return FURNISHING_LABELS_I18N[value]?.[locale] ?? value;
}

// ── Bilingual purpose labels ──────────────────────────────────────────────────

export const PURPOSE_LABELS_I18N: Record<string, BilingualLabel> = {
  sale:       { ar: "للبيع",        en: "For sale"       },
  rent:       { ar: "للإيجار",      en: "For rent"       },
  investment: { ar: "للاستثمار",    en: "Investment"     },
};

/** @deprecated Use PURPOSE_LABELS_I18N + getPurposeLabel() */
export const PURPOSE_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(PURPOSE_LABELS_I18N).map(([k, v]) => [k, v.ar])
);

export function getPurposeLabel(value: string, locale: Locale): string {
  return PURPOSE_LABELS_I18N[value]?.[locale] ?? value;
}

export const COMMON_AMENITIES = [
  "مسبح",
  "موقف سيارات",
  "حديقة",
  "غرفة خادمة",
  "شرفة",
  "حارس أمن",
  "مصعد",
  "صالة رياضية",
  "مكيفات مركزية",
  "تشطيب فاخر",
  "إطلالة بحرية",
  "إطلالة جبلية",
  "قرب المسجد",
  "قرب المدرسة",
  "قرب المول",
  "مطبخ راقٍ",
  "جاكوزي",
  "غرفة سينما",
  "نظام ذكي",
  "ألواح شمسية",
];
