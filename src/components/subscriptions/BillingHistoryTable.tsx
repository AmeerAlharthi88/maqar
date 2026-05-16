// ── BillingHistoryTable — list of billing records ─────────────────────────────

import { cn } from "@/lib/utils";
import { formatOMR } from "@/lib/formatters";
import { PaymentStatusBadge } from "@/components/subscriptions/PaymentStatusBadge";
import type { BillingRecord } from "@/lib/payments/types";

interface BillingHistoryTableProps {
  records: BillingRecord[];
  className?: string;
}

export function BillingHistoryTable({
  records,
  className,
}: BillingHistoryTableProps) {
  if (records.length === 0) {
    return (
      <div
        className={cn(
          "bg-[#FAF7F4] rounded-2xl border border-[#F0EBE3] px-4 py-8 text-center",
          className
        )}
        dir="rtl"
      >
        <p className="text-sm text-[#A89480]">لا توجد فواتير بعد</p>
        <p className="text-xs text-[#C4B5A5] mt-1">
          ستظهر سجلات الدفع هنا بعد أول عملية اشتراك.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#F0EBE3] overflow-hidden",
        className
      )}
      dir="rtl"
    >
      {records.map((record, i) => (
        <div
          key={record.id}
          className={cn(
            "px-4 py-3 flex items-center justify-between gap-3",
            i < records.length - 1 && "border-b border-[#F5F0EA]"
          )}
        >
          {/* Description */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1E1E1E] truncate">
              {record.description}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-[#A89480]">
                {new Date(record.date).toLocaleDateString("ar-OM", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {record.invoiceRef && (
                <span className="text-[10px] text-[#C4B5A5]">
                  {record.invoiceRef}
                </span>
              )}
            </div>
          </div>

          {/* Amount + status */}
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <span className="text-sm font-bold text-[#1E1E1E]">
              {formatOMR(record.amount, { arabic: true })}
            </span>
            <PaymentStatusBadge status={record.status} />
          </div>
        </div>
      ))}
    </div>
  );
}
