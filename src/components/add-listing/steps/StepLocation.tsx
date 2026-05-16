"use client";

import { cn } from "@/lib/utils";
import { OMAN_GOVERNORATES } from "@/lib/constants/oman-locations";
import type { ListingDraft } from "@/types/listing-draft";

interface StepLocationProps {
  draft: ListingDraft;
  onChange: (patch: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
}

function SelectField({
  label,
  value,
  options,
  placeholder,
  onChange,
  disabled,
  error,
  required,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; labelAr: string }>;
  placeholder: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#1E1E1E]">
        {label}
        {required && <span className="text-[#C0392B] ms-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full h-11 bg-white border rounded-xl px-3.5 text-[#1E1E1E] outline-none appearance-none",
          "focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15",
          disabled ? "opacity-40 cursor-not-allowed bg-[#F5F0EA]" : "",
          error ? "border-[#C0392B]" : "border-[#E8DDD0]"
        )}
        dir="rtl"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.labelAr}</option>
        ))}
      </select>
      {error && <p className="text-xs text-[#C0392B]">{error}</p>}
    </div>
  );
}

function TextInput({
  label,
  value,
  placeholder,
  onChange,
  error,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#1E1E1E]">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-11 bg-white border rounded-xl px-3.5 text-[#1E1E1E] placeholder:text-[#A89480] outline-none",
          "focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15",
          error ? "border-[#C0392B]" : "border-[#E8DDD0]"
        )}
        dir="rtl"
      />
      {error && <p className="text-xs text-[#C0392B]">{error}</p>}
    </div>
  );
}

export function StepLocation({ draft, onChange, errors }: StepLocationProps) {
  // Derive governorate options
  const governorateOptions = OMAN_GOVERNORATES.map((g) => ({
    value: g.id,
    labelAr: g.nameAr,
  }));

  // Derive wilayat options from selected governorate
  const selectedGov = OMAN_GOVERNORATES.find((g) => g.id === draft.governorateId);
  const wilayatOptions = selectedGov
    ? selectedGov.wilayats.map((w) => ({ value: w.id, labelAr: w.nameAr }))
    : [];

  // Derive area options from selected wilayat
  const selectedWilayat = selectedGov?.wilayats.find((w) => w.id === draft.wilayatId);
  const areaOptions = selectedWilayat
    ? selectedWilayat.areas.map((a) => ({ value: a.id, labelAr: a.nameAr }))
    : [];

  function handleGovernorateChange(govId: string) {
    const gov = OMAN_GOVERNORATES.find((g) => g.id === govId);
    onChange({
      governorateId: govId || null,
      governorateAr: gov?.nameAr ?? "",
      wilayatId: null,
      wilayatAr: "",
      areaId: null,
      areaAr: "",
    });
  }

  function handleWilayatChange(wilayatId: string) {
    const wilayat = selectedGov?.wilayats.find((w) => w.id === wilayatId);
    onChange({
      wilayatId: wilayatId || null,
      wilayatAr: wilayat?.nameAr ?? "",
      areaId: null,
      areaAr: "",
    });
  }

  function handleAreaChange(areaId: string) {
    const area = selectedWilayat?.areas.find((a) => a.id === areaId);
    onChange({
      areaId: areaId || null,
      areaAr: area?.nameAr ?? "",
    });
  }

  return (
    <div className="px-4 py-6 space-y-4" dir="rtl">
      <p className="text-sm text-[#7A6B5E] leading-relaxed">
        حدد موقع عقارك بدقة. كلما كانت المعلومات أكثر تفصيلاً، زاد اهتمام المشترين.
      </p>

      {/* Governorate */}
      <SelectField
        label="المحافظة"
        value={draft.governorateId ?? ""}
        options={governorateOptions}
        placeholder="اختر المحافظة"
        onChange={handleGovernorateChange}
        error={errors.governorateId}
        required
      />

      {/* Wilayat */}
      <SelectField
        label="الولاية"
        value={draft.wilayatId ?? ""}
        options={wilayatOptions}
        placeholder="اختر الولاية"
        onChange={handleWilayatChange}
        disabled={!draft.governorateId}
        error={errors.wilayatId}
        required
      />

      {/* Area */}
      <SelectField
        label="المنطقة / الحي"
        value={draft.areaId ?? ""}
        options={areaOptions}
        placeholder="اختر المنطقة"
        onChange={handleAreaChange}
        disabled={!draft.wilayatId}
      />

      {/* Block & Street */}
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label="رقم البلوك (اختياري)"
          value={draft.block}
          placeholder="مثال: ٣"
          onChange={(v) => onChange({ block: v })}
        />
        <TextInput
          label="اسم الشارع (اختياري)"
          value={draft.street}
          placeholder="مثال: شارع الخوير"
          onChange={(v) => onChange({ street: v })}
        />
      </div>

      {/* Location notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1E1E1E]">ملاحظات الموقع (اختياري)</label>
        <textarea
          value={draft.locationNotes}
          placeholder="مثال: بجانب مسجد X، أمام مدرسة Y..."
          onChange={(e) => onChange({ locationNotes: e.target.value })}
          rows={2}
          className="w-full bg-white border border-[#E8DDD0] rounded-xl px-3.5 py-2.5 text-sm text-[#1E1E1E] placeholder:text-[#A89480] outline-none focus:border-[#C65D3B] focus:ring-2 focus:ring-[#C65D3B]/15 resize-none"
        />
      </div>

      {/* Hide exact location toggle */}
      <button
        onClick={() => onChange({ hideExactLocation: !draft.hideExactLocation })}
        className="w-full flex items-center justify-between py-3 px-4 bg-white rounded-2xl border border-[#F0EBE3]"
        role="switch"
        aria-checked={draft.hideExactLocation}
      >
        <div className="text-right">
          <p className="text-sm font-medium text-[#1E1E1E]">إخفاء الموقع الدقيق</p>
          <p className="text-xs text-[#A89480]">يُظهر الموقع التقريبي فقط على الخريطة</p>
        </div>
        <div
          className={cn(
            "w-11 h-6 rounded-full transition-all flex-shrink-0 ms-3 relative",
            draft.hideExactLocation ? "bg-[#C65D3B]" : "bg-[#E8DDD0]"
          )}
        >
          <div
            className={cn(
              "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all",
              draft.hideExactLocation ? "start-5" : "start-0.5"
            )}
          />
        </div>
      </button>

      {/* Map pin placeholder */}
      <div className="bg-[#F5F0EA] rounded-2xl border border-dashed border-[#E8DDD0] px-4 py-5 text-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A89480" strokeWidth="1.5" className="mx-auto mb-2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p className="text-sm font-medium text-[#7A6B5E] mb-1">تحديد الموقع على الخريطة</p>
        <p className="text-xs text-[#A89480]">
          سيتم توفير رابط الموقع التفاعلي في التحديث القادم
        </p>
      </div>
    </div>
  );
}
