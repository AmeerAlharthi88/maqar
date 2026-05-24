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
  free:      "bg-[#F0F4F8] text-[#627D98] border-[#E2E8F0]",
  trial:     "bg-[#EAF4FB] text-[#2471A3] border-[#2471A3]/20",
  active:    "bg-[#E6F0EF] text-[#0A3C36] border-[#0A3C36]/20",
  past_due:  "bg-[#FEF9EC] text-[#C8860A] border-[#C8860A]/20",
  cancelled: "bg-[#F0F4F8] text-[#627D98] border-[#E2E8F0]",
  expired:   "bg-[#F0F4F8] text-[#627D98] border-[#E2E8F0]",
  pending:   "bg-[#FEF9EC] text-[#C8860A] border-[#C8860A]/20",
  paid:      "bg-[#E6F0EF] text-[#0A3C36] border-[#0A3C36]/20",
  failed:    "bg-[#FEF0EE] text-[#C0392B] border-[#C0392B]/20",
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
