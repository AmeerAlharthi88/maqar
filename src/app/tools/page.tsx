import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "الأدوات المالية | مقر",
  description:
    "احسب القسط الشهري للتمويل العقاري، ومعدل العائد على الاستثمار، والعائد الإيجاري، وسعر المتر المربع في سلطنة عُمان.",
};

const TOOLS = [
  {
    href: "/tools/mortgage-calculator",
    title: "حاسبة التمويل العقاري",
    desc: "احسب القسط الشهري ومجمل التكاليف بناءً على السعر والدفعة الأولى ومدة القرض.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
    color: "#2471A3",
    bg: "bg-[#EAF4FB]",
  },
  {
    href: "/tools/roi-calculator",
    title: "حاسبة العائد على الاستثمار",
    desc: "قدِّر العائد الإجمالي والصافي وفترة الاسترداد لعقارك الاستثماري.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ),
    color: "#5B8C5A",
    bg: "bg-[#EDF4ED]",
  },
  {
    href: "/tools/rental-yield",
    title: "حاسبة العائد الإيجاري",
    desc: "احسب العائد الإجمالي والصافي وقارنه بمتوسط المنطقة المختارة.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    color: "#C65D3B",
    bg: "bg-[#FBF0EB]",
  },
  {
    href: "/tools/price-per-sqm",
    title: "حاسبة سعر المتر المربع",
    desc: "قارن سعر المتر المربع لعقارك بمتوسطات المناطق في سلطنة عُمان.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M2 9h20M9 21V9" />
      </svg>
    ),
    color: "#8E44AD",
    bg: "bg-[#F5EFF9]",
  },
];

export default function ToolsPage() {
  return (
    <AppShell>
      <div className="px-4 py-6 max-w-lg mx-auto" dir="rtl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#1E1E1E] mb-1">
            الأدوات المالية
          </h1>
          <p className="text-sm text-[#7A6B5E]">
            أدوات تقديرية لمساعدتك في اتخاذ قرارات عقارية مدروسة
          </p>
        </div>

        {/* Tool cards */}
        <div className="space-y-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex items-start gap-4 bg-white border border-[#F0EBE3] rounded-2xl p-4 active:bg-[#FAF7F4] transition-colors"
            >
              <div
                className={`w-11 h-11 rounded-2xl ${tool.bg} flex items-center justify-center flex-shrink-0`}
                style={{ color: tool.color }}
              >
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1E1E1E] mb-0.5">
                  {tool.title}
                </p>
                <p className="text-xs text-[#7A6B5E] leading-relaxed">
                  {tool.desc}
                </p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A89480"
                strokeWidth="2"
                strokeLinecap="round"
                className="flex-shrink-0 mt-0.5 rtl:rotate-180"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Market link */}
        <div className="mt-6 bg-[#FBF0EB] rounded-2xl p-4 border border-[#C65D3B]/20">
          <p className="text-sm font-semibold text-[#C65D3B] mb-1">
            تقارير السوق العقاري
          </p>
          <p className="text-xs text-[#7A6B5E] mb-3">
            اطّلع على إحصاءات وتوجهات السوق بالمحافظات والولايات.
          </p>
          <Link
            href="/market"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C65D3B]"
          >
            استعراض تقارير السوق
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="rtl:rotate-180">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-[11px] text-[#A89480] text-center leading-relaxed">
          جميع الحسابات تقديرية وللتوجيه فقط · ليست تقييماً رسمياً ·
          ليست موافقة تمويل · ليست نصيحة استثمارية
        </p>
      </div>
    </AppShell>
  );
}
