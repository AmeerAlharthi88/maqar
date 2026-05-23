"use client";

import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { ROLE_LABELS_AR } from "@/config/roles";
import type { AppRole } from "@/config/roles";
import { useFavoritesStore } from "@/store/favorites.store";
import { useRecentlyViewedStore } from "@/store/recently-viewed.store";

interface ProfileSnapshot {
  nameAr: string;
  phone: string;
  role: string;
  isVerified: boolean;
  verificationStatus: string;
  onboardingCompleted: boolean;
  avatarUrl?: string;
}

const QUICK_LINKS = [
  {
    href: ROUTES.favorites,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    labelAr: "المفضلة",
  },
  {
    href: ROUTES.recentlyViewed,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    labelAr: "المشاهدة مؤخراً",
  },
  {
    href: ROUTES.savedSearches,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    labelAr: "البحث المحفوظ",
  },
  {
    href: ROUTES.appointments,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    labelAr: "مواعيدي",
  },
  {
    href: ROUTES.offers,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    labelAr: "عروضي",
  },
  {
    href: ROUTES.requests,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    labelAr: "طلباتي",
  },
  {
    href: ROUTES.addListing,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    labelAr: "نشر إعلان",
  },
];

export function AccountDashboard({ profile }: { profile: ProfileSnapshot }) {
  const favCount = useFavoritesStore((s) => s._idsArray.length);
  const recentCount = useRecentlyViewedStore((s) => s.items.length);

  const isAgent = profile.role === "agent" || profile.role === "agency_admin";
  const roleLabel = ROLE_LABELS_AR[(profile.role as AppRole) ?? "user"];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24" dir="rtl">
      {/* Profile header card */}
      <div className="bg-white px-4 py-6 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-[#0A3C36] flex items-center justify-center flex-shrink-0">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.nameAr}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {profile.nameAr.slice(0, 1)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-[#102A43] truncate">{profile.nameAr}</h1>
              {profile.isVerified && (
                <span className="flex items-center gap-1 bg-[#E6F0EF] text-[#0A3C36] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  موثّق
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
            aria-label="الإعدادات"
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
            <p className="text-xs text-[#627D98] mt-0.5">في المفضلة</p>
          </div>
          <div className="bg-[#F0F4F8] rounded-2xl px-4 py-3 text-center">
            <p className="text-2xl font-bold text-[#102A43]">{recentCount}</p>
            <p className="text-xs text-[#627D98] mt-0.5">شوهدت مؤخراً</p>
          </div>
        </div>
      </div>

      {/* Verification banner (agents only, not yet verified) */}
      {isAgent && !profile.isVerified && (
        <div className="mx-4 mt-4 bg-[#FFF8E7] border border-[#D4A017]/30 rounded-2xl px-4 py-4">
          <div className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#102A43] mb-1">أكمل توثيق حسابك</p>
              <p className="text-xs text-[#627D98] leading-relaxed">
                لنشر إعلاناتك والحصول على شارة الوسيط الموثوق في مقر.
              </p>
            </div>
          </div>
          <Link
            href={ROUTES.agentVerification}
            className="mt-3 block w-full py-2.5 rounded-xl bg-[#D4A017] text-white font-bold text-sm text-center"
          >
            ابدأ التوثيق الآن
          </Link>
        </div>
      )}

      {/* Quick links grid */}
      <div className="px-4 mt-5">
        <p className="text-xs font-semibold text-[#627D98] mb-3 uppercase tracking-wide">
          الخدمات السريعة
        </p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl border border-[#E2E8F0] flex flex-col items-center gap-2 py-4 px-2 text-center"
            >
              <span className="text-[#627D98]">{item.icon}</span>
              <span className="text-[11px] font-semibold text-[#102A43] leading-tight">
                {item.labelAr}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
