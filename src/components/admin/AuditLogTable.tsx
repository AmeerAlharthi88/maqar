"use client";

import type { AuditLog, AuditCategory } from "@/types/admin";
import { AUDIT_CATEGORY_AR } from "@/types/admin";

const SEVERITY_CLASSES = {
  info:     "bg-[#EAF4FB] text-[#2471A3]",
  warning:  "bg-[#FFF8E7] text-[#D4A017]",
  critical: "bg-[#FEF0EE] text-[#C0392B]",
} as const;

const SEVERITY_AR = {
  info:     "معلومات",
  warning:  "تحذير",
  critical: "حرج",
} as const;

interface AuditLogTableProps {
  logs: AuditLog[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <div className="space-y-2" dir="rtl">
      {logs.map((log) => (
        <div key={log.id} className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2 py-0.5 bg-[#F0F4F8] text-[#627D98] rounded-lg font-semibold whitespace-nowrap">
                  {AUDIT_CATEGORY_AR[log.category]}
                </span>
                <p className="text-sm font-bold text-[#102A43]">{log.actionAr}</p>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-xs text-[#627D98]">
                  <span className="font-semibold">{log.actorNameAr}</span>
                  {log.targetAr && <span className="text-[#627D98]"> ← {log.targetAr}</span>}
                </p>
              </div>
            </div>
            <span className={[
              "text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0",
              SEVERITY_CLASSES[log.severity],
            ].join(" ")}>
              {SEVERITY_AR[log.severity]}
            </span>
          </div>

          {log.detailsAr && (
            <p className="text-xs text-[#627D98] leading-relaxed mb-1.5 border-r-2 border-[#E2E8F0] pr-2">
              {log.detailsAr}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-[10px] text-[#627D98]">
              {new Date(log.createdAt).toLocaleString("ar-OM", {
                year: "numeric", month: "short", day: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
            <p className="text-[10px] text-[#627D98]">IP: {log.ipPlaceholder}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
