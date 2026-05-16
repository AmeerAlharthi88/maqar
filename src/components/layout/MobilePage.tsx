import { cn } from "@/lib/utils";

interface MobilePageProps {
  children: React.ReactNode;
  className?: string;
  withBottomPadding?: boolean;
}

export function MobilePage({ children, className, withBottomPadding = true }: MobilePageProps) {
  return (
    <div
      className={cn(
        "flex flex-col min-h-svh bg-[#FAF7F2]",
        withBottomPadding && "pb-20",
        className
      )}
    >
      {children}
    </div>
  );
}

interface MobilePageHeaderProps {
  titleAr: string;
  back?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function MobilePageHeader({ titleAr, back, actions, className }: MobilePageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-[#F0EBE3]",
        "flex items-center gap-3 px-4 h-14",
        className
      )}
    >
      {back && <div className="flex-shrink-0">{back}</div>}
      <h1 className="flex-1 text-base font-bold text-[#1E1E1E] text-center truncate">{titleAr}</h1>
      {actions ? (
        <div className="flex-shrink-0 flex items-center gap-1">{actions}</div>
      ) : (
        <div className="w-10" />
      )}
    </header>
  );
}
