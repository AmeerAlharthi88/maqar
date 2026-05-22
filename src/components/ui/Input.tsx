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
        <label htmlFor={inputId} className="text-sm font-medium text-[#102A43]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="absolute end-3 text-[#627D98] pointer-events-none flex items-center">
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full h-11 bg-white border rounded-xl px-3.5 text-[#102A43] placeholder:text-[#627D98]",
            "transition-all duration-150 outline-none",
            "focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/10",
            error
              ? "border-[#C0392B] focus:border-[#C0392B] focus:ring-[#C0392B]/15"
              : "border-[#E2E8F0]",
            leadingIcon ? "pe-10" : "",
            trailingIcon ? "ps-10" : "",
            className
          )}
          {...props}
        />
        {trailingIcon && (
          <span className="absolute start-3 text-[#627D98] pointer-events-none flex items-center">
            {trailingIcon}
          </span>
        )}
      </div>
      {(error ?? helperText) && (
        <p className={cn("text-xs", error ? "text-[#C0392B]" : "text-[#627D98]")}>
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
