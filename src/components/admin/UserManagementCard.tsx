import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { AdminUser, UserStatus } from "@/types/admin";
import { USER_STATUS_AR } from "@/types/admin";
import { ROLE_LABELS_AR } from "@/config/roles";

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
}

export function UserManagementCard({ user, onSuspend, onReactivate }: UserManagementCardProps) {
  const initials = user.nameAr.split(" ").slice(0, 2).map((w) => w[0]).join("");
  const isSuspended = user.status === "suspended" || user.status === "banned";
  const joinedYear = new Date(user.joinedAt).getFullYear();

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4" dir="rtl">
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-[#0A3C36]/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-[#0A3C36]">{initials}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#102A43]">{user.nameAr}</p>
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
          label={USER_STATUS_AR[user.status]}
          variant={STATUS_VARIANT[user.status]}
          size="xs"
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#F8F9FA] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#102A43]">{ROLE_LABELS_AR[user.role]}</p>
          <p className="text-[10px] text-[#627D98]">الدور</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#102A43]">{user.listingsCount}</p>
          <p className="text-[10px] text-[#627D98]">إعلان</p>
        </div>
        <div className="bg-[#F8F9FA] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#102A43]">{joinedYear}</p>
          <p className="text-[10px] text-[#627D98]">عضو منذ</p>
        </div>
      </div>

      {/* Phone verification */}
      <p className={["text-[10px] font-semibold mb-3", user.isPhoneVerified ? "text-[#0A3C36]" : "text-[#627D98]"].join(" ")}>
        {user.isPhoneVerified ? "رقم الهاتف موثّق" : "رقم الهاتف غير موثّق"}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        {!isSuspended && (
          <button
            onClick={() => onSuspend?.(user.id)}
            className="flex-1 py-2 rounded-xl bg-[#FEF0EE] text-[#C0392B] text-xs font-bold"
          >
            تعليق مؤقت
          </button>
        )}
        {isSuspended && (
          <button
            onClick={() => onReactivate?.(user.id)}
            className="flex-1 py-2 rounded-xl bg-[#E6F0EF] text-[#0A3C36] text-xs font-bold"
          >
            إعادة تفعيل
          </button>
        )}
        {/* Role change is intentionally disabled — server-side action only */}
        <div className="flex-1 py-2 rounded-xl bg-[#F0F4F8] text-center">
          <p className="text-[10px] text-[#627D98] font-semibold">تغيير الدور</p>
          <p className="text-[9px] text-[#627D98]">إجراء خادم فقط</p>
        </div>
      </div>
    </div>
  );
}
