interface PlaceholderPageProps {
  titleAr: string;
  descriptionAr?: string;
  phase?: string;
}

export function PlaceholderPage({
  titleAr,
  descriptionAr = "هذه الصفحة قيد الإنشاء وستكون متاحة قريباً.",
  phase = "Phase 5",
}: PlaceholderPageProps) {
  return (
    <div className="min-h-[60svh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#E6F0EF] flex items-center justify-center mb-5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M9 9h6M9 13h4" />
        </svg>
      </div>
      <h1 className="text-lg font-bold text-[#102A43] mb-2">{titleAr}</h1>
      <p className="text-sm text-[#627D98] max-w-xs">{descriptionAr}</p>
      <span className="mt-4 inline-block text-[10px] font-mono text-[#627D98] bg-[#F0F4F8] px-2 py-1 rounded">
        {phase}
      </span>
    </div>
  );
}
