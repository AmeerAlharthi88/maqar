"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function Textarea({ label, helperText, error, className, id, ...props }: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#102A43]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={4}
        className={cn(
          "w-full bg-white border rounded-xl px-3.5 py-2.5 text-[#102A43] placeholder:text-[#627D98]",
          "transition-all duration-150 outline-none resize-y min-h-24",
          "focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15",
          error ? "border-[#C0392B]" : "border-[#E2E8F0]",
          className
        )}
        {...props}
      />
      {(error ?? helperText) && (
        <p className={cn("text-xs", error ? "text-[#C0392B]" : "text-[#627D98]")}>
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
