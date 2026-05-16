import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  titleAr: string;
  subtitleAr?: string;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: { title: "text-base font-semibold", subtitle: "text-xs" },
  md: { title: "text-lg font-bold",       subtitle: "text-sm" },
  lg: { title: "text-xl font-bold",       subtitle: "text-sm" },
};

export function SectionHeader({ titleAr, subtitleAr, action, className, size = "md" }: SectionHeaderProps) {
  const s = sizeClasses[size];
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex flex-col gap-0.5">
        <h2 className={cn(s.title, "text-[#1E1E1E]")}>{titleAr}</h2>
        {subtitleAr && <p className={cn(s.subtitle, "text-[#7A6B5E]")}>{subtitleAr}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
