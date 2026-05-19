import type { PropertyType } from "@/types/listing";

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

export const FURNISHING_LABELS: Record<string, string> = {
  furnished:      "مفروش",
  semi_furnished: "نصف مفروش",
  unfurnished:    "غير مفروش",
};

export const PURPOSE_LABELS: Record<string, string> = {
  sale: "للبيع",
  rent: "للإيجار",
};

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
