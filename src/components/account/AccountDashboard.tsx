"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { ROLE_LABELS_AR, ROLE_LABELS_EN } from "@/config/roles";
import type { AppRole } from "@/config/roles";
import { useFavoritesStore } from "@/store/favorites.store";
import { useRecentlyViewedStore } from "@/store/recently-viewed.store";
import { useLocaleStore } from "@/store/locale.store";
import { safeDisplayName, safeInitial } from "@/lib/display-name";

interface ProfileSnapshot {
  nameAr: string;
  phone: string;
  role: string;
  isVerified: boolean;
  verificationStatus: string;
  onboardingCompleted: boolean;
  avatarUrl?: string;
}

// ── Admin quick links (all routes verified to exist) ─────────────────────────
const ADMIN_QUICK_LINKS = [
  {
    href: ROUTES.admin,
    labelAr: "لوحة الإدارة",
    labelEn: "Admin Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: ROUTES.adminListings,
    labelAr: "مراجعة الإعلانات",
    labelEn: "Review Listings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: ROUTES.adminReports,
    labelAr: "البلاغات",
    labelEn: "Reports",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    href: ROUTES.adminVerification,
    labelAr: "التوثيق",
    labelEn: "Verification",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    href: ROUTES.adminUsers,
    labelAr: "المستخدمون",
    labelEn: "Users",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: ROUTES.adminAuditLogs,
    labelAr: "سجل التدقيق",
    labelEn: "Audit Logs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
];

// ── Agent quick links ─────────────────────────────────────────────────────────
const AGENT_QUICK_LINKS = [
  {
    href: ROUTES.agentListings,
    labelAr: "إعلاناتي",
    labelEn: "My Listings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: ROUTES.addListing,
    labelAr: "نشر إعلان",
    labelEn: "Add Property",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
  {
    href: ROUTES.requests,
    labelAr: "طلباتي",
    labelEn: "My Requests",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    href: ROUTES.offers,
    labelAr: "عروضي",
    labelEn: "My Offers",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: ROUTES.appointments,
    labelAr: "مواعيدي",
    labelEn: "My Appointments",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: ROUTES.agentVerification,
    labelAr: "طلب التوثيق",
    labelEn: "Verification",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

// ── Buyer / user quick links ───────────────────────────────────────────────────
const BUYER_QUICK_LINKS = [
  {
    href: ROUTES.favorites,
    labelAr: "المفضلة",
    labelEn: "Favorites",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    href: ROUTES.recentlyViewed,
    labelAr: "المشاهدة مؤخراً",
    labelEn: "Recently Viewed",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: ROUTES.savedSearches,
    labelAr: "البحث المحفوظ",
    labelEn: "Saved Searches",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    href: ROUTES.appointments,
    labelAr: "مواعيدي",
    labelEn: "My Appointments",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: ROUTES.offers,
    labelAr: "عروضي",
    labelEn: "My Offers",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    href: ROUTES.requests,
    labelAr: "طلباتي",
    labelEn: "My Requests",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

// ── Quick link card ───────────────────────────────────────────────────────────
function QuickLinkCard({
  href,
  icon,
  label,
  accent = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-2xl border flex flex-col items-center gap-2 py-4 px-2 text-center",
        accent
          ? "bg-[#0A3C36]/5 border-[#0A3C36]/20"
          : "bg-white border-[#E2E8F0]",
      ].join(" ")}
    >
      <span className={accent ? "text-[#0A3C36]" : "text-[#627D98]"}>{icon}</span>
      <span className="text-[11px] font-semibold text-[#102A43] leading-tight">
        {label}
      </span>
    </Link>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <p className="text-xs font-semibold text-[#627D98] mb-3 uppercase tracking-wide">
      {label}
    </p>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function AccountDashboard({ profile }: { profile: ProfileSnapshot }) {
  const favCount = useFavoritesStore((s) => s._idsArray.length);
  const recentCount = useRecentlyViewedStore((s) => s.items.length);
  const locale = useLocaleStore((s) => s.locale);
  const isAr = locale === "ar";

  // Guard against corrupted/encoding-broken names ("?????") — show a clean
  // localized fallback instead of question marks. Display-only.
  const displayName = safeDisplayName(profile.nameAr, locale);
  const avatarInitial = safeInitial(profile.nameAr, locale);

  const isAdmin = profile.role === "admin" || profile.role === "super_admin";
  const isAgent = profile.role === "agent" || profile.role === "agency_admin";

  const roleKey = (profile.role as AppRole) ?? "user";
  const roleLabel = isAr
    ? (ROLE_LABELS_AR[roleKey] ?? ROLE_LABELS_AR.user)
    : (ROLE_LABELS_EN[roleKey] ?? ROLE_LABELS_EN.user);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24" dir="rtl">
      {/* ── Profile header card ───────────────────────────────────────────── */}
      <div className="bg-white px-4 py-6 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#0A3C36] flex items-center justify-center flex-shrink-0">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {avatarInitial}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-[#102A43] truncate">{displayName}</h1>
              {profile.isVerified && (
                <span className="flex items-center gap-1 bg-[#E6F0EF] text-[#0A3C36] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {isAr ? "موثّق" : "Verified"}
                </span>
              )}
            </div>
            <p className="text-sm text-[#627D98] mt-0.5" dir="ltr">{profile.phone}</p>
            <p className="text-xs text-[#627D98] mt-0.5">{roleLabel}</p>
          </div>

          {/* Settings link */}
          <Link
            href={ROUTES.accountSettings}
            className="w-9 h-9 rounded-xl bg-[#F0F4F8] flex items-center justify-center flex-shrink-0"
            aria-label={isAr ? "الإعدادات" : "Settings"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-[#F0F4F8] rounded-2xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-[#0A3C36]">{favCount}</p>
            <p className="text-xs text-[#627D98] mt-0.5">{isAr ? "في المفضلة" : "Favorites"}</p>
          </div>
          <div className="bg-[#F0F4F8] rounded-2xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-[#102A43]">{recentCount}</p>
            <p className="text-xs text-[#627D98] mt-0.5">{isAr ? "شوهدت مؤخراً" : "Recently Viewed"}</p>
          </div>
        </div>
      </div>

      {/* ── Agent verification banner ─────────────────────────────────────── */}
      {isAgent && !profile.isVerified && (
        <div className="mx-4 mt-4 bg-[#FFF8E7] border border-[#D4A017]/30 rounded-2xl px-4 py-4">
          <div className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#102A43] mb-1">
                {isAr ? "أكمل توثيق حسابك" : "Complete your verification"}
              </p>
              <p className="text-xs text-[#627D98] leading-relaxed">
                {isAr
                  ? "لنشر إعلاناتك والحصول على شارة الوسيط الموثوق في مقر."
                  : "Publish listings and get the verified agent badge on Maqar."}
              </p>
            </div>
          </div>
          <Link
            href={ROUTES.agentVerification}
            className="mt-3 block w-full py-2.5 rounded-xl bg-[#D4A017] text-white font-bold text-sm text-center"
          >
            {isAr ? "ابدأ التوثيق الآن" : "Start verification"}
          </Link>
        </div>
      )}

      {/* ── Admin tools section (admin / super_admin only) ────────────────── */}
      {isAdmin && (
        <div className="px-4 mt-5">
          <SectionHeader label={isAr ? "أدوات الإدارة" : "Admin Tools"} />
          <div className="grid grid-cols-3 gap-2">
            {ADMIN_QUICK_LINKS.map((item) => (
              <QuickLinkCard
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={isAr ? item.labelAr : item.labelEn}
                accent
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Agent tools section (agent / agency_admin only) ──────────────── */}
      {isAgent && (
        <div className="px-4 mt-5">
          <SectionHeader label={isAr ? "أدوات الوسيط" : "Agent Tools"} />
          <div className="grid grid-cols-3 gap-2">
            {AGENT_QUICK_LINKS.map((item) => (
              <QuickLinkCard
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={isAr ? item.labelAr : item.labelEn}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Buyer / general services (all roles — admin sees below admin tools) */}
      {!isAgent && (
        <div className="px-4 mt-5">
          <SectionHeader label={isAr ? "الخدمات السريعة" : "Quick Services"} />
          <div className="grid grid-cols-3 gap-2">
            {BUYER_QUICK_LINKS.map((item) => (
              <QuickLinkCard
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={isAr ? item.labelAr : item.labelEn}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
