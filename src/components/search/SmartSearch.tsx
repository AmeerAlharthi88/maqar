"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store/search.store";
import { ROUTES } from "@/config/routes";
import { useTranslation } from "@/i18n/useTranslation";

const EXAMPLE_SEARCHES_AR = [
  "فيلا في بوشر",
  "شقة في الخوض",
  "أرض في السيب",
  "مكتب في مسقط",
  "تاون هاوس في الغبرة",
  "شقة مفروشة في الخوير",
];

const EXAMPLE_SEARCHES_EN = [
  "Villa in Bawshar",
  "Apartment in Al Khoud",
  "Land in Seeb",
  "Office in Muscat",
  "Townhouse in Ghubrah",
  "Furnished apartment in Khuwair",
];

interface SmartSearchProps {
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SmartSearch({
  placeholder,
  size = "md",
  autoFocus = false,
  onSearch,
  className,
}: SmartSearchProps) {
  const router = useRouter();
  const { filters, setFilter, recentSearches, addRecentSearch, clearRecentSearches } =
    useSearchStore();
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  const EXAMPLE_SEARCHES = isAr ? EXAMPLE_SEARCHES_AR : EXAMPLE_SEARCHES_EN;

  const [localQuery, setLocalQuery] = useState(filters.query);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resolvedPlaceholder = placeholder ?? t("search.placeholder");

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(query: string) {
    const q = query.trim();
    setFilter("query", q);
    if (q) addRecentSearch(q);
    setFocused(false);
    if (onSearch) {
      onSearch(q);
    } else {
      router.push(ROUTES.search);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit(localQuery);
    if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  }

  const showDropdown = focused && (recentSearches.length > 0 || localQuery.length === 0);
  const suggestions = localQuery.trim()
    ? EXAMPLE_SEARCHES.filter((s) => s.toLowerCase().includes(localQuery.trim().toLowerCase()))
    : [];

  const heightClass = size === "sm" ? "h-10" : size === "lg" ? "h-14" : "h-12";
  const textClass = size === "sm" ? "text-sm" : size === "lg" ? "text-base" : "text-sm";

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      role="combobox"
      aria-expanded={showDropdown}
      aria-haspopup="listbox"
      aria-controls="smart-search-listbox"
    >
      {/* Input */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border bg-white transition-all",
          heightClass,
          "px-4",
          focused
            ? "border-[#0A3C36] shadow-[0_0_0_3px_rgba(10,60,54,0.12)]"
            : "border-[#E2E8F0] shadow-[0_2px_8px_0_rgb(10_60_54/0.06)]"
        )}
      >
        {/* Search icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke={focused ? "#0A3C36" : "#627D98"}
          strokeWidth="2.5"
          className="flex-shrink-0 transition-colors"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={resolvedPlaceholder}
          className={cn(
            "flex-1 bg-transparent outline-none border-none ring-0 shadow-none",
            "text-[#102A43] placeholder:text-[#627D98]",
            "[-webkit-appearance:none] [appearance:none]",
            textClass
          )}
          aria-label={t("common.search")}
          aria-autocomplete="list"
          autoComplete="off"
        />

        {/* Clear button */}
        {localQuery && (
          <button
            aria-label={t("search.smartSearch.clear")}
            onClick={() => {
              setLocalQuery("");
              setFilter("query", "");
              inputRef.current?.focus();
            }}
            className="flex-shrink-0 text-[#627D98] hover:text-[#102A43] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Search submit */}
        <button
          aria-label={t("search.button")}
          onClick={() => handleSubmit(localQuery)}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
            "bg-[#0A3C36] text-white hover:bg-[#082E29] active:scale-95"
          )}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d={isAr ? "M19 12H5M12 5l-7 7 7 7" : "M5 12h14M12 5l7 7-7 7"} />
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div id="smart-search-listbox" role="listbox" className="absolute top-full start-0 end-0 mt-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_8px_32px_0_rgb(10_60_54/0.12)] z-50 overflow-hidden">
          {/* Recent searches */}
          {recentSearches.length > 0 && !localQuery && (
            <div>
              <div className="flex items-center justify-between px-4 pt-3 pb-1">
                <p className="text-xs font-semibold text-[#627D98]">
                  {isAr ? "عمليات البحث الأخيرة" : "Recent searches"}
                </p>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-[#0A3C36] hover:underline"
                >
                  {t("common.clearAll")}
                </button>
              </div>
              {recentSearches.map((r) => (
                <button
                  key={r.timestamp}
                  onClick={() => {
                    setLocalQuery(r.query);
                    handleSubmit(r.query);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F0F4F8] transition-colors text-start"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-sm text-[#102A43]">{r.query}</span>
                </button>
              ))}
            </div>
          )}

          {/* Suggestions when typing */}
          {localQuery && suggestions.length > 0 && (
            <div>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setLocalQuery(s);
                    handleSubmit(s);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F0F4F8] transition-colors text-start"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <span className="text-sm text-[#102A43]">{s}</span>
                </button>
              ))}
            </div>
          )}

          {/* Example searches when empty and no recents */}
          {!localQuery && recentSearches.length === 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-[#627D98]">
                {isAr ? "اقتراحات" : "Suggestions"}
              </p>
              {EXAMPLE_SEARCHES.slice(0, 5).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setLocalQuery(s);
                    handleSubmit(s);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F0F4F8] transition-colors text-start"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  <span className="text-sm text-[#627D98]">{s}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
