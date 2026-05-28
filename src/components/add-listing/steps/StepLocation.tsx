"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { OMAN_GOVERNORATES } from "@/lib/constants/oman-locations";
import { useTranslation } from "@/i18n/useTranslation";
import type { ListingDraft } from "@/types/listing-draft";

// ── Map picker (client-only — Leaflet requires browser APIs) ─────────────────────
const DynamicMapPicker = dynamic(() => import("./MapPickerInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F0F4F8]">
      <div className="w-6 h-6 rounded-full border-2 border-[#E2E8F0] border-t-[#0A3C36] animate-spin" />
    </div>
  ),
});

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
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#102A43]">
        {label}
        {required && <span className="text-[#C0392B] ms-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "w-full h-11 bg-white border rounded-xl px-3.5 text-[#102A43] outline-none appearance-none",
            "focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15",
            disabled ? "opacity-40 cursor-not-allowed bg-[#F0F4F8]" : "cursor-pointer",
            error ? "border-[#C0392B]" : "border-[#E2E8F0]"
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="pointer-events-none absolute inset-y-0 start-3 flex items-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
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
      <label className="text-sm font-medium text-[#102A43]">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full h-11 bg-white border rounded-xl px-3.5 text-[#102A43] placeholder:text-[#627D98] outline-none",
          "focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15",
          error ? "border-[#C0392B]" : "border-[#E2E8F0]"
        )}
      />
      {error && <p className="text-xs text-[#C0392B]">{error}</p>}
    </div>
  );
}

export function StepLocation({ draft, onChange, errors }: StepLocationProps) {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";

  // Derive governorate options (bilingual)
  const governorateOptions = OMAN_GOVERNORATES.map((g) => ({
    value: g.id,
    label: isAr ? g.nameAr : (g.nameEn ?? g.nameAr),
  }));

  // Derive wilayat options from selected governorate
  const selectedGov = OMAN_GOVERNORATES.find((g) => g.id === draft.governorateId);
  const wilayatOptions = selectedGov
    ? selectedGov.wilayats.map((w) => ({
        value: w.id,
        label: isAr ? w.nameAr : (w.nameEn ?? w.nameAr),
      }))
    : [];

  // Derive area options from selected wilayat
  const selectedWilayat = selectedGov?.wilayats.find((w) => w.id === draft.wilayatId);
  const areaOptions = selectedWilayat
    ? selectedWilayat.areas.map((a) => ({
        value: a.id,
        label: isAr ? a.nameAr : (a.nameEn ?? a.nameAr),
      }))
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

  function handleMapSelect(lat: number, lng: number) {
    onChange({ mapLat: lat, mapLng: lng });
  }

  function clearMapPin() {
    onChange({ mapLat: null, mapLng: null });
  }

  const hasPinDropped = draft.mapLat !== null && draft.mapLng !== null;

  return (
    <div className="px-4 py-6 space-y-4">
      <p className="text-sm text-[#627D98] leading-relaxed">
        {t("addListing.location.hint")}
      </p>

      {/* Governorate */}
      <SelectField
        label={t("addListing.location.governorate")}
        value={draft.governorateId ?? ""}
        options={governorateOptions}
        placeholder={t("addListing.location.selectGovernorate")}
        onChange={handleGovernorateChange}
        error={errors.governorateId}
        required
      />

      {/* Wilayat */}
      <SelectField
        label={t("addListing.location.wilayat")}
        value={draft.wilayatId ?? ""}
        options={wilayatOptions}
        placeholder={t("addListing.location.selectWilayat")}
        onChange={handleWilayatChange}
        disabled={!draft.governorateId}
        error={errors.wilayatId}
        required
      />

      {/* Area */}
      <SelectField
        label={t("addListing.location.area")}
        value={draft.areaId ?? ""}
        options={areaOptions}
        placeholder={t("addListing.location.selectArea")}
        onChange={handleAreaChange}
        disabled={!draft.wilayatId}
      />

      {/* Block & Street */}
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label={t("addListing.location.block")}
          value={draft.block}
          placeholder={t("addListing.location.blockPlaceholder")}
          onChange={(v) => onChange({ block: v })}
        />
        <TextInput
          label={t("addListing.location.street")}
          value={draft.street}
          placeholder={t("addListing.location.streetPlaceholder")}
          onChange={(v) => onChange({ street: v })}
        />
      </div>

      {/* Location notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#102A43]">{t("addListing.location.notes")}</label>
        <textarea
          value={draft.locationNotes}
          placeholder={t("addListing.location.notesPlaceholder")}
          onChange={(e) => onChange({ locationNotes: e.target.value })}
          rows={2}
          className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#102A43] placeholder:text-[#627D98] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15 resize-none"
        />
      </div>

      {/* Hide exact location toggle */}
      <button
        onClick={() => onChange({ hideExactLocation: !draft.hideExactLocation })}
        className="w-full flex items-center justify-between py-3 px-4 bg-white rounded-2xl border border-[#E2E8F0]"
        role="switch"
        aria-checked={draft.hideExactLocation}
      >
        <div className="text-start">
          <p className="text-sm font-medium text-[#102A43]">{t("addListing.location.hideExact")}</p>
          <p className="text-xs text-[#627D98]">{t("addListing.location.hideExactHint")}</p>
        </div>
        <div
          className={cn(
            "w-11 h-6 rounded-full transition-all flex-shrink-0 ms-3 relative",
            draft.hideExactLocation ? "bg-[#0A3C36]" : "bg-[#E2E8F0]"
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

      {/* ── Interactive map picker ──────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden border border-[#E2E8F0]">
        {/* Header */}
        <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm font-semibold text-[#102A43]">{t("addListing.location.mapTitle")}</span>
          </div>
          {hasPinDropped && (
            <button
              onClick={clearMapPin}
              className="text-xs text-[#C0392B] font-medium"
            >
              {t("addListing.location.removePin")}
            </button>
          )}
        </div>

        {/* Map container */}
        <div className="relative" style={{ height: 260 }}>
          <DynamicMapPicker
            lat={draft.mapLat}
            lng={draft.mapLng}
            onSelect={handleMapSelect}
          />

          {/* Instruction overlay — fades away once pin is dropped */}
          {!hasPinDropped && (
            <div className="absolute bottom-3 start-0 end-0 flex justify-center pointer-events-none z-[500]">
              <div className="bg-white/90 backdrop-blur-sm text-xs text-[#102A43] font-medium px-3 py-1.5 rounded-full border border-[#E2E8F0] shadow-sm">
                {t("addListing.location.mapHint")}
              </div>
            </div>
          )}

          {/* Coordinates badge — shown once pin is dropped */}
          {hasPinDropped && (
            <div className="absolute bottom-3 start-0 end-0 flex justify-center pointer-events-none z-[500]">
              <div className="bg-[#0A3C36]/90 backdrop-blur-sm text-xs text-white font-medium px-3 py-1.5 rounded-full shadow-sm">
                {t("addListing.location.mapPinDropped")}
              </div>
            </div>
          )}
        </div>

        {/* Optional hint */}
        <div className="bg-[#F8F9FA] px-4 py-2 border-t border-[#E2E8F0]">
          <p className="text-[11px] text-[#627D98]">
            {t("addListing.location.mapNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
