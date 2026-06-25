"use client";

// ── Admin System Readiness — Phase 15 ────────────────────────────────────────
// Production readiness checklist for the admin team.
// All items are manually verified — no live probing of external services.
// ─────────────────────────────────────────────────────────────────────────────

import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";
import { useLocaleStore } from "@/store/locale.store";
import { bi } from "@/lib/admin/labels";

type CheckStatus = "done" | "partial" | "todo" | "blocked";

interface ReadinessItem {
  category: string;
  item: string;
  status: CheckStatus;
  noteAr?: string;
}

const STATUS_CONFIG: Record<CheckStatus, { labelAr: string; labelEn: string; color: string; bg: string; icon: string }> = {
  done: { labelAr: "مكتمل", labelEn: "Done", color: "text-[#0A3C36]", bg: "bg-[#E6F0EF]", icon: "✓" },
  partial: { labelAr: "جزئي", labelEn: "Partial", color: "text-[#C8860A]", bg: "bg-[#FEF9EC]", icon: "◑" },
  todo: { labelAr: "مطلوب", labelEn: "To do", color: "text-[#627D98]", bg: "bg-[#F0F4F8]", icon: "○" },
  blocked: { labelAr: "محظور", labelEn: "Blocked", color: "text-[#C0392B]", bg: "bg-[#FEF0EE]", icon: "✕" },
};

// English headers for the (internal, non-nav) readiness categories. The detailed
// checklist item text is technical documentation kept in Arabic.
const CATEGORY_EN: Record<string, string> = {
  "المصادقة": "Authentication",
  "المدفوعات": "Payments",
  "PWA": "PWA",
  "SEO": "SEO",
  "الوضع الغير متصل": "Offline",
  "جودة الكود": "Code quality",
  "الأداء": "Performance",
  "إمكانية الوصول": "Accessibility",
  "المتغيرات البيئية": "Environment",
  "الأمان": "Security",
  "الاختبار": "Testing",
};

const CHECKLIST: ReadinessItem[] = [
  // ── Authentication ──────────────────────────────────────────────────────────
  { category: "المصادقة", item: "Supabase Auth مُهيَّأ (OTP / رقم الهاتف)", status: "partial", noteAr: "بيانات وهمية — يحتاج مفاتيح Supabase حقيقية" },
  { category: "المصادقة", item: "RLS مُفعَّل على جميع جداول Supabase الحساسة", status: "todo", noteAr: "يُنفَّذ عند ربط قاعدة البيانات الحقيقية — راجع docs/SUPABASE_SETUP.md" },
  { category: "المصادقة", item: "SUPABASE_SERVICE_ROLE_KEY محفوظ server-side فقط", status: "done" },
  { category: "المصادقة", item: "لا يوجد NEXT_PUBLIC_ لأي مفتاح حساس", status: "done" },

  // ── Payments ────────────────────────────────────────────────────────────────
  { category: "المدفوعات", item: "PAYMENT_PROVIDER=mock (لا معالجة حقيقية)", status: "done", noteAr: "يتحول إلى stripe/thawani عند الإنتاج — راجع docs/PAYMENTS_SETUP.md" },
  { category: "المدفوعات", item: "Stripe Secret Key server-side فقط", status: "done", noteAr: "STRIPE_SECRET_KEY لا يحمل NEXT_PUBLIC_" },
  { category: "المدفوعات", item: "Webhook endpoint لتأكيد الاشتراكات", status: "todo", noteAr: "يُنفَّذ مع تكامل Stripe/Thawani الحقيقي" },
  { category: "المدفوعات", item: "التحقق من حالة الدفع server-side دائماً", status: "done", noteAr: "العميل لا يُثق بحالة الدفع من client" },

  // ── PWA ─────────────────────────────────────────────────────────────────────
  { category: "PWA", item: "manifest.webmanifest مع اختصارات التطبيق", status: "done" },
  { category: "PWA", item: "Service Worker في /public/sw.js", status: "done" },
  { category: "PWA", item: "صفحة /offline مخزّنة مسبقاً في SW", status: "done" },
  { category: "PWA", item: "أيقونات SVG في /icons/ (192، 512، maskable، apple)", status: "partial", noteAr: "SVG placeholders جاهزة — استبدل بـ PNG حقيقية قبل الإنتاج" },
  { category: "PWA", item: "HTTPS مُفعَّل في بيئة الإنتاج", status: "todo", noteAr: "Vercel يوفره تلقائياً عند النشر" },

  // ── SEO ─────────────────────────────────────────────────────────────────────
  { category: "SEO", item: "sitemap.xml ديناميكي يشمل جميع الصفحات العامة", status: "done" },
  { category: "SEO", item: "robots.txt يحجب /account/ و/admin/ و/agent/", status: "done" },
  { category: "SEO", item: "noindex على تخطيطات /account و/admin و/agent", status: "done" },
  { category: "SEO", item: "JSON-LD (Organization, Listing, Agent, FAQ, Breadcrumb)", status: "done" },
  { category: "SEO", item: "صفحات دليل المناطق (11 منطقة عُمانية)", status: "done" },
  { category: "SEO", item: "OG image حقيقية بحجم 1200×630 بكسل", status: "partial", noteAr: "SVG placeholder جاهز — ارفع PNG حقيقية قبل الإنتاج" },

  // ── Offline ──────────────────────────────────────────────────────────────────
  { category: "الوضع الغير متصل", item: "قائمة الانتظار (offline queue) مع status field", status: "done" },
  { category: "الوضع الغير متصل", item: "المفضلة تعمل بدون إنترنت (optimistic)", status: "done" },
  { category: "الوضع الغير متصل", item: "العقارات المُشاهَدة مخزّنة محلياً", status: "done" },
  { category: "الوضع الغير متصل", item: "حظر إرسال الإعلان أثناء عدم الاتصال", status: "done" },
  { category: "الوضع الغير متصل", item: "مركز المزامنة /account/sync", status: "done" },

  // ── Code Quality ─────────────────────────────────────────────────────────────
  { category: "جودة الكود", item: "TypeScript 0 أخطاء (npx tsc --noEmit)", status: "done" },
  { category: "جودة الكود", item: "ESLint 0 أخطاء (12 خطأ تم إصلاحها في Phase 17)", status: "done" },
  { category: "جودة الكود", item: "لا يوجد Math.random() في render — تم استبداله بـ useId()", status: "done" },
  { category: "جودة الكود", item: "لا يوجد setState في effect بشكل متزامن — تم تصحيحه", status: "done" },
  { category: "جودة الكود", item: "hooks قبل early returns في جميع المكوّنات", status: "done" },

  // ── Performance ──────────────────────────────────────────────────────────────
  { category: "الأداء", item: "Recharts يُحمَّل ديناميكياً (SSR: false)", status: "done" },
  { category: "الأداء", item: "صور العقارات بتنسيق WebP مع lazy loading", status: "partial", noteAr: "تُنفَّذ مع رفع الصور الحقيقية" },
  { category: "الأداء", item: "Font subsetting — IBM Plex Sans Arabic فقط", status: "done" },

  // ── Accessibility ────────────────────────────────────────────────────────────
  { category: "إمكانية الوصول", item: "dir=rtl على جميع المكوّنات", status: "done" },
  { category: "إمكانية الوصول", item: "aria-label على جميع الأزرار الأيقونية", status: "partial", noteAr: "بعض الأيقونات قد تحتاج مراجعة دورية" },
  { category: "إمكانية الوصول", item: "min-h-[44px] على عناصر اللمس", status: "done" },
  { category: "إمكانية الوصول", item: "role وaria-live للإشعارات الحية", status: "done" },

  // ── Environment ──────────────────────────────────────────────────────────────
  { category: "المتغيرات البيئية", item: ".env.example محدَّث بجميع المتغيرات مع تعليقات", status: "done" },
  { category: "المتغيرات البيئية", item: "ANTHROPIC_API_KEY server-side فقط — راجع docs/AI_SETUP.md", status: "done" },
  { category: "المتغيرات البيئية", item: "متغيرات الإنتاج مُعيَّنة في Vercel", status: "todo", noteAr: "راجع docs/DEPLOYMENT_CHECKLIST.md قبل النشر" },

  // ── Security ─────────────────────────────────────────────────────────────────
  { category: "الأمان", item: "لا يوجد بيانات حساسة في localStorage", status: "done" },
  { category: "الأمان", item: "لا يوجد بيانات حساسة في SW cache", status: "done" },
  { category: "الأمان", item: "NEVER_CACHE_PATTERNS تحمي /api/auth و/api/payment", status: "done" },
  { category: "الأمان", item: "Content Security Policy (CSP) headers", status: "todo", noteAr: "يُضاف في next.config عند الإنتاج" },
  { category: "الأمان", item: "Rate limiting على API routes الحساسة", status: "todo", noteAr: "يُنفَّذ مع Supabase Edge Functions" },

  // ── Testing ──────────────────────────────────────────────────────────────────
  { category: "الاختبار", item: "Next.js build ناجح بلا أخطاء", status: "done" },
  { category: "الاختبار", item: "اختبارات دخان (smoke tests) — راجع docs/SMOKE_TEST_CHECKLIST.md", status: "todo", noteAr: "يُنفَّذ يدوياً قبل كل إصدار" },
  { category: "الاختبار", item: "اختبارات وحدة (unit tests)", status: "todo", noteAr: "مقترح لما بعد الإطلاق" },
  { category: "الاختبار", item: "اختبارات نهاية-لنهاية (E2E)", status: "todo", noteAr: "مقترح لما بعد الإطلاق" },
];

// Group items by category
function groupByCategory(items: ReadinessItem[]) {
  const map = new Map<string, ReadinessItem[]>();
  for (const item of items) {
    if (!map.has(item.category)) map.set(item.category, []);
    map.get(item.category)!.push(item);
  }
  return map;
}

export default function AdminSystemReadinessPage() {
  const grouped = groupByCategory(CHECKLIST);
  const isAr = useLocaleStore((s) => s.locale) === "ar";

  const doneCount = CHECKLIST.filter((i) => i.status === "done").length;
  const partialCount = CHECKLIST.filter((i) => i.status === "partial").length;
  const todoCount = CHECKLIST.filter((i) => i.status === "todo").length;
  const blockedCount = CHECKLIST.filter((i) => i.status === "blocked").length;
  const total = CHECKLIST.length;
  const readinessPct = Math.round(((doneCount + partialCount * 0.5) / total) * 100);

  return (
    <AdminDashboardShell titleAr="جاهزية الإنتاج" titleEn="Production readiness">
      <div className="px-4 py-4 space-y-4" dir={isAr ? "rtl" : "ltr"}>

        {/* Mock/preview notice */}
        <div className="bg-[#FEF9EC] border border-[#C8860A]/20 rounded-xl px-4 py-2">
          <p className="text-[10px] text-[#C8860A]">
            {bi(isAr, "قائمة تحقق يدوية — تُحدَّث مع كل مرحلة تطوير", "Manual checklist — updated each development phase")}
          </p>
        </div>

        {/* Readiness score */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-[#102A43]">{bi(isAr, "مؤشر الجاهزية", "Readiness score")}</p>
            <p className="text-2xl font-bold text-[#0A3C36]">{readinessPct}{isAr ? "٪" : "%"}</p>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0A3C36] rounded-full transition-all"
              style={{ width: `${readinessPct}%` }}
              role="progressbar"
              aria-valuenow={readinessPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={bi(isAr, `جاهزية الإنتاج ${readinessPct}٪`, `Production readiness ${readinessPct}%`)}
            />
          </div>
          {/* Counts */}
          <div className="grid grid-cols-4 gap-2 mt-3 text-center">
            <div>
              <p className="text-sm font-bold text-[#0A3C36]">{doneCount}</p>
              <p className="text-[9px] text-[#627D98]">{bi(isAr, "مكتمل", "Done")}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#C8860A]">{partialCount}</p>
              <p className="text-[9px] text-[#627D98]">{bi(isAr, "جزئي", "Partial")}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#627D98]">{todoCount}</p>
              <p className="text-[9px] text-[#627D98]">{bi(isAr, "مطلوب", "To do")}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#C0392B]">{blockedCount}</p>
              <p className="text-[9px] text-[#627D98]">{bi(isAr, "محظور", "Blocked")}</p>
            </div>
          </div>
        </div>

        {/* Checklist by category */}
        {Array.from(grouped.entries()).map(([category, items]) => (
          <div key={category}>
            <p className="text-xs font-bold text-[#102A43] mb-2">{isAr ? category : (CATEGORY_EN[category] ?? category)}</p>
            <div className="space-y-2">
              {items.map((item, idx) => {
                const cfg = STATUS_CONFIG[item.status];
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-[#E2E8F0] px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className={`text-sm font-bold ${cfg.color} flex-shrink-0 mt-0.5`} aria-hidden="true">
                          {cfg.icon}
                        </span>
                        <p className="text-xs text-[#102A43] leading-relaxed">{item.item}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                        {isAr ? cfg.labelAr : cfg.labelEn}
                      </span>
                    </div>
                    {item.noteAr && (
                      <p className="text-[10px] text-[#627D98] mt-1 mr-6">{item.noteAr}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        <p className="text-[11px] text-[#627D98] text-center py-2">
          {bi(isAr, "آخر تحديث", "Last updated")}: Phase 17 — Final Hardening & Launch Readiness · {new Date().toLocaleDateString(isAr ? "ar-OM" : "en-OM", { year: "numeric", month: "long" })}
        </p>
      </div>
    </AdminDashboardShell>
  );
}
