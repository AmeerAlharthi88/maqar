"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useAddListingStore } from "@/store/add-listing.store";
import { updateProfile } from "@/lib/supabase/profile";
import { signOut } from "@/lib/supabase/auth-actions";
import type { NotificationPreferences } from "@/types/profile";

// ── Toggle row ────────────────────────────────────────────────────────────────
function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#102A43]">{label}</p>
        {desc && <p className="text-xs text-[#627D98] mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
          checked ? "bg-[#0A3C36]" : "bg-[#E2E8F0]",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all",
            checked ? "right-0.5" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 overflow-hidden">
      <p className="text-xs font-bold text-[#627D98] uppercase tracking-wide pt-4 pb-2">
        {title}
      </p>
      <div className="divide-y divide-[#E2E8F0]">{children}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function AccountSettings() {
  const router = useRouter();
  const { user, profile, updateProfileLocal, signOutLocal } = useAuthStore();

  const [nameAr, setNameAr] = useState(profile?.nameAr ?? user?.nameAr ?? "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const notifPrefs: NotificationPreferences = profile?.notificationPreferences ?? {
    newListingsInSavedSearch: true,
    priceDropAlerts: true,
    appointmentReminders: true,
    offerUpdates: true,
    marketDigest: false,
    smsEnabled: true,
    pushEnabled: true,
  };

  async function handleSaveName() {
    if (nameAr.trim().length < 2 || isSavingName) return;
    setIsSavingName(true);
    const { error } = await updateProfile({ nameAr: nameAr.trim() });
    if (!error) {
      updateProfileLocal({ nameAr: nameAr.trim() });
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    }
    setIsSavingName(false);
  }

  async function handleToggleNotif(
    key: keyof NotificationPreferences,
    value: boolean
  ) {
    const updated = { ...notifPrefs, [key]: value };
    updateProfileLocal({ notificationPreferences: updated });
    await updateProfile({ notificationPreferences: updated });
  }

  async function handleSignOut() {
    setIsSigningOut(true);

    // Fire-and-forget the Supabase server-side revocation.
    // We don't await it because supabase.auth.signOut() can hang
    // (Web Locks deadlock in the browser). The local state and cookies
    // are cleared below regardless.
    signOut().catch(() => {});

    // Immediately clear the auth cookies so the session cannot be
    // re-hydrated on the next page load. The storage key format used
    // by @supabase/ssr is: sb-{project_ref}-auth-token.{chunk}
    try {
      const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL
        ?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
      if (projectRef && typeof document !== "undefined") {
        const cookieBase = `sb-${projectRef}-auth-token`;
        [0, 1, 2].forEach((i) => {
          document.cookie = `${cookieBase}.${i}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
        });
        // Also clear the non-chunked variant
        document.cookie = `${cookieBase}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
      }
    } catch {
      // Cookie clearing is best-effort — never block the sign-out flow
    }

    signOutLocal();
    // Wipe the in-progress listing draft from this device so it can never
    // resurface for the next account that signs in here.
    useAddListingStore.getState().reconcileOwner(null);
    router.replace("/");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#102A43" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <h1 className="text-sm font-bold text-[#102A43]">الإعدادات</h1>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Personal info */}
        <Section title="المعلومات الشخصية">
          <div className="py-3.5">
            <label className="block text-xs font-semibold text-[#627D98] mb-1.5">
              الاسم بالعربية
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#102A43] outline-none focus:border-[#0A3C36]"
              />
              <button
                onClick={handleSaveName}
                disabled={nameAr.trim().length < 2 || isSavingName}
                className="px-4 py-2.5 rounded-xl bg-[#0A3C36] text-white text-xs font-bold disabled:bg-[#A0AEC0] disabled:cursor-not-allowed"
              >
                {nameSaved ? "✓" : isSavingName ? "..." : "حفظ"}
              </button>
            </div>
          </div>
          <div className="py-3.5">
            <p className="text-xs font-semibold text-[#627D98] mb-1">رقم الجوال</p>
            <p className="text-sm text-[#102A43] font-bold" dir="ltr">
              {user?.phone ?? profile?.phone ?? "—"}
            </p>
            <p className="text-xs text-[#627D98] mt-0.5">لا يمكن تغيير رقم الجوال حالياً</p>
          </div>
        </Section>

        {/* Notification prefs */}
        <Section title="الإشعارات">
          <Toggle
            label="بحث محفوظ"
            desc="إشعار عند ظهور عقارات جديدة في بحثك المحفوظ"
            checked={notifPrefs.newListingsInSavedSearch}
            onChange={(v) => handleToggleNotif("newListingsInSavedSearch", v)}
          />
          <Toggle
            label="تنبيهات انخفاض السعر"
            desc="إشعار عند انخفاض سعر عقار في المفضلة"
            checked={notifPrefs.priceDropAlerts}
            onChange={(v) => handleToggleNotif("priceDropAlerts", v)}
          />
          <Toggle
            label="تذكير المواعيد"
            checked={notifPrefs.appointmentReminders}
            onChange={(v) => handleToggleNotif("appointmentReminders", v)}
          />
          <Toggle
            label="تحديثات العروض"
            checked={notifPrefs.offerUpdates}
            onChange={(v) => handleToggleNotif("offerUpdates", v)}
          />
          <Toggle
            label="ملخص السوق الأسبوعي"
            checked={notifPrefs.marketDigest}
            onChange={(v) => handleToggleNotif("marketDigest", v)}
          />
        </Section>

        {/* Channels */}
        <Section title="قنوات الإشعارات">
          <Toggle
            label="رسائل SMS"
            checked={notifPrefs.smsEnabled}
            onChange={(v) => handleToggleNotif("smsEnabled", v)}
          />
          <Toggle
            label="إشعارات التطبيق"
            checked={notifPrefs.pushEnabled}
            onChange={(v) => handleToggleNotif("pushEnabled", v)}
          />
        </Section>

        {/* Legal links */}
        <Section title="القانونية والمساعدة">
          {[
            { href: "/terms", label: "شروط الاستخدام" },
            { href: "/privacy", label: "سياسة الخصوصية" },
            { href: "/listing-policy", label: "سياسة النشر" },
            { href: "/about", label: "عن مقر" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center justify-between py-3.5"
            >
              <span className="text-sm text-[#102A43]">{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </a>
          ))}
        </Section>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full py-3.5 rounded-2xl bg-[#FEF0EE] text-[#C0392B] font-bold text-sm border border-[#C0392B]/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSigningOut ? (
            <span className="w-4 h-4 rounded-full border-2 border-[#C0392B]/30 border-t-[#C0392B] animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          )}
          تسجيل الخروج
        </button>

        <p className="text-center text-[10px] text-[#627D98]">مقر — النسخة 1.0.0</p>
      </div>
    </div>
  );
}
