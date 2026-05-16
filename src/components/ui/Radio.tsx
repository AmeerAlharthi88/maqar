"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export function Radio({ label, helperText, className, id, ...props }: RadioProps) {
  const generatedId = useId();
  const radioId = id ?? generatedId;

  return (
    <label htmlFor={radioId} className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex-shrink-0 mt-0.5">
        <input id={radioId} type="radio" className="sr-only peer" {...props} />
        <div
          className={cn(
            "w-5 h-5 rounded-full border-2 border-[#E8DDD0] bg-white transition-all duration-150",
            "peer-checked:border-[#C65D3B]",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[#C65D3B]/30",
            "group-hover:border-[#C65D3B]",
            className
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C65D3B] opacity-0 peer-checked:opacity-100 transition-opacity scale-75 peer-checked:scale-100" />
        </div>
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
