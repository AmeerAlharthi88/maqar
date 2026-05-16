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
        <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-[#F0EBE3]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#FBF0EB] border border-[#C65D3B]/20 flex items-center justify-center flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C65D3B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#1E1E1E]">مساعد مقر العقاري</h1>
              <p className="text-[10px] text-[#A89480]">
                مساعد إرشادي — ليس نصيحة مالية أو قانونية رسمية
              </p>
            </div>
          </div>
        </div>

        {/* Chat panel — fills remaining space */}
        <div className="flex-1 min-h-0 overflow-hidden bg-[#FAF7F4]">
          <AIChatPanel />
        </div>
      </div>
    </AppShell>
  );
}
