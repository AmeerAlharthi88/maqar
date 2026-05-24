"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-9 text-sm rounded-lg px-3",
  md: "h-11 text-base rounded-xl px-4",
  lg: "h-13 text-base rounded-2xl px-5",
};

export function SearchInput({
  placeholder = "ابحث عن عقارات، مناطق...",
  value: controlledValue,
  onChange,
  onSearch,
  className,
  size = "md",
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const value = controlledValue ?? internalValue;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setInternalValue(v);
    onChange?.(v);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") onSearch?.(value);
  }

  function handleClear() {
    setInternalValue("");
    onChange?.("");
  }

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      {/* Search icon */}
      <span className="absolute end-3.5 text-[#627D98] pointer-events-none">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>

      <input
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "w-full bg-white border border-[#E2E8F0] text-[#102A43] placeholder:text-[#627D98]",
          "outline-none transition-all duration-150",
          "focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/10",
          sizeClasses[size],
          value ? "pe-9" : "pe-10",
          "[&::-webkit-search-cancel-button]:hidden"
        )}
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="مسح البحث"
          className="absolute start-3 text-[#A0AEC0] hover:text-[#102A43] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
