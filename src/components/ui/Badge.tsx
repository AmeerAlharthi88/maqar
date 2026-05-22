import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:   "bg-[#F0F4F8] text-[#627D98]",
  primary:   "bg-[#E6F0EF] text-[#0A3C36]",
  secondary: "bg-[#FDF8EE] text-[#D4A55E]",
  accent:    "bg-[#FDF8EE] text-[#D4A55E]",
  success:   "bg-[#E6F4EC] text-[#2D7A4F]",
  warning:   "bg-[#FFFBEB] text-[#B7791F]",
  danger:    "bg-[#FEF0EE] text-[#C0392B]",
  info:      "bg-[#EBF4FF] text-[#2B6CB0]",
  outline:   "border border-[#E2E8F0] text-[#627D98] bg-transparent",
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5 rounded-md",
  md: "text-sm px-2.5 py-1 rounded-lg",
};

export function Badge({ variant = "default", size = "sm", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium leading-none whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
