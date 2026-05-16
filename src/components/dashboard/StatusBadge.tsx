import { cn } from "@/lib/utils";

type Variant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "purple";

const VARIANT_CLASSES: Record<Variant, string> = {
  success: "bg-[#EDF4ED] text-[#5B8C5A]",
  warning: "bg-[#FFF8E7] text-[#D4A017]",
  danger:  "bg-[#FBF0EB] text-[#C65D3B]",
  info:    "bg-[#EAF4FB] text-[#2471A3]",
  neutral: "bg-[#F5F0EA] text-[#7A6B5E]",
  purple:  "bg-[#F3EEFA] text-[#7B5EA7]",
};

interface StatusBadgeProps {
  label: string;
  variant: Variant;
  className?: string;
  size?: "xs" | "sm";
}

export function StatusBadge({ label, variant, className, size = "xs" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-bold rounded-full px-2",
        size === "xs" ? "text-[10px] py-0.5" : "text-xs py-1",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
