import type { DraftPurpose, RentPeriod, DocumentType } from "@/types/listing-draft";
import type { PropertyType } from "@/types/listing";
import type { Locale } from "@/i18n/types";

// ── Total steps ───────────────────────────────────────────────────────────────
export const ADD_LISTING_TOTAL_STEPS = 10;

// ── Step definitions ──────────────────────────────────────────────────────────
export interface StepConfig {
  number: number;
  titleAr: string;
  titleEn: string;
  shortAr: string;
  shortEn: string;
  descAr: string;
  descEn: string;
}

export const ADD_LISTING_STEPS: StepConfig[] = [
  { number: 1,  titleAr: "الغرض من الإعلان",   titleEn: "Listing purpose",    shortAr: "الغرض",    shortEn: "Purpose",    descAr: "هل تريد البيع أم الإيجار؟",                   descEn: "Do you want to sell or rent?" },
  { number: 2,  titleAr: "نوع العقار",           titleEn: "Property type",      shortAr: "النوع",    shortEn: "Type",       descAr: "اختر نوع العقار الذي تنشر عنه",               descEn: "Select the type of property you are listing" },
  { number: 3,  titleAr: "تفاصيل العقار",        titleEn: "Property details",   shortAr: "التفاصيل", shortEn: "Details",    descAr: "المواصفات والخصائص الأساسية",                  descEn: "Key specifications and characteristics" },
  { number: 4,  titleAr: "السعر والتمويل",       titleEn: "Price & financing",  shortAr: "السعر",    shortEn: "Price",      descAr: "حدد السعر وشروط الدفع",                       descEn: "Set your price and payment terms" },
  { number: 5,  titleAr: "الموقع",               titleEn: "Location",           shortAr: "الموقع",   shortEn: "Location",   descAr: "حدد موقع العقار بدقة",                        descEn: "Pinpoint your property's location" },
  { number: 6,  titleAr: "الصور والوسائط",       titleEn: "Photos & media",     shortAr: "الصور",    shortEn: "Photos",     descAr: "أضف صوراً احترافية للعقار",                   descEn: "Add professional photos of your property" },
  { number: 7,  titleAr: "الوثائق والتحقق",      titleEn: "Documents",          shortAr: "الوثائق",  shortEn: "Docs",       descAr: "وثائق للتحقق الإداري فقط",                    descEn: "Documents for administrative verification only" },
  { number: 8,  titleAr: "عنوان ووصف العقار",   titleEn: "Title & description", shortAr: "الوصف",    shortEn: "Description", descAr: "اكتب وصفاً جذاباً يبرز مميزات عقارك",        descEn: "Write a compelling description" },
  { number: 9,  titleAr: "مراجعة الإعلان",      titleEn: "Review listing",     shortAr: "المراجعة", shortEn: "Review",     descAr: "راجع بيانات إعلانك قبل الإرسال",             descEn: "Review your listing before submitting" },
  { number: 10, titleAr: "الإرسال والنشر",      titleEn: "Submit & publish",   shortAr: "الإرسال",  shortEn: "Submit",     descAr: "أرسل إعلانك للمراجعة والنشر",               descEn: "Submit your listing for review and publication" },
];

/** Return the localised title for a step */
export function getStepTitle(step: StepConfig, locale: Locale): string {
  return locale === "ar" ? step.titleAr : step.titleEn;
}

/** Return the localised short label for a step */
export function getStepShort(step: StepConfig, locale: Locale): string {
  return locale === "ar" ? step.shortAr : step.shortEn;
}

// ── Listing purposes ──────────────────────────────────────────────────────────
export interface PurposeConfig {
  value: DraftPurpose;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
}

export const LISTING_PURPOSES: PurposeConfig[] = [
  {
    value: "sale",
    labelAr: "للبيع",
    labelEn: "For sale",
    descAr: "بيع عقارك بسعر السوق وتحقيق أفضل عائد",
    descEn: "Sell your property at market price for the best return",
  },
  {
    value: "rent",
    labelAr: "للإيجار",
    labelEn: "For rent",
    descAr: "تأجير عقارك بعائد شهري أو سنوي مضمون",
    descEn: "Rent out your property for a guaranteed monthly or annual income",
  },
  {
    value: "investment",
    labelAr: "للاستثمار",
    labelEn: "Investment",
    descAr: "طرح عقارك للمستثمرين بعائد استثماري مجزٍ",
    descEn: "List your property for investors with a rewarding return",
  },
];

// ── Property types for add-listing ───────────────────────────────────────────
// (reuses PropertyType values from listing.ts, just defines display order)
export const DRAFT_PROPERTY_TYPE_GROUPS = [
  {
    groupAr: "سكني",
    groupEn: "Residential",
    types: ["apartment", "villa", "duplex", "townhouse", "arabic_house", "chalet"],
  },
  {
    groupAr: "أراضي ومزارع",
    groupEn: "Land & Farms",
    types: ["land", "farm"],
  },
  {
    groupAr: "تجاري",
    groupEn: "Commercial",
    types: ["commercial", "office", "warehouse", "building", "hotel_apartment"],
  },
];

// ── Rent periods ──────────────────────────────────────────────────────────────
export interface RentPeriodConfig {
  value: RentPeriod;
  labelAr: string;
  labelEn: string;
}

export const RENT_PERIODS: RentPeriodConfig[] = [
  { value: "monthly",   labelAr: "شهري",       labelEn: "Monthly"   },
  { value: "yearly",    labelAr: "سنوي",        labelEn: "Yearly"    },
  { value: "quarterly", labelAr: "ربع سنوي",   labelEn: "Quarterly" },
  { value: "weekly",    labelAr: "أسبوعي",     labelEn: "Weekly"    },
];

// ── Property age options ──────────────────────────────────────────────────────
export const PROPERTY_AGE_OPTIONS = [
  { value: "0",    labelAr: "جديد (قيد الإنشاء)", labelEn: "New (under construction)" },
  { value: "1",    labelAr: "أقل من سنة",           labelEn: "Less than 1 year"         },
  { value: "2",    labelAr: "١–٢ سنة",              labelEn: "1–2 years"                },
  { value: "3-5",  labelAr: "٣–٥ سنوات",            labelEn: "3–5 years"                },
  { value: "5-10", labelAr: "٥–١٠ سنوات",           labelEn: "5–10 years"               },
  { value: "10+",  labelAr: "أكثر من ١٠ سنوات",    labelEn: "More than 10 years"       },
];

// ── Furnishing options ────────────────────────────────────────────────────────
export const FURNISHING_OPTIONS = [
  { value: "furnished",      labelAr: "مفروش بالكامل", labelEn: "Fully furnished"  },
  { value: "semi_furnished", labelAr: "نصف مفروش",      labelEn: "Semi-furnished"   },
  { value: "unfurnished",    labelAr: "غير مفروش",      labelEn: "Unfurnished"      },
];

// ── Property amenities — stored as string[] in draft.amenities ───────────────────
// Grouped into 5 collapsible categories for the مزايا العقار section.
// `propertyTypes` restricts a group to specific types; omitting it means all types.

export interface AmenityItem {
  labelAr: string; // the string stored in draft.amenities
  labelEn: string;
}

export interface AmenityGroup {
  groupKey: string;
  titleAr: string;
  titleEn: string;
  icon: string; // SVG path d= string
  propertyTypes?: PropertyType[]; // undefined = shown for all types
  items: AmenityItem[];
}

export const AMENITY_GROUPS: AmenityGroup[] = [
  {
    groupKey: "spaces",
    titleAr: "المساحات والغرف",
    titleEn: "Spaces & rooms",
    icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    items: [
      { labelAr: "مجلس",          labelEn: "Majlis"           },
      { labelAr: "غرفة خادمة",    labelEn: "Maid's room"      },
      { labelAr: "غرفة سائق",     labelEn: "Driver's room"    },
      { labelAr: "مطبخ خارجي",    labelEn: "Outdoor kitchen"  },
      { labelAr: "مطبخ داخلي",    labelEn: "Indoor kitchen"   },
      { labelAr: "حوش / فناء",    labelEn: "Courtyard"        },
      { labelAr: "شرفة",           labelEn: "Balcony"          },
      { labelAr: "غرفة تخزين",    labelEn: "Storage room"     },
      { labelAr: "ملحق خارجي",    labelEn: "Outdoor annex"    },
    ],
  },
  {
    groupKey: "views",
    titleAr: "الموقع والإطلالة",
    titleEn: "Location & views",
    icon: "M1 6s0-5 11-5 11 5 11 5-0 5-11 5S1 11 1 6z M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    items: [
      { labelAr: "إطلالة بحرية",              labelEn: "Sea view"              },
      { labelAr: "إطلالة جبلية",              labelEn: "Mountain view"         },
      { labelAr: "إطلالة على الحديقة",        labelEn: "Garden view"           },
      { labelAr: "قرب المسجد",                labelEn: "Near mosque"           },
      { labelAr: "قرب المدرسة",               labelEn: "Near school"           },
      { labelAr: "قرب المجمع التجاري",        labelEn: "Near shopping mall"    },
      { labelAr: "قرب الشاطئ",               labelEn: "Near beach"            },
      { labelAr: "واجهة على الشارع الرئيسي", labelEn: "Main road frontage"    },
    ],
  },
  {
    groupKey: "security",
    titleAr: "الأمان والخدمات",
    titleEn: "Security & services",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    items: [
      { labelAr: "حارس أمن",       labelEn: "Security guard"    },
      { labelAr: "كاميرات مراقبة", labelEn: "CCTV cameras"      },
      { labelAr: "مصعد",            labelEn: "Elevator"          },
      { labelAr: "مسبح خاص",       labelEn: "Private pool"      },
      { labelAr: "مسبح مشترك",     labelEn: "Shared pool"       },
      { labelAr: "صالة رياضية",    labelEn: "Gym"               },
      { labelAr: "تكييف مركزي",    labelEn: "Central A/C"       },
      { labelAr: "منطقة شواء",     labelEn: "BBQ area"          },
      { labelAr: "موقف سيارات",    labelEn: "Parking"           },
      { labelAr: "تشطيب فاخر",     labelEn: "Luxury finishing"  },
    ],
  },
  {
    groupKey: "ownership",
    titleAr: "الملكية والتصنيف",
    titleEn: "Ownership & classification",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    items: [
      { labelAr: "تملك حر",          labelEn: "Freehold"             },
      { labelAr: "مسموح للوافدين",   labelEn: "Expats allowed"       },
      { labelAr: "للعائلات فقط",     labelEn: "Families only"        },
      { labelAr: "مسموح للعزاب",     labelEn: "Singles allowed"      },
      { labelAr: "جاهز للإنترنت",    labelEn: "Internet ready"       },
      { labelAr: "مناسب للاستثمار",  labelEn: "Investment suitable"  },
    ],
  },
  {
    groupKey: "land",
    titleAr: "خدمات الأرض والمزرعة",
    titleEn: "Land & farm services",
    icon: "M5 3h14a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z M3 12h18M3 17h18",
    propertyTypes: ["land", "farm"],
    items: [
      { labelAr: "كهرباء",        labelEn: "Electricity"     },
      { labelAr: "ماء",           labelEn: "Water"           },
      { labelAr: "صرف صحي",      labelEn: "Sewage"          },
      { labelAr: "سور حدودي",    labelEn: "Boundary wall"   },
      { labelAr: "طريق معبّد",   labelEn: "Paved road"      },
      { labelAr: "رخصة زراعية",  labelEn: "Farm licence"    },
      { labelAr: "منزل مزرعة",   labelEn: "Farmhouse"       },
      { labelAr: "آبار مياه",    labelEn: "Water wells"     },
      { labelAr: "نخيل",          labelEn: "Palm trees"      },
    ],
  },
];

/** Return the localised label for any object with labelAr / labelEn */
export function getLocalizedLabel(
  item: { labelAr: string; labelEn: string },
  locale: Locale
): string {
  return locale === "ar" ? item.labelAr : item.labelEn;
}

// Legacy flat list — kept for backward compatibility with any remaining references
export interface OmanFeature {
  key: string;
  labelAr: string;
}

/** @deprecated Use AMENITY_GROUPS instead */
export const OMAN_FEATURES: OmanFeature[] = AMENITY_GROUPS.flatMap((g) =>
  g.items.map((item) => ({ key: item.labelAr, labelAr: item.labelAr }))
);

// ── Document types ────────────────────────────────────────────────────────────
export interface DocumentTypeConfig {
  value: DocumentType;
  labelAr: string;
  labelEn: string;
  descAr: string;
  descEn: string;
  required: boolean;
  accept: string;
}

export const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    value: "mulkiya",
    labelAr: "سند الملكية (ملكية)",
    labelEn: "Title deed (Mulkiya)",
    descAr: "مستند رسمي يثبت ملكية العقار",
    descEn: "Official document proving property ownership",
    required: true,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    value: "agency_auth",
    labelAr: "تفويض الوكالة",
    labelEn: "Agency authorization",
    descAr: "مطلوب إذا كنت وسيطاً معتمداً",
    descEn: "Required if you are a licensed agent",
    required: false,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    value: "civil_id",
    labelAr: "الهوية المدنية",
    labelEn: "Civil ID",
    descAr: "نسخة من بطاقة الهوية للتحقق",
    descEn: "A copy of your ID card for verification",
    required: false,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    value: "cr_number",
    labelAr: "رقم السجل التجاري",
    labelEn: "Commercial registration (CR)",
    descAr: "للوكالات والشركات العقارية",
    descEn: "For real-estate agencies and companies",
    required: false,
    accept: ".pdf",
  },
  {
    value: "contract_draft",
    labelAr: "مسودة العقد (اختياري)",
    labelEn: "Contract draft (optional)",
    descAr: "مسودة مبدئية للعقد إن وجدت",
    descEn: "An initial draft of the contract, if any",
    required: false,
    accept: ".pdf,.doc,.docx",
  },
];

// ── Quality score labels ──────────────────────────────────────────────────────
export interface QualityLabel {
  minScore: number;
  labelAr: string;
  labelEn: string;
  color: string;
  bgColor: string;
}

export const QUALITY_LABELS: QualityLabel[] = [
  { minScore: 0,  labelAr: "ضعيف",   labelEn: "Weak",      color: "#C0392B", bgColor: "#FEF0EE" },
  { minScore: 40, labelAr: "متوسط",  labelEn: "Fair",      color: "#C8860A", bgColor: "#FDF6E3" },
  { minScore: 70, labelAr: "جيد",    labelEn: "Good",      color: "#0A3C36", bgColor: "#E6F0EF" },
  { minScore: 90, labelAr: "ممتاز",  labelEn: "Excellent", color: "#2471A3", bgColor: "#EAF4FB" },
];

// ── Image constraints ─────────────────────────────────────────────────────────
export const IMAGE_CONSTRAINTS = {
  maxCount: 20,
  minCount: 1,
  maxSizeBytes: 8 * 1024 * 1024, // 8 MB
  acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  acceptedExtensions: ".jpg,.jpeg,.png,.webp",
};

// ── Price thresholds ──────────────────────────────────────────────────────────
export const AML_PRICE_THRESHOLD = 100_000; // OMR — flag if >= this
export const SUSPICIOUS_DISCOUNT_PCT = 30;   // % below market avg to flag

// ── Minimum field lengths ─────────────────────────────────────────────────────
export const MIN_TITLE_LENGTH = 8;
export const MAX_TITLE_LENGTH = 120;
export const MIN_DESCRIPTION_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MAX_HIGHLIGHTS = 5;
