import { cn } from "@/lib/utils";

interface DividerProps {
  label?: string;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Divider({ label, className, orientation = "horizontal" }: DividerProps) {
  if (orientation === "vertical") {
    return <div className={cn("w-px bg-[#E2E8F0] self-stretch", className)} />;
  }

  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
        <span className="text-xs text-[#627D98] whitespace-nowrap">{label}</span>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>
    );
  }

  return <div className={cn("h-px bg-[#E2E8F0]", className)} />;
}
