// ── Per-Property-Type Field Visibility Config ──────────────────────────────────
// This is the canonical source of truth for what each property type shows.
// 'required' — must be filled before Step 3 can advance
// 'optional'  — shown but not blocking
// 'hidden'    — not rendered at all
//
// Fields not listed for a type are implicitly 'hidden'.
// ─────────────────────────────────────────────────────────────────────────────

import type { PropertyType } from "@/types/listing";
import type { Locale } from "@/i18n/types";

export type FieldVisibility = "required" | "optional" | "hidden";

// All field names that can appear in Step 3
export type FieldName =
  // ── Core specs ────────────────────────────────────────────────────────────
  | "bedrooms"
  | "bathrooms"
  | "builtUpArea"         // مساحة البناء
  | "landArea"            // مساحة الأرض
  | "parkingSpots"
  | "furnishing"
  | "propertyAge"
  // ── Floor fields ──────────────────────────────────────────────────────────
  | "floorNumber"         // which floor is this unit on
  | "totalFloorsInBuilding" // total floors in the building (apartment context)
  | "villaFloorCount"     // number of floors in the villa/building itself
  // ── Villa / residential features ──────────────────────────────────────────
  | "majlisCount"
  | "maidRoom"
  | "driverRoom"
  | "privatePool"
  | "yard"
  | "balconyCount"
  | "centralAc"
  | "kitchenType"         // 'internal' | 'external'
  | "storeRoom"
  // ── Apartment features ────────────────────────────────────────────────────
  | "elevator"
  | "security"
  | "sharedPool"
  | "sharedGym"
  | "balcony"             // boolean (apartment); balconyCount is for villa
  // ── Views ─────────────────────────────────────────────────────────────────
  | "seaView"
  | "mountainView"
  // ── Land fields ───────────────────────────────────────────────────────────
  | "landUse"             // 'residential'|'commercial'|'agricultural'|'industrial'|'mixed'
  | "roadAccess"          // 'paved' | 'unpaved'
  | "cornerPlot"
  | "electricityAvailable"
  | "waterAvailable"
  | "sewageAvailable"
  | "boundaryWall"
  | "plotNumber"
  | "nearbyMosque"
  | "nearbySchool"
  // ── Farm fields ───────────────────────────────────────────────────────────
  | "waterSource"         // 'well' | 'government' | 'none'
  | "farmHouseExists"
  | "numberOfWells"
  | "palmTreesCount"
  | "otherTrees"
  | "pavedRoad"
  | "agriculturalLicense"
  // ── Commercial shop ───────────────────────────────────────────────────────
  | "shopFrontage"
  | "commercialLicense"
  | "displayWindow"
  | "mainRoadFacing"
  // ── Office ────────────────────────────────────────────────────────────────
  | "meetingRooms"
  | "receptionArea"
  | "internetReady"
  // ── Warehouse ─────────────────────────────────────────────────────────────
  | "ceilingHeight"
  | "loadingDock"
  | "truckAccess"
  | "powerCapacity"
  | "fireSafety"
  | "fenced"
  | "crane"
  | "officeSpace"
  // ── Building ──────────────────────────────────────────────────────────────
  | "totalUnits"
  | "commercialGroundFloor"
  | "currentRentalIncome"
  // ── Chalet ────────────────────────────────────────────────────────────────
  | "barbecue"
  | "sharedBeachAccess";

export type FieldConfig = Partial<Record<FieldName, FieldVisibility>>;

// ── Per-type field configs ────────────────────────────────────────────────────

const VILLA_CONFIG: FieldConfig = {
  bedrooms:           "required",
  bathrooms:          "required",
  builtUpArea:        "required",
  landArea:           "required",
  parkingSpots:       "optional",
  furnishing:         "optional",
  propertyAge:        "required",
  villaFloorCount:    "optional",
  majlisCount:        "optional",
  maidRoom:           "optional",
  driverRoom:         "optional",
  privatePool:        "optional",
  yard:               "optional",
  balconyCount:       "optional",
  centralAc:          "optional",
  kitchenType:        "optional",
  storeRoom:          "optional",
  seaView:            "optional",
  mountainView:       "optional",
};

const APARTMENT_CONFIG: FieldConfig = {
  bedrooms:              "required",
  bathrooms:             "required",
  builtUpArea:           "required",
  floorNumber:           "required",
  totalFloorsInBuilding: "required",
  parkingSpots:          "optional",
  furnishing:            "optional",
  propertyAge:           "optional",
  elevator:              "optional",
  security:              "optional",
  sharedPool:            "optional",
  sharedGym:             "optional",
  balcony:               "optional",
  centralAc:             "optional",
  maidRoom:              "optional",
  seaView:               "optional",
  mountainView:          "optional",
};

const LAND_CONFIG: FieldConfig = {
  landArea:            "required",
  landUse:             "required",
  roadAccess:          "optional",
  cornerPlot:          "optional",
  electricityAvailable:"optional",
  waterAvailable:      "optional",
  sewageAvailable:     "optional",
  boundaryWall:        "optional",
  plotNumber:          "optional",
  nearbyMosque:        "optional",
  nearbySchool:        "optional",
};

const FARM_CONFIG: FieldConfig = {
  landArea:            "required",
  waterSource:         "required",
  builtUpArea:         "optional",   // farmhouse area, shown when farmHouseExists=true
  farmHouseExists:     "optional",
  numberOfWells:       "optional",
  palmTreesCount:      "optional",
  otherTrees:          "optional",
  electricityAvailable:"optional",
  pavedRoad:           "optional",
  boundaryWall:        "optional",
  mountainView:        "optional",
  agriculturalLicense: "optional",
};

const COMMERCIAL_CONFIG: FieldConfig = {
  builtUpArea:         "required",
  floorNumber:         "required",
  shopFrontage:        "optional",
  parkingSpots:        "optional",
  commercialLicense:   "optional",
  displayWindow:       "optional",
  mainRoadFacing:      "optional",
  storeRoom:           "optional",
};

const OFFICE_CONFIG: FieldConfig = {
  builtUpArea:         "required",
  floorNumber:         "required",
  parkingSpots:        "optional",
  furnishing:          "optional",
  meetingRooms:        "optional",
  receptionArea:       "optional",
  internetReady:       "optional",
  security:            "optional",
  elevator:            "optional",
};

const WAREHOUSE_CONFIG: FieldConfig = {
  builtUpArea:         "required",
  landArea:            "optional",
  ceilingHeight:       "optional",
  loadingDock:         "optional",
  truckAccess:         "optional",
  powerCapacity:       "optional",
  fireSafety:          "optional",
  fenced:              "optional",
  crane:               "optional",
  officeSpace:         "optional",
};

const BUILDING_CONFIG: FieldConfig = {
  builtUpArea:             "required",
  landArea:                "required",
  villaFloorCount:         "required",
  totalUnits:              "required",
  parkingSpots:            "optional",
  elevator:                "optional",
  propertyAge:             "optional",
  commercialGroundFloor:   "optional",
  currentRentalIncome:     "optional",
};

const CHALET_CONFIG: FieldConfig = {
  bedrooms:          "required",
  bathrooms:         "required",
  builtUpArea:       "required",
  furnishing:        "optional",
  privatePool:       "optional",
  seaView:           "optional",
  mountainView:      "optional",
  yard:              "optional",
  barbecue:          "optional",
  sharedBeachAccess: "optional",
  maidRoom:          "optional",
};

// Duplex / Townhouse / Arabic House use the Villa layout
const DUPLEX_CONFIG: FieldConfig = VILLA_CONFIG;
const TOWNHOUSE_CONFIG: FieldConfig = VILLA_CONFIG;
const ARABIC_HOUSE_CONFIG: FieldConfig = VILLA_CONFIG;
const HOTEL_APARTMENT_CONFIG: FieldConfig = APARTMENT_CONFIG;

// ── Master lookup ─────────────────────────────────────────────────────────────
export const LISTING_FIELD_CONFIG: Record<PropertyType, FieldConfig> = {
  villa:            VILLA_CONFIG,
  apartment:        APARTMENT_CONFIG,
  duplex:           DUPLEX_CONFIG,
  townhouse:        TOWNHOUSE_CONFIG,
  arabic_house:     ARABIC_HOUSE_CONFIG,
  land:             LAND_CONFIG,
  farm:             FARM_CONFIG,
  commercial:       COMMERCIAL_CONFIG,
  office:           OFFICE_CONFIG,
  warehouse:        WAREHOUSE_CONFIG,
  building:         BUILDING_CONFIG,
  chalet:           CHALET_CONFIG,
  hotel_apartment:  HOTEL_APARTMENT_CONFIG,
};

export function getFieldVisibility(
  propertyType: PropertyType | null,
  field: FieldName
): FieldVisibility {
  if (!propertyType) return "hidden";
  return LISTING_FIELD_CONFIG[propertyType]?.[field] ?? "hidden";
}

export function isFieldVisible(
  propertyType: PropertyType | null,
  field: FieldName
): boolean {
  return getFieldVisibility(propertyType, field) !== "hidden";
}

export function isFieldRequired(
  propertyType: PropertyType | null,
  field: FieldName
): boolean {
  return getFieldVisibility(propertyType, field) === "required";
}

// ── Bilingual field labels ────────────────────────────────────────────────────

export interface FieldLabelI18n { ar: string; en: string; }

export const FIELD_LABELS: Record<FieldName, FieldLabelI18n> = {
  bedrooms:              { ar: "غرف النوم",                          en: "Bedrooms"                    },
  bathrooms:             { ar: "الحمامات",                           en: "Bathrooms"                   },
  builtUpArea:           { ar: "مساحة البناء",                      en: "Built-up area"               },
  landArea:              { ar: "مساحة الأرض",                       en: "Land area"                   },
  parkingSpots:          { ar: "مواقف السيارات",                    en: "Parking spots"               },
  furnishing:            { ar: "حالة الأثاث",                       en: "Furnishing"                  },
  propertyAge:           { ar: "عمر العقار",                        en: "Property age"                },
  floorNumber:           { ar: "الطابق",                            en: "Floor number"                },
  totalFloorsInBuilding: { ar: "إجمالي طوابق المبنى",              en: "Total floors in building"    },
  villaFloorCount:       { ar: "عدد الطوابق",                       en: "Number of floors"            },
  majlisCount:           { ar: "عدد المجالس",                       en: "Majlis count"                },
  maidRoom:              { ar: "غرفة خادمة",                        en: "Maid's room"                 },
  driverRoom:            { ar: "غرفة سائق",                         en: "Driver's room"               },
  privatePool:           { ar: "مسبح خاص",                         en: "Private pool"                },
  yard:                  { ar: "حوش / فناء",                        en: "Yard / courtyard"            },
  balconyCount:          { ar: "عدد الشرفات",                       en: "Balcony count"               },
  centralAc:             { ar: "تكييف مركزي",                       en: "Central A/C"                 },
  kitchenType:           { ar: "نوع المطبخ",                        en: "Kitchen type"                },
  storeRoom:             { ar: "غرفة تخزين",                        en: "Storage room"                },
  elevator:              { ar: "مصعد",                              en: "Elevator"                    },
  security:              { ar: "حراسة أمنية",                       en: "Security"                    },
  sharedPool:            { ar: "مسبح مشترك",                        en: "Shared pool"                 },
  sharedGym:             { ar: "صالة رياضية مشتركة",               en: "Shared gym"                  },
  balcony:               { ar: "شرفة",                              en: "Balcony"                     },
  seaView:               { ar: "إطلالة بحرية",                      en: "Sea view"                    },
  mountainView:          { ar: "إطلالة جبلية",                      en: "Mountain view"               },
  landUse:               { ar: "الاستخدام المقرر للأرض",           en: "Intended land use"           },
  roadAccess:            { ar: "الوصول الطرقي",                     en: "Road access"                 },
  cornerPlot:            { ar: "قطعة زاوية",                        en: "Corner plot"                 },
  electricityAvailable:  { ar: "كهرباء متاحة",                     en: "Electricity available"       },
  waterAvailable:        { ar: "ماء متاح",                          en: "Water available"             },
  sewageAvailable:       { ar: "صرف صحي متاح",                     en: "Sewage available"            },
  boundaryWall:          { ar: "سور حدودي",                         en: "Boundary wall"               },
  plotNumber:            { ar: "رقم القطعة",                        en: "Plot number"                 },
  nearbyMosque:          { ar: "مسجد قريب",                         en: "Nearby mosque"               },
  nearbySchool:          { ar: "مدرسة قريبة",                       en: "Nearby school"               },
  waterSource:           { ar: "مصدر المياه",                       en: "Water source"                },
  farmHouseExists:       { ar: "يوجد منزل زراعي",                  en: "Farmhouse exists"            },
  numberOfWells:         { ar: "عدد الآبار",                        en: "Number of wells"             },
  palmTreesCount:        { ar: "عدد أشجار النخيل",                 en: "Palm tree count"             },
  otherTrees:            { ar: "أشجار أخرى",                        en: "Other trees"                 },
  pavedRoad:             { ar: "طريق معبّد",                        en: "Paved road"                  },
  agriculturalLicense:   { ar: "ترخيص زراعي",                      en: "Agricultural licence"        },
  shopFrontage:          { ar: "واجهة المحل (م)",                   en: "Shop frontage (m)"           },
  commercialLicense:     { ar: "جاهز للترخيص التجاري",             en: "Commercial licence ready"    },
  displayWindow:         { ar: "واجهة عرض زجاجية",                 en: "Display window"              },
  mainRoadFacing:        { ar: "على شارع رئيسي",                    en: "Main road facing"            },
  meetingRooms:          { ar: "قاعات اجتماعات",                   en: "Meeting rooms"               },
  receptionArea:         { ar: "منطقة استقبال",                    en: "Reception area"              },
  internetReady:         { ar: "جاهز للإنترنت",                    en: "Internet ready"              },
  ceilingHeight:         { ar: "ارتفاع السقف (م)",                  en: "Ceiling height (m)"          },
  loadingDock:           { ar: "منصة تحميل",                        en: "Loading dock"                },
  truckAccess:           { ar: "صالح للشاحنات",                     en: "Truck access"                },
  powerCapacity:         { ar: "طاقة كهربائية (كيلوواط)",          en: "Power capacity (kW)"         },
  fireSafety:            { ar: "أنظمة مكافحة الحريق",              en: "Fire safety systems"         },
  fenced:                { ar: "مسوّر",                             en: "Fenced"                      },
  crane:                 { ar: "رافعة متاحة",                       en: "Crane available"             },
  officeSpace:           { ar: "مساحة مكتبية مدمجة",              en: "Built-in office space"       },
  totalUnits:            { ar: "إجمالي الوحدات",                   en: "Total units"                 },
  commercialGroundFloor: { ar: "طابق أرضي تجاري",                  en: "Commercial ground floor"     },
  currentRentalIncome:   { ar: "الدخل الإيجاري الحالي (ر.ع / شهر)", en: "Current rental income (OMR/month)" },
  barbecue:              { ar: "منطقة شواء",                        en: "BBQ area"                    },
  sharedBeachAccess:     { ar: "وصول مشترك للشاطئ",               en: "Shared beach access"         },
};

/** Return the localised label for a field */
export function getFieldLabel(field: FieldName, locale: Locale): string {
  return FIELD_LABELS[field]?.[locale] ?? field;
}

/** @deprecated Use FIELD_LABELS + getFieldLabel() */
export const FIELD_LABELS_AR: Record<FieldName, string> = Object.fromEntries(
  Object.entries(FIELD_LABELS).map(([k, v]) => [k, (v as FieldLabelI18n).ar])
) as Record<FieldName, string>;

// ── Area label override by type ───────────────────────────────────────────────

interface AreaLabels { builtUp: string; land: string; }

/** Return localised area labels for the given property type */
export function getAreaLabels(
  propertyType: PropertyType | null,
  locale: Locale = "ar"
): AreaLabels {
  // The unit (م² / sqm) is rendered as the input suffix, so it is intentionally
  // omitted from these labels to avoid showing the unit twice.
  if (locale === "en") {
    switch (propertyType) {
      // A unit inside a building measures the unit, not the whole building (FP12 #3).
      case "apartment":
      case "hotel_apartment": return { builtUp: "Apartment area",  land: "Land area"            };
      case "commercial":
      case "office":          return { builtUp: "Unit area",       land: "Land area"            };
      case "farm":            return { builtUp: "Farmhouse area",  land: "Farm area"            };
      case "land":            return { builtUp: "",                land: "Land area"            };
      case "warehouse":       return { builtUp: "Warehouse area",  land: "Land area (optional)" };
      default:                return { builtUp: "Built-up area",   land: "Land area"            };
    }
  }
  switch (propertyType) {
    case "apartment":
    case "hotel_apartment": return { builtUp: "مساحة الشقة",          land: "مساحة الأرض"            };
    case "commercial":
    case "office":          return { builtUp: "مساحة الوحدة",         land: "مساحة الأرض"            };
    case "farm":            return { builtUp: "مساحة المنزل الزراعي", land: "مساحة المزرعة"          };
    case "land":            return { builtUp: "",                     land: "مساحة الأرض"            };
    case "warehouse":       return { builtUp: "مساحة المستودع",       land: "مساحة الأرض (اختياري)"  };
    default:                return { builtUp: "مساحة البناء",         land: "مساحة الأرض"            };
  }
}

// ── Select options ────────────────────────────────────────────────────────────

export const LAND_USE_OPTIONS = [
  { value: "residential",  labelAr: "سكني",   labelEn: "Residential" },
  { value: "commercial",   labelAr: "تجاري",  labelEn: "Commercial"  },
  { value: "agricultural", labelAr: "زراعي",  labelEn: "Agricultural"},
  { value: "industrial",   labelAr: "صناعي",  labelEn: "Industrial"  },
  { value: "mixed",        labelAr: "مختلط",  labelEn: "Mixed use"   },
];

export const ROAD_ACCESS_OPTIONS = [
  { value: "paved",   labelAr: "معبّد", labelEn: "Paved"   },
  { value: "unpaved", labelAr: "ترابي", labelEn: "Unpaved" },
];

export const WATER_SOURCE_OPTIONS = [
  { value: "well",       labelAr: "بئر",          labelEn: "Well"              },
  { value: "government", labelAr: "شبكة حكومية",  labelEn: "Government supply" },
  { value: "none",       labelAr: "لا يوجد",      labelEn: "None"              },
];

export const KITCHEN_TYPE_OPTIONS = [
  { value: "internal", labelAr: "مطبخ داخلي",       labelEn: "Indoor kitchen"      },
  { value: "external", labelAr: "مطبخ خارجي",       labelEn: "Outdoor kitchen"     },
  { value: "both",     labelAr: "داخلي وخارجي",     labelEn: "Indoor & outdoor"    },
];
