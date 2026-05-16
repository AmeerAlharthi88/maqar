"use client";

import { cn } from "@/lib/utils";
import { PROPERTY_TYPES } from "@/lib/constants/property-types";
import { DRAFT_PROPERTY_TYPE_GROUPS } from "@/lib/constants/add-listing";
import type { PropertyType } from "@/types/listing";

interface StepPropertyTypeProps {
  value: PropertyType | null;
  onChange: (v: PropertyType) => void;
  error?: string;
}

// Inline SVG icons keyed by property type value
function PropertyTypeIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    apartment: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    ),
    villa: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
    duplex: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 12L12 5l9 7v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8z" />
        <path d="M12 5V2M9 21v-6h6v6" />
      </svg>
    ),
    townhouse: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M1 11L6 6l5 5V21H1V11zM13 11l5-5 5 5V21h-10V11z" />
      </svg>
    ),
    land: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 17l4-8 4 4 4-6 6 10H3z" />
        <path d="M3 21h18" />
      </svg>
    ),
    commercial: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    office: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M8 3v18M16 3v18M2 9h20M2 15h20" />
      </svg>
    ),
    warehouse: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 6L12 2l10 4v14H2V6z" />
        <path d="M12 2v18" />
      </svg>
    ),
    arabic_house: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 15a3 3 0 1 0 6 0 3 3 0 0 0-6 0z" />
      </svg>
    ),
    farm: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2a5 5 0 0 1 0 10 5 5 0 0 1 0-10z" />
        <path d="M12 12v10" />
        <path d="M7 16c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      </svg>
    ),
    chalet: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 12L12 4l9 8v9H3V12z" />
        <path d="M9 21v-8h6v8" />
        <path d="M3 12l3-6M21 12l-3-6" />
      </svg>
    ),
    building: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M9 2v20M15 2v20M4 7h16M4 12h16M4 17h16" />
      </svg>
    ),
    hotel_apartment: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M2 9h20M8 3v6M16 3v6" />
        <path d="M6 14h3M15 14h3M6 18h3M15 18h3" />
      </svg>
    ),
  };
  return <>{icons[type] ?? icons.apartment}</>;
}

export function StepPropertyType({ value, onChange, error }: StepPropertyTypeProps) {
  const typeMap = Object.fromEntries(PROPERTY_TYPES.map((t) => [t.value, t]));

  return (
    <div className="px-4 py-6" dir="rtl">
      <p className="text-sm text-[#7A6B5E] mb-6">اختر النوع الذي يصف عقارك بشكل أدق.</p>

      <div className="space-y-5">
        {DRAFT_PROPERTY_TYPE_GROUPS.map((group) => (
          <div key={group.groupAr}>
            <p className="text-xs font-semibold text-[#A89480] uppercase tracking-wide mb-2">{group.groupAr}</p>
            <div className="grid grid-cols-3 gap-2">
              {group.types.map((typeValue) => {
                const config = typeMap[typeValue];
                if (!config) return null;
                const selected = value === typeValue;
                return (
                  <button
                    key={typeValue}
                    onClick={() => onChange(typeValue as PropertyType)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all text-center min-h-[80px] justify-center",
                      selected
                        ? "border-[#C65D3B] bg-[#FBF0EB] text-[#C65D3B]"
                        : "border-[#E8DDD0] bg-white text-[#7A6B5E] active:bg-[#F5F0EA]"
                    )}
                    aria-pressed={selected}
                  >
                    <PropertyTypeIcon type={typeValue} />
                    <span className="text-xs font-medium leading-tight">{config.labelAr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-sm text-[#C0392B] flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
