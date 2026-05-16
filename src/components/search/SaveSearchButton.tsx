"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";
import { useSearchStore } from "@/store/search.store";
import { Dialog } from "@/components/ui/Dialog";

interface SaveSearchButtonProps {
  className?: string;
}

export function SaveSearchButton({ className }: SaveSearchButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const { activeFilterCount } = useSearchStore();
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
    // Phase 6: persist to Supabase
    setSaved(true);
    setShowSaveForm(false);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <>
      <button
        onClick={handleSave}
        className={cn(
          "flex items-center gap-2 px-3 h-9 rounded-xl text-xs font-semibold",
          "border border-[#E8DDD0] bg-white text-[#7A6B5E] hover:border-[#C65D3B] hover:text-[#C65D3B]",
          "transition-colors whitespace-nowrap",
          saved && "bg-[#EAF4EB] border-[#5B8C5A] text-[#5B8C5A]",
          className
        )}
        aria-label="حفظ البحث الحالي"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        {saved ? "تم الحفظ" : "حفظ البحث"}
      </button>

      {/* Login required */}
      <Dialog
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        title="تسجيل الدخول مطلوب"
        description="سجّل دخولك لحفظ بحثك وتلقّي إشعارات بالعقارات الجديدة المطابقة."
        confirmLabel="تسجيل الدخول"
        onConfirm={() => {
          setShowLoginPrompt(false);
          // Phase 6: redirect to login
        }}
        cancelLabel="لاحقاً"
      />

      {/* Save form */}
      <Dialog
        open={showSaveForm}
        onClose={() => setShowSaveForm(false)}
        title="حفظ البحث"
        description="سيتم إشعارك عند توفر عقارات جديدة تطابق بحثك."
        confirmLabel="حفظ"
        onConfirm={confirmSave}
        cancelLabel="إلغاء"
      >
        <div className="px-5 py-3">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="اسم البحث (اختياري)"
            dir="rtl"
            className="w-full h-11 px-4 rounded-xl border border-[#E8DDD0] text-sm text-[#1E1E1E] placeholder:text-[#A89480] outline-none focus:border-[#C65D3B]"
          />
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-xs font-semibold text-[#7A6B5E]">إشعارات عبر</p>
            <div className="flex gap-3">
              {["واتساب", "البريد الإلكتروني", "داخل التطبيق"].map((m) => (
                <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked={m === "داخل التطبيق"} className="accent-[#C65D3B]" />
                  <span className="text-xs text-[#7A6B5E]">{m}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
