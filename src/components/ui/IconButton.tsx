"use client";

import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "filled" | "danger";
  label: string;
}

const sizeClasses = {
  sm: "w-8 h-8 rounded-lg",
  md: "w-10 h-10 rounded-xl",
  lg: "w-12 h-12 rounded-xl",
};

const variantClasses = {
  ghost:   "bg-transparent text-[#627D98] hover:bg-[#F0F4F8] hover:text-[#102A43]",
  outline: "border border-[#E2E8F0] text-[#627D98] hover:border-[#0A3C36] hover:text-[#0A3C36]",
  filled:  "bg-[#0A3C36] text-white hover:bg-[#082E29]",
  danger:  "bg-[#FEF0EE] text-[#C0392B] hover:bg-[#C0392B] hover:text-white",
};

export function IconButton({
  size = "md",
  variant = "ghost",
  label,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 select-none",
        "disabled:pointer-events-none disabled:opacity-50 active:scale-95",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
