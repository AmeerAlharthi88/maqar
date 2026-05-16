import { cn } from "@/lib/utils";

interface StickyActionBarProps {
  children: React.ReactNode;
  className?: string;
  position?: "bottom" | "top";
}

export function StickyActionBar({ children, className, position = "bottom" }: StickyActionBarProps) {
  return (
    <div
      className={cn(
        "fixed start-0 end-0 z-[100]",
        "bg-white/95 backdrop-blur-md border-[#F0EBE3]",
        "px-4 py-3",
        position === "bottom"
          ? "bottom-0 border-t pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
          : "top-0 border-b pt-[calc(0.75rem+env(safe-area-inset-top))]",
        className
      )}
    >
      {children}
    </div>
  );
}
