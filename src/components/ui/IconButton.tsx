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
  ghost:   "bg-transparent text-[#7A6B5E] hover:bg-[#F5F0EA] hover:text-[#1E1E1E]",
  outline: "border border-[#E8DDD0] text-[#7A6B5E] hover:border-[#C65D3B] hover:text-[#C65D3B]",
  filled:  "bg-[#C65D3B] text-white hover:bg-[#A84D2F]",
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
