interface ErrorStateProps {
  titleAr?: string;
  descriptionAr?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  titleAr = "حدث خطأ ما",
  descriptionAr = "يرجى المحاولة مرة أخرى",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-16 px-6 text-center ${className ?? ""}`}>
      <div className="w-16 h-16 rounded-2xl bg-[#FEF0EE] flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-semibold text-[#1E1E1E]">{titleAr}</p>
        <p className="text-sm text-[#7A6B5E] max-w-xs">{descriptionAr}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 h-10 px-5 rounded-xl text-sm font-semibold bg-[#C65D3B] text-white hover:bg-[#A84D2F] transition-colors"
        >
          حاول مرة أخرى
        </button>
      )}
    </div>
  );
}
