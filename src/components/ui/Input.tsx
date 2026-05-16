"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export function Input({
  label,
  helperText,
  error,
  leadingIcon,
  trailingIcon,
  className,
  id,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#1E1E1E]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="absolute end-3 text-[#7A6B5E] pointer-events-none flex items-center">
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full h-11 bg-white border rounded-xl px-3.5 text-[#1E1E1E] placeholder:text-[#A89480]",
            "transition-all duration-150 outline-none",
            "focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15",
            error
              ? "border-[#C0392B] focus:border-[#C0392B] focus:ring-[#C0392B]/15"
              : "border-[#E8DDD0]",
            leadingIcon ? "pe-10" : "",
            trailingIcon ? "ps-10" : "",
            className
          )}
          {...props}
        />
        {trailingIcon && (
          <span className="absolute start-3 text-[#7A6B5E] pointer-events-none flex items-center">
            {trailingIcon}
          </span>
        )}
      </div>
      {(error ?? helperText) && (
        <p className={cn("text-xs", error ? "text-[#C0392B]" : "text-[#7A6B5E]")}>
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
