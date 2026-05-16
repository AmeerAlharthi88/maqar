"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({ checked, onChange, label, helperText, disabled, className }: SwitchProps) {
  return (
    <label className={cn("flex items-center gap-3 cursor-pointer", disabled && "opacity-50 pointer-events-none", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C65D3B]",
          checked ? "bg-[#C65D3B]" : "bg-[#E8DDD0]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200",
            checked ? "end-0.5 start-auto" : "start-0.5 end-auto"
          )}
        />
      </button>
      {(label ?? helperText) && (
        <div className="flex flex-col gap-0.5">
          {label && <span className="text-sm font-medium text-[#1E1E1E]">{label}</span>}
          {helperText && <span className="text-xs text-[#7A6B5E]">{helperText}</span>}
        </div>
      )}
    </label>
  );
}
