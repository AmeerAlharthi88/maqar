"use client";

interface AILoadingStateProps {
  messageAr?: string;
  compact?: boolean;
}

export function AILoadingState({
  messageAr = "يعمل الذكاء الاصطناعي على تحليل البيانات...",
  compact = false,
}: AILoadingStateProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-[#627D98]" aria-live="polite" aria-busy="true" dir="rtl">
        <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0A3C36]/30 border-t-[#0A3C36] animate-spin flex-shrink-0" aria-hidden="true" />
        <span>{messageAr}</span>
      </div>
    );
  }

  return (
    <div
      className="bg-[#E6F0EF] border border-[#0A3C36]/20 rounded-2xl px-4 py-4 flex items-center gap-3"
      dir="rtl"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Animated dots */}
      <div className="flex items-center gap-1 flex-shrink-0" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-[#0A3C36]"
            style={{
              animation: "bounce 1.2s infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#0A3C36]">جاري التحليل</p>
        <p className="text-xs text-[#627D98] mt-0.5">{messageAr}</p>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          span[style] { animation: none; }
        }
      `}</style>
    </div>
  );
}
