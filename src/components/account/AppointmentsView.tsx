"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface MockAppointment {
  id: string;
  listingTitleAr: string;
  listingId: string;
  agentNameAr: string;
  date: string; // ISO
  status: AppointmentStatus;
}

// TODO: Replace with real Supabase query in Phase 10
const MOCK_APPOINTMENTS: MockAppointment[] = [];

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { labelAr: string; bg: string; text: string }
> = {
  pending:   { labelAr: "في الانتظار", bg: "bg-[#FFF8E7]", text: "text-[#D4A017]" },
  confirmed: { labelAr: "مؤكد",        bg: "bg-[#EAF4FB]", text: "text-[#2471A3]" },
  completed: { labelAr: "مكتمل",       bg: "bg-[#E6F0EF]", text: "text-[#0A3C36]" },
  cancelled: { labelAr: "ملغي",        bg: "bg-[#F0F4F8]", text: "text-[#627D98]" },
};

export function AppointmentsView() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#102A43" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <div>
          <h1 className="text-sm font-bold text-[#102A43]">مواعيدي</h1>
          <p className="text-xs text-[#627D98]">مواعيد المعاينة المجدولة</p>
        </div>
      </div>

      {MOCK_APPOINTMENTS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#E6F0EF] flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[#102A43] mb-2">لا توجد مواعيد</h2>
          <p className="text-sm text-[#627D98] mb-6 leading-relaxed">
            عند طلب معاينة عقار سيظهر الموعد هنا
          </p>
          <Link
            href={ROUTES.home}
            className="py-3 px-6 rounded-2xl bg-[#0A3C36] text-white font-bold text-sm hover:bg-[#082E29] transition-colors"
          >
            تصفح العقارات
          </Link>
        </div>
      ) : (
        <div className="px-4 py-4 space-y-3">
          {MOCK_APPOINTMENTS.map((appt) => {
            const cfg = STATUS_CONFIG[appt.status];
            const date = new Date(appt.date);
            return (
              <div
                key={appt.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Link
                    href={ROUTES.listing(appt.listingId)}
                    className="text-sm font-bold text-[#102A43] line-clamp-1 flex-1"
                  >
                    {appt.listingTitleAr}
                  </Link>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.bg} ${cfg.text}`}
                  >
                    {cfg.labelAr}
                  </span>
                </div>
                <p className="text-xs text-[#627D98]">الوكيل: {appt.agentNameAr}</p>
                <p className="text-xs text-[#627D98] mt-1">
                  {date.toLocaleDateString("ar-OM", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {" "}
                  {date.toLocaleTimeString("ar-OM", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
