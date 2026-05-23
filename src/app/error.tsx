"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 text-center bg-[#F8F9FA]">
      <div className="w-16 h-16 rounded-full bg-[#FEF0EE] flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-[#102A43] mb-2">حدث خطأ ما</h1>
      <p className="text-sm text-[#627D98] mb-8 max-w-xs">
        نأسف على الإزعاج. يرجى المحاولة مرة أخرى.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-xl bg-[#0A3C36] text-white text-sm font-semibold"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
