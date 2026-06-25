import { ROUTES } from "./routes";

export interface BottomNavItem {
  href: string;
  labelAr: string;
  /** English label — only needed for items whose key has no i18n dictionary entry. */
  labelEn?: string;
  key: string;
  isAdd?: boolean;
}

export const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { key: "home",      href: ROUTES.home,      labelAr: "الرئيسية" },
  { key: "map",       href: ROUTES.map,       labelAr: "الخريطة" },
  { key: "add",       href: ROUTES.addListing, labelAr: "أضف",    isAdd: true },
  { key: "favorites", href: ROUTES.favorites,  labelAr: "المفضلة" },
  { key: "account",   href: ROUTES.account,    labelAr: "حسابي" },
];

export interface SidebarNavSection {
  titleAr: string;
  items: { href: string; labelAr: string; key: string }[];
}

export const AGENT_SIDEBAR: SidebarNavSection[] = [
  {
    titleAr: "الرئيسي",
    items: [
      { key: "dashboard",    href: ROUTES.agentDashboard,    labelAr: "لوحة التحكم" },
      { key: "listings",     href: ROUTES.agentListings,     labelAr: "إعلاناتي" },
      { key: "leads",        href: ROUTES.agentLeads,        labelAr: "العملاء المحتملون" },
    ],
  },
  {
    titleAr: "النشاط",
    items: [
      { key: "appointments", href: ROUTES.agentAppointments, labelAr: "المواعيد" },
      { key: "offers",       href: ROUTES.agentOffers,       labelAr: "العروض" },
      { key: "analytics",    href: ROUTES.agentAnalytics,    labelAr: "التحليلات" },
    ],
  },
  {
    titleAr: "الحساب",
    items: [
      { key: "verification", href: ROUTES.agentVerification, labelAr: "التحقق" },
      { key: "subscription", href: ROUTES.agentSubscription, labelAr: "الاشتراك" },
    ],
  },
];

export const AGENCY_SIDEBAR: SidebarNavSection[] = [
  {
    titleAr: "الرئيسي",
    items: [
      { key: "dashboard", href: ROUTES.agencyDashboard, labelAr: "لوحة التحكم" },
      { key: "listings",  href: ROUTES.agencyListings,  labelAr: "الإعلانات" },
      { key: "team",      href: ROUTES.agencyTeam,      labelAr: "الفريق" },
    ],
  },
  {
    titleAr: "النمو",
    items: [
      { key: "leads",     href: ROUTES.agencyLeads,     labelAr: "العملاء المحتملون" },
      { key: "analytics", href: ROUTES.agencyAnalytics, labelAr: "التحليلات" },
    ],
  },
  {
    titleAr: "الإعدادات",
    items: [
      { key: "settings",  href: ROUTES.agencySettings,  labelAr: "الإعدادات" },
    ],
  },
];

export const ADMIN_SIDEBAR: SidebarNavSection[] = [
  {
    titleAr: "المحتوى",
    items: [
      { key: "dashboard",   href: ROUTES.admin,             labelAr: "الرئيسية" },
      { key: "listings",    href: ROUTES.adminListings,     labelAr: "الإعلانات" },
      { key: "reviews",     href: ROUTES.adminReviews,      labelAr: "المراجعات" },
    ],
  },
  {
    titleAr: "الامتثال",
    items: [
      { key: "verification", href: ROUTES.adminVerification, labelAr: "التحقق" },
      { key: "aml",          href: ROUTES.adminAml,          labelAr: "مكافحة الغسيل" },
      { key: "duplicates",   href: ROUTES.adminDuplicates,   labelAr: "الإعلانات المكررة" },
      { key: "reports",      href: ROUTES.adminReports,      labelAr: "التقارير" },
    ],
  },
  {
    titleAr: "المستخدمون",
    items: [
      { key: "users",     href: ROUTES.adminUsers,     labelAr: "المستخدمون" },
      { key: "agencies",  href: ROUTES.adminAgencies,  labelAr: "الوكالات" },
    ],
  },
  {
    titleAr: "النظام",
    items: [
      { key: "market",        href: ROUTES.adminMarketData,    labelAr: "بيانات السوق" },
      { key: "subscriptions", href: ROUTES.adminSubscriptions, labelAr: "الاشتراكات" },
      { key: "audit",         href: ROUTES.adminAuditLogs,     labelAr: "سجلات النظام" },
    ],
  },
];
