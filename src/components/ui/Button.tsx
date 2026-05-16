"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65D3B]",
  {
    variants: {
      variant: {
        primary:   "bg-[#C65D3B] text-white hover:bg-[#A84D2F] active:scale-[0.98]",
        secondary: "bg-[#D4A373] text-[#1E1E1E] hover:bg-[#C49060] active:scale-[0.98]",
        accent:    "bg-[#5B8C5A] text-white hover:bg-[#4A7349] active:scale-[0.98]",
        outline:   "border-2 border-[#C65D3B] text-[#C65D3B] bg-transparent hover:bg-[#FBF0EB] active:scale-[0.98]",
        ghost:     "bg-transparent text-[#1E1E1E] hover:bg-[#F5F0EA] active:scale-[0.98]",
        danger:    "bg-[#C0392B] text-white hover:bg-[#A93226] active:scale-[0.98]",
        whatsapp:  "bg-[#25D366] text-white hover:bg-[#1EBE58] active:scale-[0.98]",
      },
      size: {
        sm:   "h-8 px-3 text-sm rounded-lg",
        md:   "h-11 px-5 text-base rounded-xl",
        lg:   "h-13 px-7 text-lg rounded-xl",
        full: "h-13 w-full px-5 text-base rounded-xl",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  loading = false,
  leadingIcon,
  trailingIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <SpinnerIcon />
      ) : leadingIcon ? (
        <span className="flex-shrink-0">{leadingIcon}</span>
      ) : null}
      {children}
      {!loading && trailingIcon && (
        <span className="flex-shrink-0">{trailingIcon}</span>
      )}
    </button>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}
