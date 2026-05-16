"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
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
        <p className="text-sm font-semibold text-[#1E1E1E]">{label}</p>
        {desc && <p className="text-xs text-[#A89480] mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
          checked ? "bg-[#C65D3B]" : "bg-[#E8DDD0]",
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
    <div className="bg-white rounded-2xl border border-[#F0EBE3] px-4 overflow-hidden">
      <p className="text-xs font-bold text-[#A89480] uppercase tracking-wide pt-4 pb-2">
        {title}
      </p>
      <div className="divide-y divide-[#F0EBE3]">{children}</div>
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
    await signOut();
    signOutLocal();
    router.replace("/");
  }

  return (
    <div className="min-h-screen bg-[#FAF7F4] pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#F0EBE3] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <h1 className="text-sm font-bold text-[#1E1E1E]">الإعدادات</h1>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Personal info */}
        <Section title="المعلومات الشخصية">
          <div className="py-3.5">
            <label className="block text-xs font-semibold text-[#7A6B5E] mb-1.5">
              الاسم بالعربية
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-[#E8DDD0] bg-white text-sm text-[#1E1E1E] outline-none focus:border-[#C65D3B]"
              />
              <button
                onClick={handleSaveName}
                disabled={nameAr.trim().length < 2 || isSavingName}
                className="px-4 py-2.5 rounded-xl bg-[#C65D3B] text-white text-xs font-bold disabled:opacity-50"
              >
                {nameSaved ? "✓" : isSavingName ? "..." : "حفظ"}
              </button>
            </div>
          </div>
          <div className="py-3.5">
            <p className="text-xs font-semibold text-[#7A6B5E] mb-1">رقم الجوال</p>
            <p className="text-sm text-[#1E1E1E] font-bold" dir="ltr">
              {user?.phone ?? profile?.phone ?? "—"}
            </p>
            <p className="text-xs text-[#A89480] mt-0.5">لا يمكن تغيير رقم الجوال حالياً</p>
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
              <span className="text-sm text-[#1E1E1E]">{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A89480" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </a>
          ))}
        </Section>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full py-3.5 rounded-2xl bg-[#FBF0EB] text-[#C65D3B] font-bold text-sm border border-[#C65D3B]/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSigningOut ? (
            <span className="w-4 h-4 rounded-full border-2 border-[#C65D3B]/30 border-t-[#C65D3B] animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          )}
          تسجيل الخروج
        </button>

        <p className="text-center text-[10px] text-[#C4B5A5]">مقر — النسخة 1.0.0</p>
      </div>
    </div>
  );
}
