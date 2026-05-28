"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { useSearchStore } from "@/store/search.store";
import { Dialog } from "@/components/ui/Dialog";
import { useTranslation } from "@/i18n/useTranslation";

interface SaveSearchButtonProps {
  className?: string;
}

export function SaveSearchButton({ className }: SaveSearchButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const { activeFilterCount } = useSearchStore();
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [searchName, setSearchName] = useState("");

  if (activeFilterCount === 0) return null;

  function handleSave() {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowSaveForm(true);
  }

  function confirmSave() {
    setSaved(true);
    setShowSaveForm(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const notificationMethods = isAr
    ? ["واتساب", "البريد الإلكتروني", "داخل التطبيق"]
    : ["WhatsApp", "Email", "In-App"];

  return (
    <>
      <button
        onClick={handleSave}
        className={cn(
          "flex items-center gap-2 px-3 h-9 rounded-xl text-xs font-semibold",
          "border border-[#E2E8F0] bg-white text-[#627D98] hover:border-[#0A3C36] hover:text-[#0A3C36]",
          "transition-colors whitespace-nowrap",
          saved && "bg-[#E6F0EF] border-[#0A3C36] text-[#0A3C36]",
          className
        )}
        aria-label={t("search.saveSearch")}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        {saved ? t("search.savedSearch") : t("search.saveSearch")}
      </button>

      {/* Login required */}
      <Dialog
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title={t("auth.loginRequired.title")}
        description={isAr
          ? "سجّل دخولك لحفظ بحثك وتلقّي إشعارات بالعقارات الجديدة المطابقة."
          : "Sign in to save your search and get notified of new matching properties."}
        confirmLabel={t("auth.loginRequired.cta")}
        onConfirm={() => {
          setShowLoginPrompt(false);
        }}
        cancelLabel={t("common.cancel")}
      />

      {/* Save form */}
      <Dialog
        open={showSaveForm}
        onClose={() => setShowSaveForm(false)}
        title={t("search.saveSearch")}
        description={isAr
          ? "سيتم إشعارك عند توفر عقارات جديدة تطابق بحثك."
          : "You'll be notified when new matching properties are available."}
        confirmLabel={t("common.save")}
        onConfirm={confirmSave}
        cancelLabel={t("common.cancel")}
      >
        <div className="px-5 py-3">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder={isAr ? "اسم البحث (اختياري)" : "Search name (optional)"}
            className="w-full h-11 px-4 rounded-xl border border-[#E2E8F0] text-sm text-[#102A43] placeholder:text-[#627D98] outline-none focus:border-[#0A3C36]"
          />
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-xs font-semibold text-[#627D98]">
              {isAr ? "إشعارات عبر" : "Notify via"}
            </p>
            <div className="flex gap-3">
              {notificationMethods.map((m, i) => (
                <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked={i === 2} className="accent-[#0A3C36]" />
                  <span className="text-xs text-[#627D98]">{m}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
