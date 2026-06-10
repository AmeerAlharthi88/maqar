"use client";

interface ReviewActionBarProps {
  onApprove?: () => void;
  onReject?: () => void;
  onRequestChanges?: () => void;
  onEscalate?: () => void;
  onDismiss?: () => void;
  onClear?: () => void;
  showEscalate?: boolean;
  showDismiss?: boolean;
  showClear?: boolean;
  showRequestChanges?: boolean;
  disabled?: boolean;
}

export function ReviewActionBar({
  onApprove,
  onReject,
  onRequestChanges,
  onEscalate,
  onDismiss,
  onClear,
  showEscalate = false,
  showDismiss = false,
  showClear = false,
  showRequestChanges = true,
  disabled = false,
}: ReviewActionBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-3" dir="rtl">
      {onApprove && (
        <button
          onClick={onApprove}
          disabled={disabled}
          className="flex-1 min-w-[80px] min-h-[40px] py-2.5 rounded-xl bg-[#E6F0EF] text-[#0A3C36] text-xs font-bold disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          قبول
        </button>
      )}
      {onReject && (
        <button
          onClick={onReject}
          disabled={disabled}
          className="flex-1 min-w-[80px] min-h-[40px] py-2.5 rounded-xl bg-[#FEF0EE] text-[#C0392B] text-xs font-bold disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          رفض
        </button>
      )}
      {showRequestChanges && onRequestChanges && (
        <button
          onClick={onRequestChanges}
          disabled={disabled}
          className="flex-1 min-w-[80px] min-h-[40px] py-2.5 rounded-xl bg-[#FFF8E7] text-[#D4A017] text-xs font-bold disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          طلب تعديل
        </button>
      )}
      {showEscalate && onEscalate && (
        <button
          onClick={onEscalate}
          disabled={disabled}
          className="flex-1 min-w-[80px] min-h-[40px] py-2.5 rounded-xl bg-[#F3EEFA] text-[#7B5EA7] text-xs font-bold disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          تصعيد
        </button>
      )}
      {showDismiss && onDismiss && (
        <button
          onClick={onDismiss}
          disabled={disabled}
          className="flex-1 min-w-[80px] min-h-[40px] py-2.5 rounded-xl bg-[#F0F4F8] text-[#627D98] text-xs font-bold disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          رفض البلاغ
        </button>
      )}
      {showClear && onClear && (
        <button
          onClick={onClear}
          disabled={disabled}
          className="flex-1 min-w-[80px] min-h-[40px] py-2.5 rounded-xl bg-[#E6F0EF] text-[#0A3C36] text-xs font-bold disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          تخليص العلم
        </button>
      )}
    </div>
  );
}
