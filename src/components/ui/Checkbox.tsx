"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export function Checkbox({ label, helperText, className, id, ...props }: CheckboxProps) {
  const generatedId = useId();
  const checkId = id ?? generatedId;

  return (
    <label htmlFor={checkId} className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          id={checkId}
          type="checkbox"
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            "w-5 h-5 rounded-md border-2 border-[#E8DDD0] bg-white transition-all duration-150",
            "peer-checked:bg-[#C65D3B] peer-checked:border-[#C65D3B]",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[#C65D3B]/30",
            "group-hover:border-[#C65D3B]",
            className
          )}
        />
        <svg
          className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M5 10l4 4L15 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {(label ?? helperText) && (
        <div className="flex flex-col gap-0.5">
          {label && <span className="text-sm font-medium text-[#1E1E1E]">{label}</span>}
          {helperText && <span className="text-xs text-[#7A6B5E]">{helperText}</span>}
        </div>
      )}
    </label>
  );
}
