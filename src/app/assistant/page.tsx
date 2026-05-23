import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AIChatPanel } from "@/components/ai/AIChatPanel";

export const metadata: Metadata = {
  title: "المساعد العقاري | مقر",
  description: "اسأل مساعد مقر العقاري الذكي عن أسعار العقارات والمناطق والاستثمار في سلطنة عُمان.",
};

export default function AssistantPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100dvh-64px)]" dir="rtl">
        {/* Page header */}
        <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E6F0EF] border border-[#0A3C36]/20 flex items-center justify-center flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0A3C36"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#102A43]">مساعد مقر العقاري</h1>
              <p className="text-[10px] text-[#627D98]">
                مساعد إرشادي — ليس نصيحة مالية أو قانونية رسمية
              </p>
            </div>
          </div>
        </div>

        {/* Chat panel — fills remaining space */}
        <div className="flex-1 min-h-0 overflow-hidden bg-[#F8F9FA]">
          <AIChatPanel />
        </div>
      </div>
    </AppShell>
  );
}
