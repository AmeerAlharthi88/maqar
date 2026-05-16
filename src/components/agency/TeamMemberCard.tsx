import type { AgencyMember } from "@/types/agency";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

const ROLE_LABELS_AR: Record<AgencyMember["role"], string> = {
  agency_admin: "مدير الوكالة",
  manager:      "مشرف",
  agent:        "وسيط",
  viewer:       "مراقب",
};

interface TeamMemberCardProps {
  member: AgencyMember;
  onRemove?: (id: string) => void;
  onChangeRole?: (id: string) => void;
  isOwner?: boolean;
}

export function TeamMemberCard({
  member,
  onRemove,
  onChangeRole,
  isOwner = false,
}: TeamMemberCardProps) {
  const initials = member.nameAr
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const callHref = `tel:${member.phone}`;

  return (
    <div className="bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4 flex items-center gap-3" dir="rtl">
      {/* Avatar */}
      <div className="w-11 h-11 rounded-full bg-[#C65D3B]/15 flex items-center justify-center flex-shrink-0">
        {member.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.avatar} alt={member.nameAr} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-sm font-bold text-[#C65D3B]">{initials}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-sm font-bold text-[#1E1E1E] truncate">{member.nameAr}</p>
          {member.isVerified && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#5B8C5A">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <StatusBadge
            label={ROLE_LABELS_AR[member.role]}
            variant={member.role === "agency_admin" ? "danger" : member.role === "manager" ? "warning" : "neutral"}
            size="xs"
          />
          <span className="text-[10px] text-[#A89480]">{member.activeListings} إعلان نشط</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <a
          href={callHref}
          className="w-8 h-8 rounded-xl bg-[#F5F0EA] flex items-center justify-center"
          aria-label="اتصال"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A6B5E" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
        {isOwner && member.role !== "agency_admin" && (
          <>
            <button
              onClick={() => onChangeRole?.(member.id)}
              className="w-8 h-8 rounded-xl bg-[#F5F0EA] flex items-center justify-center"
              aria-label="تغيير الدور"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A6B5E" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              onClick={() => onRemove?.(member.id)}
              className="w-8 h-8 rounded-xl bg-[#FBF0EB] flex items-center justify-center"
              aria-label="إزالة"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C65D3B" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
