export type PlanId = "free" | "agent_pro" | "agency";

export interface PlanFeature {
  labelAr: string;
  included: boolean;
}

export interface SubscriptionPlan {
  id: PlanId;
  nameAr: string;
  price: number;       // OMR/month; 0 = free
  period: "month" | "year";
  listingLimit: number | null; // null = unlimited
  featuredListings: number;
  leadManagement: boolean;
  analytics: boolean;
  prioritySupport: boolean;
  verificationIncluded: boolean;
  features: PlanFeature[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    nameAr: "المجاني",
    price: 0,
    period: "month",
    listingLimit: 3,
    featuredListings: 0,
    leadManagement: false,
    analytics: false,
    prioritySupport: false,
    verificationIncluded: false,
    features: [
      { labelAr: "حتى ٣ إعلانات نشطة", included: true },
      { labelAr: "ظهور أساسي في البحث", included: true },
      { labelAr: "إحصائيات محدودة", included: false },
      { labelAr: "إدارة العملاء المحتملين", included: false },
      { labelAr: "إعلانات مميزة", included: false },
      { labelAr: "دعم أولوية", included: false },
    ],
  },
  {
    id: "agent_pro",
    nameAr: "وسيط احترافي",
    price: 15,
    period: "month",
    listingLimit: 30,
    featuredListings: 2,
    leadManagement: true,
    analytics: true,
    prioritySupport: true,
    verificationIncluded: true,
    features: [
      { labelAr: "حتى ٣٠ إعلاناً نشطاً", included: true },
      { labelAr: "ظهور مميز في البحث", included: true },
      { labelAr: "تحليلات متقدمة", included: true },
      { labelAr: "إدارة العملاء المحتملين", included: true },
      { labelAr: "٢ إعلانات مميزة شهرياً", included: true },
      { labelAr: "دعم أولوية", included: true },
    ],
  },
  {
    id: "agency",
    nameAr: "وكالة عقارية",
    price: 50,
    period: "month",
    listingLimit: null,
    featuredListings: 10,
    leadManagement: true,
    analytics: true,
    prioritySupport: true,
    verificationIncluded: true,
    features: [
      { labelAr: "إعلانات غير محدودة", included: true },
      { labelAr: "لوحة تحكم الوكالة", included: true },
      { labelAr: "إدارة الفريق", included: true },
      { labelAr: "تحليلات الوكالة الكاملة", included: true },
      { labelAr: "١٠ إعلانات مميزة شهرياً", included: true },
      { labelAr: "مدير حساب مخصص", included: true },
    ],
  },
];

export interface AddOn {
  id: string;
  nameAr: string;
  descAr: string;
  price: number;
  unit: string; // "أسبوع" | "شهر" | "مرة"
}

export const SUBSCRIPTION_ADDONS: AddOn[] = [
  {
    id: "featured_listing",
    nameAr: "إعلان مميز",
    descAr: "رفع إعلانك إلى أعلى نتائج البحث لمدة أسبوع",
    price: 5,
    unit: "أسبوع",
  },
  {
    id: "lead_boost",
    nameAr: "تعزيز العملاء",
    descAr: "الحصول على عملاء محتملين إضافيين في منطقتك",
    price: 2,
    unit: "أسبوع",
  },
];
