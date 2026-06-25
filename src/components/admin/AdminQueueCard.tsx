"use client";

import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AdminRiskBadge } from "./AdminRiskBadge";
import type { RiskLevel } from "@/types/admin";
import { useLocaleStore } from "@/store/locale.store";
import { bi } from "@/lib/admin/labels";

interface AdminQueueCardProps {
  titleAr: string;
  subtitleAr?: string;
  metaAr?: string;
  statusLabel?: string;
  statusVariant?: "success" | "warning" | "danger" | "info" | "neutral" | "purple";
  riskLevel?: RiskLevel;
  flagLabel?: string;
  adminNote?: string;
  children?: React.ReactNode;
}

export function AdminQueueCard({
  titleAr,
  subtitleAr,
  metaAr,
  statusLabel,
  statusVariant = "neutral",
  riskLevel,
  flagLabel,
  adminNote,
  children,
}: AdminQueueCardProps) {
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4" dir={isAr ? "rtl" : "ltr"}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#102A43] line-clamp-2">{titleAr}</p>
          {subtitleAr && (
            <p className="text-xs text-[#627D98] mt-0.5">{subtitleAr}</p>
          )}
          {metaAr && (
            <p className="text-[10px] text-[#627D98] mt-0.5">{metaAr}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {statusLabel && (
            <StatusBadge label={statusLabel} variant={statusVariant} size="xs" />
          )}
          {riskLevel && <AdminRiskBadge level={riskLevel} />}
        </div>
      </div>

      {/* Flag chips */}
      {flagLabel && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FEF0EE] text-[#C0392B] text-[10px] font-bold rounded-lg">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
            </svg>
            {flagLabel}
          </span>
        </div>
      )}

      {/* Admin note */}
      {adminNote && (
        <div className="bg-[#FFF8E7] rounded-xl px-3 py-2 mb-2">
          <p className="text-[10px] text-[#D4A017] font-semibold mb-0.5">{bi(isAr, "ملاحظة الإدارة", "Admin note")}</p>
          <p className="text-xs text-[#627D98] leading-relaxed">{adminNote}</p>
        </div>
      )}

      {/* Slot for actions / extra content */}
      {children}
    </div>
  );
}
