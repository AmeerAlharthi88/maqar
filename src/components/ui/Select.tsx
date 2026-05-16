"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  labelAr: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  helperText,
  error,
  options,
  placeholder = "اختر...",
  className,
  id,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[#1E1E1E]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "w-full h-11 bg-white border rounded-xl px-3.5 pe-9 text-[#1E1E1E] appearance-none",
            "transition-all duration-150 outline-none cursor-pointer",
            "focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15",
            error ? "border-[#C0392B]" : "border-[#E8DDD0]",
            className
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.labelAr}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <span className="absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#7A6B5E]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      {(error ?? helperText) && (
        <p className={cn("text-xs", error ? "text-[#C0392B]" : "text-[#7A6B5E]")}>
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
