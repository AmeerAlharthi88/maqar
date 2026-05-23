import type { DraftPurpose, RentPeriod, DocumentType } from "@/types/listing-draft";

// ── Total steps ───────────────────────────────────────────────────────────────
export const ADD_LISTING_TOTAL_STEPS = 10;

// ── Step definitions ──────────────────────────────────────────────────────────
export interface StepConfig {
  number: number;
  titleAr: string;
  shortAr: string;
  descAr: string;
}

export const ADD_LISTING_STEPS: StepConfig[] = [
  { number: 1,  titleAr: "الغرض من الإعلان",   shortAr: "الغرض",    descAr: "هل تريد البيع أم الإيجار؟" },
  { number: 2,  titleAr: "نوع العقار",           shortAr: "النوع",    descAr: "اختر نوع العقار الذي تنشر عنه" },
  { number: 3,  titleAr: "تفاصيل العقار",        shortAr: "التفاصيل", descAr: "المواصفات والخصائص الأساسية" },
  { number: 4,  titleAr: "السعر والتمويل",       shortAr: "السعر",    descAr: "حدد السعر وشروط الدفع" },
  { number: 5,  titleAr: "الموقع",               shortAr: "الموقع",   descAr: "حدد موقع العقار بدقة" },
  { number: 6,  titleAr: "الصور والوسائط",       shortAr: "الصور",    descAr: "أضف صوراً احترافية للعقار" },
  { number: 7,  titleAr: "الوثائق والتحقق",      shortAr: "الوثائق",  descAr: "وثائق للتحقق الإداري فقط" },
  { number: 8,  titleAr: "عنوان ووصف العقار",   shortAr: "الوصف",    descAr: "اكتب وصفاً جذاباً يبرز مميزات عقارك" },
  { number: 9,  titleAr: "مراجعة الإعلان",      shortAr: "المراجعة", descAr: "راجع بيانات إعلانك قبل الإرسال" },
  { number: 10, titleAr: "الإرسال والنشر",      shortAr: "الإرسال",  descAr: "أرسل إعلانك للمراجعة والنشر" },
];

// ── Listing purposes ──────────────────────────────────────────────────────────
export interface PurposeConfig {
  value: DraftPurpose;
  labelAr: string;
  descAr: string;
}

export const LISTING_PURPOSES: PurposeConfig[] = [
  {
    value: "sale",
    labelAr: "للبيع",
    descAr: "بيع عقارك بسعر السوق وتحقيق أفضل عائد",
  },
  {
    value: "rent",
    labelAr: "للإيجار",
    descAr: "تأجير عقارك بعائد شهري أو سنوي مضمون",
  },
  {
    value: "investment",
    labelAr: "للاستثمار",
    descAr: "طرح عقارك للمستثمرين بعائد استثماري مجزٍ",
  },
];

// ── Property types for add-listing ───────────────────────────────────────────
// (reuses PropertyType values from listing.ts, just defines display order)
export const DRAFT_PROPERTY_TYPE_GROUPS = [
  {
    groupAr: "سكني",
    types: ["apartment", "villa", "duplex", "townhouse", "arabic_house", "chalet"],
  },
  {
    groupAr: "أراضي ومزارع",
    types: ["land", "farm"],
  },
  {
    groupAr: "تجاري",
    types: ["commercial", "office", "warehouse", "building", "hotel_apartment"],
  },
];

// ── Rent periods ──────────────────────────────────────────────────────────────
export interface RentPeriodConfig {
  value: RentPeriod;
  labelAr: string;
}

export const RENT_PERIODS: RentPeriodConfig[] = [
  { value: "monthly",   labelAr: "شهري" },
  { value: "yearly",    labelAr: "سنوي" },
  { value: "quarterly", labelAr: "ربع سنوي" },
  { value: "weekly",    labelAr: "أسبوعي" },
];

// ── Property age options ──────────────────────────────────────────────────────
export const PROPERTY_AGE_OPTIONS = [
  { value: "0",    labelAr: "جديد (قيد الإنشاء)" },
  { value: "1",    labelAr: "أقل من سنة" },
  { value: "2",    labelAr: "١–٢ سنة" },
  { value: "3-5",  labelAr: "٣–٥ سنوات" },
  { value: "5-10", labelAr: "٥–١٠ سنوات" },
  { value: "10+",  labelAr: "أكثر من ١٠ سنوات" },
];

// ── Furnishing options ────────────────────────────────────────────────────────
export const FURNISHING_OPTIONS = [
  { value: "furnished",      labelAr: "مفروش بالكامل" },
  { value: "semi_furnished", labelAr: "نصف مفروش" },
  { value: "unfurnished",    labelAr: "غير مفروش" },
];

// ── Oman-specific features ────────────────────────────────────────────────────
export interface OmanFeature {
  key: string;
  labelAr: string;
}

export const OMAN_FEATURES: OmanFeature[] = [
  { key: "hasMajlis",         labelAr: "مجلس" },
  { key: "hasMaidRoom",       labelAr: "غرفة خادمة" },
  { key: "hasDriverRoom",     labelAr: "غرفة سائق" },
  { key: "hasOutdoorKitchen", labelAr: "مطبخ خارجي" },
  { key: "hasIndoorKitchen",  labelAr: "مطبخ داخلي" },
  { key: "hasYard",           labelAr: "حوش / فناء" },
  { key: "hasSeaView",        labelAr: "إطلالة بحرية" },
  { key: "hasMountainView",   labelAr: "إطلالة جبلية" },
  { key: "isFreehold",        labelAr: "تملك حر" },
  { key: "isExpatAllowed",    labelAr: "مسموح للوافدين" },
  { key: "isFamilyOnly",      labelAr: "للعائلات فقط" },
  { key: "isBachelorAllowed", labelAr: "مسموح للعزاب" },
];

// ── Document types ────────────────────────────────────────────────────────────
export interface DocumentTypeConfig {
  value: DocumentType;
  labelAr: string;
  descAr: string;
  required: boolean;
  accept: string;
}

export const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  {
    value: "mulkiya",
    labelAr: "سند الملكية (ملكية)",
    descAr: "مستند رسمي يثبت ملكية العقار",
    required: true,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    value: "agency_auth",
    labelAr: "تفويض الوكالة",
    descAr: "مطلوب إذا كنت وسيطاً معتمداً",
    required: false,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    value: "civil_id",
    labelAr: "الهوية المدنية",
    descAr: "نسخة من بطاقة الهوية للتحقق",
    required: false,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    value: "cr_number",
    labelAr: "رقم السجل التجاري",
    descAr: "للوكالات والشركات العقارية",
    required: false,
    accept: ".pdf",
  },
  {
    value: "contract_draft",
    labelAr: "مسودة العقد (اختياري)",
    descAr: "مسودة مبدئية للعقد إن وجدت",
    required: false,
    accept: ".pdf,.doc,.docx",
  },
];

// ── Quality score labels ──────────────────────────────────────────────────────
export interface QualityLabel {
  minScore: number;
  labelAr: string;
  color: string;
  bgColor: string;
}

export const QUALITY_LABELS: QualityLabel[] = [
  { minScore: 0,  labelAr: "ضعيف",   color: "#C0392B", bgColor: "#FEF0EE" },
  { minScore: 40, labelAr: "متوسط",  color: "#C8860A", bgColor: "#FDF6E3" },
  { minScore: 70, labelAr: "جيد",    color: "#0A3C36", bgColor: "#E6F0EF" },
  { minScore: 90, labelAr: "ممتاز",  color: "#2471A3", bgColor: "#EAF4FB" },
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
export const MIN_TITLE_LENGTH = 10;
export const MAX_TITLE_LENGTH = 120;
export const MIN_DESCRIPTION_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MAX_HIGHLIGHTS = 5;
