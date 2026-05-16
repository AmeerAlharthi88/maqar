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
    <div className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4" dir="rtl">
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-[#C65D3B]/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-[#C65D3B]">{initials}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#1E1E1E]">{user.nameAr}</p>
            {user.isVerified && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#5B8C5A">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
            )}
          </div>
          <p className="text-xs text-[#7A6B5E]">{user.phone}</p>
          {user.email && <p className="text-[10px] text-[#A89480]">{user.email}</p>}
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
        <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#1E1E1E]">{ROLE_LABELS_AR[user.role]}</p>
          <p className="text-[10px] text-[#A89480]">الدور</p>
        </div>
        <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#1E1E1E]">{user.listingsCount}</p>
          <p className="text-[10px] text-[#A89480]">إعلان</p>
        </div>
        <div className="bg-[#FAF7F4] rounded-xl py-2 text-center">
          <p className="text-xs font-bold text-[#1E1E1E]">{joinedYear}</p>
          <p className="text-[10px] text-[#A89480]">عضو منذ</p>
        </div>
      </div>

      {/* Phone verification */}
      <p className={["text-[10px] font-semibold mb-3", user.isPhoneVerified ? "text-[#5B8C5A]" : "text-[#A89480]"].join(" ")}>
        {user.isPhoneVerified ? "رقم الهاتف موثّق" : "رقم الهاتف غير موثّق"}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        {!isSuspended && (
          <button
            onClick={() => onSuspend?.(user.id)}
            className="flex-1 py-2 rounded-xl bg-[#FBF0EB] text-[#C65D3B] text-xs font-bold"
          >
            تعليق مؤقت
          </button>
        )}
        {isSuspended && (
          <button
            onClick={() => onReactivate?.(user.id)}
            className="flex-1 py-2 rounded-xl bg-[#EDF4ED] text-[#5B8C5A] text-xs font-bold"
          >
            إعادة تفعيل
          </button>
        )}
        {/* Role change is intentionally disabled — server-side action only */}
        <div className="flex-1 py-2 rounded-xl bg-[#F5F0EA] text-center">
          <p className="text-[10px] text-[#A89480] font-semibold">تغيير الدور</p>
          <p className="text-[9px] text-[#C4B5A5]">إجراء خادم فقط</p>
        </div>
      </div>
    </div>
  );
}
