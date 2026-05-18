"use client";

import { useEffect, useState } from "react";
import { AgentDashboardShell } from "@/components/agent/AgentDashboardShell";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { MOCK_APPOINTMENTS } from "@/mock/leads";
import { APPOINTMENT_STATUS_LABELS_AR } from "@/types/lead";
import type { AppointmentStatus, DashboardAppointment } from "@/types/lead";
import { useAuthStore } from "@/store/auth.store";
import { fetchAgentAppointments, updateAppointmentStatus } from "@/lib/supabase/crm";
import type { CrmAppointment } from "@/lib/supabase/crm";

// ── Unified display shape (absorbs both DB + mock) ────────────────────────────
interface ApptDisplay {
  id: string;
  customerNameAr: string;
  customerPhone: string;
  listingTitleAr: string;
  dateLabel: string;
  timeLabel: string;
  status: AppointmentStatus;
  notes?: string;
}

const STATUS_VARIANT: Record<
  AppointmentStatus,
  "success" | "warning" | "danger" | "info" | "neutral" | "purple"
> = {
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

function crmApptToDisplay(appt: CrmAppointment): ApptDisplay {
  return {
    id: appt.id,
    customerNameAr: appt.customerName,
    customerPhone: appt.customerPhone,
    listingTitleAr: appt.listingTitleAr,
    dateLabel: formatDate(appt.preferredDate),
    timeLabel: appt.preferredTime,
    status: appt.status,
    notes: appt.notes ?? undefined,
  };
}

function mockApptToDisplay(appt: DashboardAppointment): ApptDisplay {
  return {
    id: appt.id,
    customerNameAr: appt.customerNameAr,
    customerPhone: appt.customerPhone,
    listingTitleAr: appt.listingTitleAr,
    dateLabel: formatDate(appt.scheduledAt),
    timeLabel: formatTime(appt.scheduledAt),
    status: appt.status,
    notes: appt.notes,
  };
}

export default function AgentAppointmentsPage() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<ApptDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!user?.id) {
      setAppointments(MOCK_APPOINTMENTS.map(mockApptToDisplay));
      setLoading(false);
      return;
    }
    fetchAgentAppointments(user.id)
      .then((rows) => {
        setAppointments(
          rows.length > 0
            ? rows.map(crmApptToDisplay)
            : MOCK_APPOINTMENTS.map(mockApptToDisplay)
        );
      })
      .catch(() => setAppointments(MOCK_APPOINTMENTS.map(mockApptToDisplay)))
      .finally(() => setLoading(false));
  }, [user?.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleStatusUpdate(id: string, status: AppointmentStatus) {
    // Optimistic update
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    await updateAppointmentStatus(id, status).catch((err) =>
      console.error("[Appointments] updateAppointmentStatus error:", err)
    );
  }

  const upcoming = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );
  const historical = appointments.filter(
    (a) =>
      a.status === "completed" ||
      a.status === "cancelled" ||
      a.status === "rescheduled"
  );

  if (loading) {
    return (
      <AgentDashboardShell titleAr="المواعيد">
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-[#C65D3B] border-t-transparent animate-spin" />
        </div>
      </AgentDashboardShell>
    );
  }

  return (
    <AgentDashboardShell titleAr="المواعيد">
      <div className="px-4 py-4 space-y-4" dir="rtl">
        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">
              القادمة ({upcoming.length})
            </h2>
            <div className="space-y-3">
              {upcoming.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1E1E1E]">
                        {appt.customerNameAr}
                      </p>
                      <p className="text-xs text-[#7A6B5E] mt-0.5 line-clamp-1">
                        {appt.listingTitleAr}
                      </p>
                    </div>
                    <StatusBadge
                      label={APPOINTMENT_STATUS_LABELS_AR[appt.status]}
                      variant={STATUS_VARIANT[appt.status]}
                      size="xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#7A6B5E]">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>
                      {appt.dateLabel} — {appt.timeLabel}
                    </span>
                  </div>

                  {appt.notes && (
                    <p className="text-xs text-[#A89480] mt-2 leading-relaxed">
                      {appt.notes}
                    </p>
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
                    {appt.status === "pending" && (
                      <button
                        onClick={() => void handleStatusUpdate(appt.id, "confirmed")}
                        className="flex-1 py-2 rounded-xl bg-[#EDF4ED] text-[#5B8C5A] text-xs font-bold"
                      >
                        تأكيد
                      </button>
                    )}
                    {(appt.status === "pending" || appt.status === "confirmed") && (
                      <button
                        onClick={() => void handleStatusUpdate(appt.id, "cancelled")}
                        className="flex-1 py-2 rounded-xl bg-[#FBF0EB] text-[#C65D3B] text-xs font-bold"
                      >
                        إلغاء
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historical */}
        {historical.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-[#1E1E1E] mb-3">
              السابقة ({historical.length})
            </h2>
            <div className="space-y-3">
              {historical.map((appt) => (
                <div
                  key={appt.id}
                  className="bg-[#FAF7F4] rounded-2xl border border-[#F0EBE3] px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#7A6B5E]">
                        {appt.customerNameAr}
                      </p>
                      <p className="text-xs text-[#A89480] mt-0.5 line-clamp-1">
                        {appt.listingTitleAr}
                      </p>
                      <p className="text-[10px] text-[#A89480] mt-1">
                        {appt.dateLabel}
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

        {appointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#A89480]">لا توجد مواعيد بعد</p>
          </div>
        )}
      </div>
    </AgentDashboardShell>
  );
}
