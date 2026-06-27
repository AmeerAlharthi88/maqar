"use client";

import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/shell/AppHeader";
import { ROUTES } from "@/config/routes";
import { useTranslation } from "@/i18n/useTranslation";

/**
 * Restricted-access screen shown when a signed-in non-admin reaches an /admin
 * route. Rendered server-side by the admin layout (so the admin shell/nav/tools
 * are never streamed to non-admins) and mirrored by the client AdminDashboardShell
 * guard as defense-in-depth (FP15).
 */
export function AdminRestricted() {
  const { locale, dir } = useTranslation();
  const isAr = locale === "ar";
  return (
    <AppShell>
      <AppHeader variant="back" titleAr="لوحة الإدارة" titleEn="Admin" backHref={ROUTES.account} />
      <div className="px-4 py-12 text-center" dir={dir}>
        <div className="w-16 h-16 rounded-full bg-[#0A3C36]/10 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="1.8">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 className="text-base font-bold text-[#102A43] mb-2">
          {isAr ? "وصول مقيّد" : "Restricted access"}
        </h2>
        <p className="text-sm text-[#627D98] mb-2 leading-relaxed">
          {isAr
            ? "هذه المنطقة خاصة بمشرفي منصة مقر فقط."
            : "This area is for Maqar platform admins only."}
        </p>
        <p className="text-xs text-[#627D98]">
          {isAr
            ? "إذا كنت مشرفاً وتواجه هذه الرسالة، تواصل مع فريق التقنية."
            : "If you're an admin and seeing this, contact the technical team."}
        </p>
      </div>
    </AppShell>
  );
}
