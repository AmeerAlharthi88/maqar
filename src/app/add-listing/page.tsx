import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AddListingShell } from "@/components/add-listing/AddListingShell";

export const metadata: Metadata = {
  title: "نشر إعلان عقاري | مقر",
  description: "أضف إعلانك العقاري في مقر بخطوات سهلة وسريعة — بيع، إيجار، أو استثمار.",
};

export default function AddListingPage() {
  return (
    <AppShell>
      <div className="bg-white border-b border-[#F0EBE3] px-4 py-3 flex items-center gap-3" dir="rtl">
        <div className="w-8 h-8 rounded-xl bg-[#C65D3B] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-[#1E1E1E]">نشر إعلان عقاري</h1>
          <p className="text-xs text-[#A89480]">أكمل الخطوات لنشر إعلانك</p>
        </div>
      </div>
      <AddListingShell />
    </AppShell>
  );
}
