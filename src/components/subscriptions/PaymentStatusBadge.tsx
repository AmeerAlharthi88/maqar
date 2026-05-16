// ── PaymentStatusBadge — badge for payment/subscription status ────────────────

import { cn } from "@/lib/utils";
import type { SubscriptionStatus, PaymentStatus } from "@/lib/payments/types";

type StatusVariant = SubscriptionStatus | PaymentStatus;

interface PaymentStatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

const LABEL_AR: Record<StatusVariant, string> = {
  // SubscriptionStatus
  free:       "مجاني",
  trial:      "تجريبي",
  active:     "نشط",
  past_due:   "متأخر",
  cancelled:  "ملغى",
  expired:    "منتهي",
  // PaymentStatus
  pending:    "معلّق",
  paid:       "مدفوع",
  failed:     "فاشل",
  refunded:   "مسترجع",
};

const STYLE_MAP: Record<StatusVariant, string> = {
  free:      "bg-[#F5F0EA] text-[#7A6B5E] border-[#E8DDD0]",
  trial:     "bg-[#EAF4FB] text-[#2471A3] border-[#2471A3]/20",
  active:    "bg-[#EDF4ED] text-[#5B8C5A] border-[#5B8C5A]/20",
  past_due:  "bg-[#FEF9EC] text-[#C8860A] border-[#C8860A]/20",
  cancelled: "bg-[#F5F0EA] text-[#A89480] border-[#E8DDD0]",
  expired:   "bg-[#F5F0EA] text-[#A89480] border-[#E8DDD0]",
  pending:   "bg-[#FEF9EC] text-[#C8860A] border-[#C8860A]/20",
  paid:      "bg-[#EDF4ED] text-[#5B8C5A] border-[#5B8C5A]/20",
  failed:    "bg-[#FEF0F0] text-[#C0392B] border-[#C0392B]/20",
  refunded:  "bg-[#EAF4FB] text-[#2471A3] border-[#2471A3]/20",
};

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
        STYLE_MAP[status],
        className
      )}
    >
      {LABEL_AR[status]}
    </span>
  );
}
