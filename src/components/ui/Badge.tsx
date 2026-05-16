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
  default:   "bg-[#F5F0EA] text-[#7A6B5E]",
  primary:   "bg-[#FBF0EB] text-[#C65D3B]",
  secondary: "bg-[#FDF6EE] text-[#C49060]",
  accent:    "bg-[#EDF4ED] text-[#4A7349]",
  success:   "bg-[#EDF4ED] text-[#5B8C5A]",
  warning:   "bg-[#FFF8E6] text-[#C8860A]",
  danger:    "bg-[#FEF0EE] text-[#C0392B]",
  info:      "bg-[#EAF4FB] text-[#2471A3]",
  outline:   "border border-[#E8DDD0] text-[#7A6B5E] bg-transparent",
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
