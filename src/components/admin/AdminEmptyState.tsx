interface AdminEmptyStateProps {
  titleAr: string;
  descriptionAr?: string;
}

export function AdminEmptyState({ titleAr, descriptionAr }: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center" dir="rtl">
      <div className="w-16 h-16 rounded-2xl bg-[#F5F0EA] flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4B5A5" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
      </div>
      <p className="text-sm font-bold text-[#1E1E1E] mb-1">{titleAr}</p>
      {descriptionAr && (
        <p className="text-xs text-[#A89480] max-w-xs leading-relaxed">{descriptionAr}</p>
      )}
    </div>
  );
}
