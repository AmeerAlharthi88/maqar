import { cn } from "@/lib/utils";

interface AIResultCardProps {
  children: React.ReactNode;
  isMockFallback?: boolean;
  className?: string;
  title?: string;
}

export function AIResultCard({ children, isMockFallback = false, className, title }: AIResultCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden",
        className
      )}
      dir="rtl"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#E6F0EF] border-b border-[#0A3C36]/15">
        <div className="flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
          <span className="text-xs font-bold text-[#0A3C36]">{title ?? "نتيجة الذكاء الاصطناعي"}</span>
        </div>
        {isMockFallback && (
          <span className="text-[10px] font-semibold bg-[#FDF6E3] border border-[#C8860A]/30 text-[#C8860A] px-2 py-0.5 rounded-full">
            وضع تجريبي
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}
