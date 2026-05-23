"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

type RequestStatus = "open" | "in_progress" | "matched" | "closed";

interface PropertyRequest {
  id: string;
  purposeAr: string;
  typeAr: string;
  locationAr: string;
  budget: number;
  status: RequestStatus;
  createdAt: string;
}

// TODO: Replace with real Supabase query in Phase 10
const MOCK_REQUESTS: PropertyRequest[] = [];

const STATUS_CONFIG: Record<
  RequestStatus,
  { labelAr: string; bg: string; text: string }
> = {
  open:        { labelAr: "مفتوح",         bg: "bg-[#EAF4FB]", text: "text-[#2471A3]" },
  in_progress: { labelAr: "قيد المعالجة", bg: "bg-[#FFF8E7]", text: "text-[#D4A017]" },
  matched:     { labelAr: "تم التطابق",   bg: "bg-[#E6F0EF]", text: "text-[#0A3C36]" },
  closed:      { labelAr: "مغلق",          bg: "bg-[#F0F4F8]", text: "text-[#627D98]" },
};

export function RequestsView() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#102A43" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <div>
          <h1 className="text-sm font-bold text-[#102A43]">طلباتي</h1>
          <p className="text-xs text-[#627D98]">طلبات البحث عن عقار</p>
        </div>
      </div>

      {MOCK_REQUESTS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#E6F0EF] flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#102A43] mb-2">لا توجد طلبات</h2>
          <p className="text-sm text-[#627D98] mb-6 leading-relaxed">
            أرسل طلب بحث عن عقار وسيتواصل معك وسطاء موثوقون بعروض مناسبة
          </p>

          {/* Coming soon note */}
          <div className="bg-[#EAF4FB] border border-[#2471A3]/20 rounded-2xl px-4 py-3 max-w-xs w-full">
            <p className="text-xs text-[#2471A3] leading-relaxed text-center">
              ميزة الطلبات قيد التطوير وستُطلق قريباً
            </p>
          </div>

          <Link
            href={ROUTES.home}
            className="mt-6 py-3 px-6 rounded-2xl bg-[#0A3C36] text-white font-bold text-sm hover:bg-[#082E29] transition-colors"
          >
            تصفح العقارات
          </Link>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {MOCK_REQUESTS.map((req) => {
            const cfg = STATUS_CONFIG[req.status];
            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-bold text-[#102A43]">
                      {req.typeAr} — {req.purposeAr}
                    </p>
                    <p className="text-xs text-[#627D98] mt-0.5">{req.locationAr}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
                    {cfg.labelAr}
                  </span>
                </div>
                <p className="text-sm font-bold text-[#0A3C36]">
                  حتى {req.budget.toLocaleString("ar-OM")} ر.ع.
                </p>
                <p className="text-xs text-[#627D98] mt-1">
                  {new Date(req.createdAt).toLocaleDateString("ar-OM", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
