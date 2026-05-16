"use client";

import { cn } from "@/lib/utils";
import {
  FURNISHING_OPTIONS,
  PROPERTY_AGE_OPTIONS,
  OMAN_FEATURES,
} from "@/lib/constants/add-listing";
import type { ListingDraft } from "@/types/listing-draft";
import type { FurnishingStatus } from "@/types/listing";

interface StepDetailsProps {
  draft: ListingDraft;
  onChange: (patch: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
}

// ── Numeric stepper ────────────────────────────────────────────────────────────
function NumericStepper({
  label,
  value,
  min,
  max,
  onChange,
  error,
}: {
  label: string;
  value: number | null;
  min: number;
  max: number;
  onChange: (v: number) => void;
  error?: string;
}) {
  const current = value ?? 0;
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[#7A6B5E]">{label}</label>
      <div className={cn("flex items-center gap-2 bg-white border rounded-xl p-1", error ? "border-[#C0392B]" : "border-[#E8DDD0]")}>
        <button
          onClick={() => onChange(Math.max(min, current - 1))}
          className="w-9 h-9 rounded-lg bg-[#F5F0EA] text-[#1E1E1E] text-lg font-bold flex items-center justify-center active:bg-[#E8DDD0] flex-shrink-0"
          aria-label={`تقليل ${label}`}
        >
          −
        </button>
        <span className="flex-1 text-center text-base font-bold text-[#1E1E1E]">{current}</span>
        <button
          onClick={() => onChange(Math.min(max, current + 1))}
          className="w-9 h-9 rounded-lg bg-[#F5F0EA] text-[#1E1E1E] text-lg font-bold flex items-center justify-center active:bg-[#E8DDD0] flex-shrink-0"
          aria-label={`زيادة ${label}`}
        >
          +
        </button>
      </div>
      {error && <p className="text-xs text-[#C0392B]">{error}</p>}
    </div>
  );
}

// ── Number input ──────────────────────────────────────────────────────────────
function NumberInput({
  label,
  value,
  placeholder,
  suffix,
  onChange,
  error,
}: {
  label: string;
  value: number | null;
  placeholder: string;
  suffix?: string;
  onChange: (v: number | null) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#1E1E1E]">{label}</label>
      <div className="relative flex items-center">
        <input
          type="number"
          inputMode="numeric"
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? null : parseFloat(v));
          }}
          className={cn(
            "w-full h-11 bg-white border rounded-xl px-3.5 text-[#1E1E1E] placeholder:text-[#A89480] outline-none",
            "focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15",
            suffix ? "pe-12" : "",
            error ? "border-[#C0392B]" : "border-[#E8DDD0]"
          )}
          dir="ltr"
        />
        {suffix && (
          <span className="absolute end-3 text-xs text-[#A89480] pointer-events-none">{suffix}</span>
        )}
      </div>
      {error && <p className="text-xs text-[#C0392B]">{error}</p>}
    </div>
  );
}

// ── Boolean feature toggle ────────────────────────────────────────────────────
function FeatureToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn(
        "flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all",
        value
          ? "border-[#C65D3B] bg-[#FBF0EB] text-[#C65D3B]"
          : "border-[#E8DDD0] bg-white text-[#7A6B5E]"
      )}
      aria-pressed={value}
    >
      {value && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )}
      {label}
    </button>
  );
}

export function StepDetails({ draft, onChange, errors }: StepDetailsProps) {
  const isLand = draft.propertyType === "land" || draft.propertyType === "farm";
  const isCommercial = ["commercial", "office", "warehouse", "building", "hotel_apartment"].includes(
    draft.propertyType ?? ""
  );

  return (
    <div className="px-4 py-6 space-y-6" dir="rtl">

      {/* Bedrooms / Bathrooms */}
      {!isLand && (
        <section>
          <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">الغرف</h3>
          <div className="grid grid-cols-2 gap-3">
            <NumericStepper
              label="غرف النوم"
              value={draft.bedrooms}
              min={0}
              max={20}
              onChange={(v) => onChange({ bedrooms: v })}
              error={errors.bedrooms}
            />
            <NumericStepper
              label="الحمامات"
              value={draft.bathrooms}
              min={0}
              max={20}
              onChange={(v) => onChange({ bathrooms: v })}
              error={errors.bathrooms}
            />
          </div>
        </section>
      )}

      {/* Areas */}
      <section>
        <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">المساحة</h3>
        <div className="space-y-3">
          <NumberInput
            label="المساحة الإجمالية"
            value={draft.area}
            placeholder="مثال: 200"
            suffix="م²"
            onChange={(v) => onChange({ area: v })}
            error={errors.area}
          />
          {!isCommercial && (
            <NumberInput
              label="مساحة الأرض (اختياري)"
              value={draft.landArea}
              placeholder="مثال: 400"
              suffix="م²"
              onChange={(v) => onChange({ landArea: v })}
            />
          )}
        </div>
      </section>

      {/* Floors / Parking */}
      {!isLand && (
        <section>
          <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">الطوابق والمواقف</h3>
          <div className="grid grid-cols-2 gap-3">
            <NumericStepper
              label="عدد الطوابق"
              value={draft.floors}
              min={0}
              max={50}
              onChange={(v) => onChange({ floors: v })}
            />
            <NumericStepper
              label="مواقف السيارات"
              value={draft.parkingSpots}
              min={0}
              max={20}
              onChange={(v) => onChange({ parkingSpots: v })}
            />
          </div>
        </section>
      )}

      {/* Furnishing */}
      {!isLand && (
        <section>
          <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">حالة الأثاث</h3>
          <div className="flex flex-col gap-2">
            {FURNISHING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChange({ furnishing: opt.value as FurnishingStatus })}
                className={cn(
                  "w-full py-3 rounded-xl border text-sm font-medium transition-all text-center",
                  draft.furnishing === opt.value
                    ? "border-[#C65D3B] bg-[#FBF0EB] text-[#C65D3B]"
                    : "border-[#E8DDD0] bg-white text-[#3D3330]"
                )}
                aria-pressed={draft.furnishing === opt.value}
              >
                {opt.labelAr}
              </button>
            ))}
            {errors.furnishing && <p className="text-xs text-[#C0392B]">{errors.furnishing}</p>}
          </div>
        </section>
      )}

      {/* Property age */}
      <section>
        <h3 className="text-sm font-bold text-[#1E1E1E] mb-3">عمر العقار</h3>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_AGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ propertyAge: opt.value })}
              className={cn(
                "py-2.5 rounded-xl border text-xs font-medium transition-all text-center",
                draft.propertyAge === opt.value
                  ? "border-[#C65D3B] bg-[#FBF0EB] text-[#C65D3B]"
                  : "border-[#E8DDD0] bg-white text-[#3D3330]"
              )}
              aria-pressed={draft.propertyAge === opt.value}
            >
              {opt.labelAr}
            </button>
          ))}
        </div>
      </section>

      {/* Availability date */}
      <section>
        <h3 className="text-sm font-bold text-[#1E1E1E] mb-1.5">تاريخ الإتاحة (اختياري)</h3>
        <input
          type="date"
          value={draft.availabilityDate ?? ""}
          onChange={(e) => onChange({ availabilityDate: e.target.value || null })}
          min={new Date().toISOString().split("T")[0]}
          className="w-full h-11 bg-white border border-[#E8DDD0] rounded-xl px-3.5 text-[#1E1E1E] outline-none focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15"
          dir="ltr"
        />
      </section>

      {/* Oman-specific features */}
      {!isLand && !isCommercial && (
        <section>
          <h3 className="text-sm font-bold text-[#1E1E1E] mb-1">خصائص عُمانية</h3>
          <p className="text-xs text-[#A89480] mb-3">اختر ما ينطبق على عقارك</p>
          <div className="flex flex-wrap gap-2">
            {OMAN_FEATURES.map((feat) => (
              <FeatureToggle
                key={feat.key}
                label={feat.labelAr}
                value={draft[feat.key as keyof ListingDraft] as boolean}
                onChange={(v) => onChange({ [feat.key]: v })}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
