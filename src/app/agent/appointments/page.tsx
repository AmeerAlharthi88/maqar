"use client";

import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MOCK_APPOINTMENTS } from "@/mock/leads";
import { APPOINTMENT_STATUS_LABELS_AR } from "@/types/lead";
import type { AppointmentStatus } from "@/types/lead";

const STATUS_VARIANT: Record<AppointmentStatus, "success" | "warning" | "danger" | "info" | "neutral" | "purple"> = {
  pending:     "warning",
  confirmed:   "success",
  rescheduled: "info",
  cancelled:   "danger",
  completed:   "neutral",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-OM", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ar-OM", {
    hour:   "2-digit",
    minute: "2-digit",
  });
}

export default function AgentAppointmentsPage() {
  const upcoming   = MOCK_APPOINTMENTS.filter((a) => a.status === "pending" || a.status === "confirmed");
  const historical = MOCK_APPOINTMENTS.filter((a) => a.status === "completed" || a.status === "cancelled" || a.status === "rescheduled");

  return (
    <AgentDashboardShell titleAr="المواعيد">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">القادمة ({upcoming.length})</h2>
            <div className="space-y-3">
              {upcoming.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1E1E1E]">{appt.customerNameAr}</p>
                      <p className="text-xs text-[#7A6B5E] mt-0.5 line-clamp-1">{appt.listingTitleAr}</p>
                    </div>
                    <StatusBadge
                      label={APPOINTMENT_STATUS_LABELS_AR[appt.status]}
                      variant={STATUS_VARIANT[appt.status]}
                      size="xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#7A6B5E]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{formatDate(appt.scheduledAt)} — {formatTime(appt.scheduledAt)}</span>
                  </div>

                  {appt.notes && (
                    <p className="text-xs text-[#A89480] mt-2 leading-relaxed">{appt.notes}</p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <a
                      href={`tel:${appt.customerPhone}`}
                      className="flex-1 py-2 rounded-xl bg-[#F5F0EA] text-center text-xs font-semibold text-[#1E1E1E]"
                    >
                      اتصال
                    </a>
                    <a
                      href={`https://wa.me/${appt.customerPhone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl bg-[#25D366] text-center text-xs font-semibold text-white"
                    >
                      واتساب
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historical */}
        {historical.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">السابقة ({historical.length})</h2>
            <div className="space-y-3">
              {historical.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-[#FAF7F4] rounded-2xl border border-[#F0EBE3] px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#7A6B5E]">{appt.customerNameAr}</p>
                      <p className="text-xs text-[#A89480] mt-0.5 line-clamp-1">{appt.listingTitleAr}</p>
                      <p className="text-[10px] text-[#A89480] mt-1">
                        {formatDate(appt.scheduledAt)}
                      </p>
                    </div>
                    <StatusBadge
                      label={APPOINTMENT_STATUS_LABELS_AR[appt.status]}
                      variant={STATUS_VARIANT[appt.status]}
                      size="xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {MOCK_APPOINTMENTS.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#A89480]">لا توجد مواعيد بعد</p>
          </div>
        )}
      </div>
    </AgentDashboardShell>
  );
}
