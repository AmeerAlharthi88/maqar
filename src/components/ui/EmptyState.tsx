import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  titleAr: string;
  descriptionAr?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, titleAr, descriptionAr, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16 px-6 text-center", className)}>
      {icon ? (
        <div className="w-16 h-16 rounded-2xl bg-[#E6F0EF] flex items-center justify-center text-[#0A3C36]">
          {icon}
        </div>
      ) : (
        <DefaultEmptyIcon />
      )}
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-semibold text-[#102A43]">{titleAr}</p>
        {descriptionAr && (
          <p className="text-sm text-[#627D98] max-w-xs">{descriptionAr}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

function DefaultEmptyIcon() {
  return (
    <div className="w-16 h-16 rounded-2xl bg-[#E6F0EF] flex items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 13h6M9 9h6" />
      </svg>
    </div>
  );
}
