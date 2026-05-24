import { cn } from "@/lib/utils";

type Variant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "purple";

const VARIANT_CLASSES: Record<Variant, string> = {
  success: "bg-[#E6F0EF] text-[#0A3C36]",
  warning: "bg-[#FFF8E7] text-[#D4A017]",
  danger:  "bg-[#FEF0EE] text-[#C0392B]",
  info:    "bg-[#EAF4FB] text-[#2471A3]",
  neutral: "bg-[#F0F4F8] text-[#627D98]",
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
