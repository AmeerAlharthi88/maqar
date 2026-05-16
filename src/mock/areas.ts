// ── Area Guide Mock Data — Phase 16 ──────────────────────────────────────────
// Comprehensive area data for the area guide system.
// All market figures are estimated/illustrative — not official government data.
// Data is admin-managed; source of truth will be Supabase in production.
// ─────────────────────────────────────────────────────────────────────────────

export interface AreaGuide {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  governorateAr: string;
  governorateId: string;
  wilayatAr: string;
  wilayatId: string;

  // Market data — estimated/illustrative
  avgSalePrice: number;     // OMR
  avgRentPrice: number;     // OMR/month
  pricePerSqm: number;      // OMR/m²
  rentalYield: number;      // annual %
  demandScore: number;      // 1–100
  priceChangePct: number;   // YoY %
  listingCount: number;

  // Lifestyle & profile
  overviewAr: string;
  popularPropertyTypes: string[];
  suitableFor: ("families" | "investors" | "students" | "professionals")[];
  suitableForAr: string[];
  lifestyleAr: string;
  nearbyServicesAr: string[];
  relatedAreaSlugs: string[];

  // Tags
  tags: ("investment" | "family" | "rental" | "luxury" | "affordable")[];
}

export const AREA_GUIDES: AreaGuide[] = [
  // ── Muscat Governorate ─────────────────────────────────────────────────────
  {
    id: "al-mouj",
    slug: "al-mouj",
    nameAr: "الموج مسقط",
    nameEn: "Al Mouj Muscat",
    governorateAr: "مسقط",
    governorateId: "muscat",
    wilayatAr: "بوشر",
    wilayatId: "bausher",
    avgSalePrice: 165000,
    avgRentPrice: 780,
    pricePerSqm: 1200,
    rentalYield: 5.7,
    demandScore: 96,
    priceChangePct: 9.2,
    listingCount: 38,
    overviewAr: "الموج مسقط مشروع متكامل على الواجهة البحرية يضم فيلات وشقق فاخرة ومرسى للقوارب وملاعب جولف. يمثل أحد أرقى المجمعات السكنية في سلطنة عُمان.",
    popularPropertyTypes: ["فيلا", "شقة فاخرة", "دوبلكس"],
    suitableFor: ["investors", "professionals"],
    suitableForAr: ["المستثمرون", "المحترفون"],
    lifestyleAr: "حياة فاخرة على البحر مع مرسى للقوارب وملعب جولف ومطاعم راقية وتجمع مجتمعي دولي.",
    nearbyServicesAr: ["مرسى الموج", "ملعب الجولف", "مركز تجاري", "مطاعم ومقاهي", "صيدلية", "عيادات"],
    relatedAreaSlugs: ["al-qurm", "bausher", "al-ghubrah"],
    tags: ["luxury", "investment"],
  },
  {
    id: "bausher",
    slug: "bausher",
    nameAr: "بوشر",
    nameEn: "Bausher",
    governorateAr: "مسقط",
    governorateId: "muscat",
    wilayatAr: "بوشر",
    wilayatId: "bausher",
    avgSalePrice: 88000,
    avgRentPrice: 360,
    pricePerSqm: 560,
    rentalYield: 4.9,
    demandScore: 88,
    priceChangePct: 5.1,
    listingCount: 97,
    overviewAr: "بوشر ولاية حيوية في قلب مسقط تتميز بتنوع خياراتها السكنية بين الشقق والفيلات وقربها من المراكز الحكومية والتجارية والمستشفيات الرئيسية.",
    popularPropertyTypes: ["شقة", "فيلا", "أرض سكنية"],
    suitableFor: ["families", "professionals"],
    suitableForAr: ["العائلات", "المحترفون"],
    lifestyleAr: "موقع مركزي مريح للتنقل مع خدمات متكاملة ومدارس وأسواق قريبة.",
    nearbyServicesAr: ["مستشفى الموج", "المستشفى الإيطالي", "مراكز تجارية", "مدارس خاصة وحكومية", "مساجد"],
    relatedAreaSlugs: ["al-khoud", "al-ghubrah", "al-mouj"],
    tags: ["family", "investment"],
  },
  {
    id: "al-khoud",
    slug: "al-khoud",
    nameAr: "الخوض",
    nameEn: "Al Khoud",
    governorateAr: "مسقط",
    governorateId: "muscat",
    wilayatAr: "السيب",
    wilayatId: "seeb",
    avgSalePrice: 62000,
    avgRentPrice: 250,
    pricePerSqm: 430,
    rentalYield: 4.8,
    demandScore: 84,
    priceChangePct: 4.3,
    listingCount: 74,
    overviewAr: "الخوض منطقة هادئة تضم جامعة السلطان قابوس ومساكن أكاديمية وسكناً عائلياً بأسعار معتدلة على بعد دقائق من الطريق السريع.",
    popularPropertyTypes: ["فيلا", "شقة", "غرفة"],
    suitableFor: ["families", "students", "professionals"],
    suitableForAr: ["العائلات", "الطلاب", "المحترفون"],
    lifestyleAr: "بيئة هادئة وخضراء قريبة من الجامعة والمستشفيات، مناسبة للعائلات والطلاب.",
    nearbyServicesAr: ["جامعة السلطان قابوس", "مستشفى جامعة السلطان قابوس", "مدارس", "أسواق", "مساجد"],
    relatedAreaSlugs: ["mawaleh", "seeb", "al-hail"],
    tags: ["family", "affordable"],
  },
  {
    id: "al-hail",
    slug: "al-hail",
    nameAr: "الحيل",
    nameEn: "Al Hail",
    governorateAr: "مسقط",
    governorateId: "muscat",
    wilayatAr: "السيب",
    wilayatId: "seeb",
    avgSalePrice: 63000,
    avgRentPrice: 255,
    pricePerSqm: 445,
    rentalYield: 4.9,
    demandScore: 86,
    priceChangePct: 5.1,
    listingCount: 98,
    overviewAr: "الحيل منطقة سكنية صاعدة تشهد نمواً ملحوظاً في الطلب بفضل قربها من المستشفى والجامعة والمناطق التجارية.",
    popularPropertyTypes: ["فيلا", "شقة", "أرض"],
    suitableFor: ["families", "investors"],
    suitableForAr: ["العائلات", "المستثمرون"],
    lifestyleAr: "مجتمع عائلي هادئ يتطور بسرعة مع بنية تحتية جيدة وفرص استثمارية واعدة.",
    nearbyServicesAr: ["مستشفى الحيل", "مدارس خاصة", "أسواق شعبية", "مساجد"],
    relatedAreaSlugs: ["al-khoud", "mawaleh", "seeb"],
    tags: ["family", "investment", "rental"],
  },
  {
    id: "mawaleh",
    slug: "mawaleh",
    nameAr: "الموالح",
    nameEn: "Mawaleh",
    governorateAr: "مسقط",
    governorateId: "muscat",
    wilayatAr: "السيب",
    wilayatId: "seeb",
    avgSalePrice: 59000,
    avgRentPrice: 235,
    pricePerSqm: 400,
    rentalYield: 4.8,
    demandScore: 89,
    priceChangePct: 4.2,
    listingCount: 134,
    overviewAr: "الموالح من أكثر مناطق مسقط طلباً للسكن العائلي بفضل أسعارها المعقولة وقربها من المطار والطريق السريع.",
    popularPropertyTypes: ["شقة", "فيلا", "بيت عربي"],
    suitableFor: ["families", "professionals"],
    suitableForAr: ["العائلات", "المحترفون"],
    lifestyleAr: "حي شعبي أصيل يجمع بين الاتصال بالطريق السريع وكثرة الخدمات والمرافق العائلية.",
    nearbyServicesAr: ["أسواق الموالح", "مسجد", "مدارس حكومية وخاصة", "مراكز صحية", "مطاعم"],
    relatedAreaSlugs: ["al-hail", "al-khoud", "seeb"],
    tags: ["family", "affordable", "rental"],
  },
  {
    id: "seeb",
    slug: "seeb",
    nameAr: "السيب",
    nameEn: "Seeb",
    governorateAr: "مسقط",
    governorateId: "muscat",
    wilayatAr: "السيب",
    wilayatId: "seeb",
    avgSalePrice: 55000,
    avgRentPrice: 210,
    pricePerSqm: 380,
    rentalYield: 4.6,
    demandScore: 81,
    priceChangePct: 3.5,
    listingCount: 188,
    overviewAr: "ولاية السيب من أكبر مناطق مسقط السكنية بها مطار مسقط الدولي ومتاجر كبرى وتنوع في خيارات السكن بأسعار متنوعة.",
    popularPropertyTypes: ["شقة", "فيلا", "أرض سكنية"],
    suitableFor: ["families", "investors", "professionals"],
    suitableForAr: ["العائلات", "المستثمرون", "المحترفون"],
    lifestyleAr: "ولاية كبيرة وحيوية تتيح أسلوب حياة متنوعاً بين التسوق والترفيه والقرب من المطار.",
    nearbyServicesAr: ["مطار مسقط الدولي", "سيتي سنتر مسقط", "أسواق", "مستشفيات", "مدارس"],
    relatedAreaSlugs: ["mawaleh", "al-hail", "barka"],
    tags: ["family", "investment", "affordable"],
  },
  // ── North Al Batinah ───────────────────────────────────────────────────────
  {
    id: "barka",
    slug: "barka",
    nameAr: "بركاء",
    nameEn: "Barka",
    governorateAr: "شمال الباطنة",
    governorateId: "north-batinah",
    wilayatAr: "بركاء",
    wilayatId: "barka",
    avgSalePrice: 42000,
    avgRentPrice: 165,
    pricePerSqm: 310,
    rentalYield: 4.7,
    demandScore: 72,
    priceChangePct: 3.2,
    listingCount: 61,
    overviewAr: "بركاء مدينة ساحلية هادئة تبعد نحو ٨٠ كم عن مسقط وتتميز بأسعارها المعقولة وإطلالاتها البحرية وبيئتها العائلية الهادئة.",
    popularPropertyTypes: ["فيلا", "بيت عربي", "أرض"],
    suitableFor: ["families", "investors"],
    suitableForAr: ["العائلات", "المستثمرون"],
    lifestyleAr: "حياة هادئة على شاطئ الباطنة بعيداً عن ازدحام المدينة مع فرص استثمارية في أراضي السكن.",
    nearbyServicesAr: ["شاطئ بركاء", "سوق بركاء", "مدارس", "مراكز صحية", "مساجد"],
    relatedAreaSlugs: ["seeb", "sohar"],
    tags: ["family", "affordable", "investment"],
  },
  {
    id: "sohar",
    slug: "sohar",
    nameAr: "صحار",
    nameEn: "Sohar",
    governorateAr: "شمال الباطنة",
    governorateId: "north-batinah",
    wilayatAr: "صحار",
    wilayatId: "sohar",
    avgSalePrice: 38000,
    avgRentPrice: 160,
    pricePerSqm: 290,
    rentalYield: 5.1,
    demandScore: 68,
    priceChangePct: 2.8,
    listingCount: 57,
    overviewAr: "صحار عاصمة شمال الباطنة وإحدى أهم المدن الصناعية في عُمان. تضم منطقة صحار الصناعية وميناء صحار وتوفر فرص سكن وإيجار متنوعة.",
    popularPropertyTypes: ["شقة", "فيلا", "مستودع"],
    suitableFor: ["investors", "professionals"],
    suitableForAr: ["المستثمرون", "المحترفون"],
    lifestyleAr: "مدينة صناعية تجارية نشطة ذات طلب إيجار مرتفع من العمالة الوافدة والمهنيين في المنطقة الصناعية.",
    nearbyServicesAr: ["ميناء صحار", "المنطقة الصناعية", "مستشفى صحار", "مراكز تجارية", "مدارس"],
    relatedAreaSlugs: ["barka", "seeb"],
    tags: ["investment", "rental"],
  },
  // ── Ad Dakhiliyah ─────────────────────────────────────────────────────────
  {
    id: "nizwa",
    slug: "nizwa",
    nameAr: "نزوى",
    nameEn: "Nizwa",
    governorateAr: "الداخلية",
    governorateId: "ad-dakhiliyah",
    wilayatAr: "نزوى",
    wilayatId: "nizwa",
    avgSalePrice: 35000,
    avgRentPrice: 140,
    pricePerSqm: 260,
    rentalYield: 4.8,
    demandScore: 64,
    priceChangePct: 2.2,
    listingCount: 43,
    overviewAr: "نزوى عاصمة محافظة الداخلية ومدينة تاريخية ذات طابع عُماني أصيل. يزداد الطلب عليها من المواطنين والراغبين في الحياة الهادئة بعيداً عن ضغوط المدينة.",
    popularPropertyTypes: ["بيت عربي", "فيلا", "أرض"],
    suitableFor: ["families", "investors"],
    suitableForAr: ["العائلات", "المستثمرون"],
    lifestyleAr: "حياة بدوية عُمانية أصيلة مع قلعة تاريخية وسوق شعبي وطبيعة خلابة. مناسبة لمن يبحث عن الهدوء والموروث الثقافي.",
    nearbyServicesAr: ["قلعة نزوى", "سوق نزوى", "مستشفى نزوى", "مدارس", "مزارع ووديان"],
    relatedAreaSlugs: ["seeb", "barka"],
    tags: ["family", "affordable"],
  },
  // ── Dhofar ────────────────────────────────────────────────────────────────
  {
    id: "salalah",
    slug: "salalah",
    nameAr: "صلالة",
    nameEn: "Salalah",
    governorateAr: "ظفار",
    governorateId: "dhofar",
    wilayatAr: "صلالة",
    wilayatId: "salalah",
    avgSalePrice: 47000,
    avgRentPrice: 185,
    pricePerSqm: 340,
    rentalYield: 4.7,
    demandScore: 73,
    priceChangePct: 3.4,
    listingCount: 68,
    overviewAr: "صلالة عاصمة محافظة ظفار المعروفة بمناخها الاستوائي وموسم الخريف السياحي. يشهد سوق العقارات فيها نمواً متسارعاً مع زيادة الاهتمام السياحي والاستثماري.",
    popularPropertyTypes: ["فيلا", "شقة", "أرض سياحية"],
    suitableFor: ["investors", "families"],
    suitableForAr: ["المستثمرون", "العائلات"],
    lifestyleAr: "موسم الخريف السياحي والطبيعة الخضراء والشواطئ الجميلة تجعل صلالة وجهة استثمارية متنامية.",
    nearbyServicesAr: ["مطار صلالة", "شاطئ الحافة", "أسواق صلالة", "مستشفيات", "فنادق"],
    relatedAreaSlugs: ["nizwa", "sohar"],
    tags: ["investment", "family"],
  },
  // ── Ash Sharqiyah South ────────────────────────────────────────────────────
  {
    id: "sur",
    slug: "sur",
    nameAr: "صور",
    nameEn: "Sur",
    governorateAr: "جنوب الشرقية",
    governorateId: "ash-sharqiyah-south",
    wilayatAr: "صور",
    wilayatId: "sur",
    avgSalePrice: 33000,
    avgRentPrice: 130,
    pricePerSqm: 240,
    rentalYield: 4.7,
    demandScore: 60,
    priceChangePct: 1.9,
    listingCount: 31,
    overviewAr: "صور مدينة ساحلية تاريخية جنوب شرق عُمان تشتهر ببناء القوارب الخشبية والسياحة الطبيعية. يعتبر سوق العقاراتها في مرحلة نمو مبكرة.",
    popularPropertyTypes: ["بيت عربي", "فيلا", "أرض"],
    suitableFor: ["investors", "families"],
    suitableForAr: ["المستثمرون", "العائلات"],
    lifestyleAr: "طبيعة بحرية خلابة وتراث عريق وحياة هادئة بعيدة عن ضجيج المدن.",
    nearbyServicesAr: ["شاطئ صور", "ميناء صور", "مدارس", "مستشفى", "أسواق"],
    relatedAreaSlugs: ["nizwa", "salalah"],
    tags: ["affordable", "family"],
  },
];

export const AREA_GUIDE_MAP: Record<string, AreaGuide> = Object.fromEntries(
  AREA_GUIDES.map((a) => [a.slug, a])
);

// Tag labels in Arabic
export const AREA_TAG_AR: Record<AreaGuide["tags"][number], string> = {
  investment: "استثمار",
  family: "عائلي",
  rental: "إيجار",
  luxury: "فاخر",
  affordable: "أسعار معقولة",
};

// Suitable-for filter labels
export const SUITABLE_FOR_AR: Record<string, string> = {
  families: "عائلات",
  investors: "مستثمرون",
  students: "طلاب",
  professionals: "محترفون",
};
