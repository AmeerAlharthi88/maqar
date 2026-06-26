"use client";

import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { AdminUser, UserStatus } from "@/types/admin";
import { USER_STATUS_AR, USER_STATUS_EN } from "@/types/admin";
import { ROLE_LABELS_AR, ROLE_LABELS_EN } from "@/config/roles";
import { useLocaleStore } from "@/store/locale.store";
import { bi, displayMeta } from "@/lib/admin/labels";

const STATUS_VARIANT: Record<UserStatus, "success" | "warning" | "danger" | "info" | "neutral" | "purple"> = {
  active:               "success",
  suspended:            "warning",
  banned:               "danger",
  pending_verification: "info",
};

interface UserManagementCardProps {
  user: AdminUser;
  onSuspend?: (id: string) => void;
  onReactivate?: (id: string) => void;
  /** Demo/read-only mode: destructive actions are disabled so an admin is not
   *  misled into thinking a mock action affected a real account (FP11 #7). */
  demo?: boolean;
}

export function UserManagementCard({ user, onSuspend, onReactivate, demo = false }: UserManagementCardProps) {
  const isAr = useLocaleStore((s) => s.locale) === "ar";
  const displayName = displayMeta(user.nameAr, isAr);
  const initials = displayName.split(" ").slice(0, 2).map((w) => w[0]).join("");
  const isSuspended = user.status === "suspended" || user.status === "banned";
  const joinedYear = new Date(user.joinedAt).getFullYear();

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-[#0A3C36]/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-[#0A3C36]">{initials}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#102A43]">{displayName}</p>
            {user.isVerified && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#0A3C36">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
            )}
          </div>
          <p className="text-xs text-[#627D98]">{user.phone}</p>
          {user.email && <p className="text-[10px] text-[#627D98]">{user.email}</p>}
        </div>

        {/* Status */}
        <StatusBadge
          label={isAr ? USER_STATUS_AR[user.status] : USER_STATUS_EN[user.status]}
          variant={STATUS_VARIANT[user.status]}
          size="xs"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#F8F9FA] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#102A43]">{isAr ? ROLE_LABELS_AR[user.role] : ROLE_LABELS_EN[user.role]}</p>
          <p className="text-[10px] text-[#627D98]">{bi(isAr, "الدور", "Role")}</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#102A43]">{user.listingsCount}</p>
          <p className="text-[10px] text-[#627D98]">{bi(isAr, "إعلان", "Listings")}</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#102A43]">{joinedYear}</p>
          <p className="text-[10px] text-[#627D98]">{bi(isAr, "عضو منذ", "Member since")}</p>
        </div>
      </div>

      {/* Phone verification */}
      <p className={["text-[10px] font-semibold mb-3", user.isPhoneVerified ? "text-[#0A3C36]" : "text-[#627D98]"].join(" ")}>
        {user.isPhoneVerified ? bi(isAr, "رقم الهاتف موثّق", "Phone verified") : bi(isAr, "رقم الهاتف غير موثّق", "Phone not verified")}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        {!isSuspended && (
          <button
            onClick={() => { if (!demo) onSuspend?.(user.id); }}
            disabled={demo}
            title={demo ? bi(isAr, "إجراء تجريبي — غير مفعّل", "Demo action — not wired") : undefined}
            className="flex-1 py-2 rounded-xl bg-[#FEF0EE] text-[#C0392B] text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bi(isAr, "تعليق مؤقت", "Suspend")}{demo ? bi(isAr, " (تجريبي)", " (demo)") : ""}
          </button>
        )}
        {isSuspended && (
          <button
            onClick={() => { if (!demo) onReactivate?.(user.id); }}
            disabled={demo}
            title={demo ? bi(isAr, "إجراء تجريبي — غير مفعّل", "Demo action — not wired") : undefined}
            className="flex-1 py-2 rounded-xl bg-[#E6F0EF] text-[#0A3C36] text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bi(isAr, "إعادة تفعيل", "Reactivate")}{demo ? bi(isAr, " (تجريبي)", " (demo)") : ""}
          </button>
        )}
        {/* Role change is intentionally disabled — server-side action only */}
        <div className="flex-1 py-2 rounded-xl bg-[#F0F4F8] text-center">
          <p className="text-[10px] text-[#627D98] font-semibold">{bi(isAr, "تغيير الدور", "Change role")}</p>
          <p className="text-[9px] text-[#627D98]">{bi(isAr, "إجراء خادم فقط", "Server action only")}</p>
        </div>
      </div>
    </div>
  );
}
