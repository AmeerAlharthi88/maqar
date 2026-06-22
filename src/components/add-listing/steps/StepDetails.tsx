"use client";

import { cn } from "@/lib/utils";
import {
  FURNISHING_OPTIONS,
  PROPERTY_AGE_OPTIONS,
} from "@/lib/constants/add-listing";
import {
  isFieldVisible,
  isFieldRequired,
  getAreaLabels,
  getFieldLabel,
  LAND_USE_OPTIONS,
  ROAD_ACCESS_OPTIONS,
  WATER_SOURCE_OPTIONS,
  KITCHEN_TYPE_OPTIONS,
  type FieldName,
} from "@/lib/constants/listing-field-config";
import { useTranslation } from "@/i18n/useTranslation";
import type { ListingDraft } from "@/types/listing-draft";
import type { FurnishingStatus, PropertyType } from "@/types/listing";

// ─────────────────────────────────────────────────────────────────────────────
// Primitive UI controls
// ─────────────────────────────────────────────────────────────────────────────

function NumericStepper({
  label,
  value,
  min = 0,
  max = 50,
  onChange,
  error,
}: {
  label: string;
  value: number | null;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  error?: string;
}) {
  const current = value ?? 0;
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[#627D98]">{label}</label>
      <div
        className={cn(
          "flex items-center gap-2 bg-white border rounded-xl p-1",
          error ? "border-[#C0392B]" : "border-[#E2E8F0]"
        )}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, current - 1))}
          className="w-9 h-9 rounded-lg bg-[#F0F4F8] text-[#102A43] text-lg font-bold flex items-center justify-center active:bg-[#E2E8F0] flex-shrink-0"
          aria-label={`-`}
        >
          −
        </button>
        <span className="flex-1 text-center text-base font-bold text-[#102A43]">
          {current}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, current + 1))}
          className="w-9 h-9 rounded-lg bg-[#F0F4F8] text-[#102A43] text-lg font-bold flex items-center justify-center active:bg-[#E2E8F0] flex-shrink-0"
          aria-label={`+`}
        >
          +
        </button>
      </div>
      {error && <p className="text-xs text-[#C0392B]">{error}</p>}
    </div>
  );
}

function NumberInput({
  label,
  value,
  placeholder,
  suffix,
  onChange,
  error,
  required,
}: {
  label: string;
  value: number | null;
  placeholder?: string;
  suffix?: string;
  onChange: (v: number | null) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#102A43]">
        {label}
        {required && <span className="text-[#C0392B] ms-0.5">*</span>}
      </label>
      <div className="relative flex items-center" dir="ltr">
        <input
          type="number"
          inputMode="numeric"
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? null : parseFloat(v));
          }}
          className={cn(
            "w-full h-11 bg-white border rounded-xl px-3.5 text-[#102A43] placeholder:text-[#627D98] outline-none",
            "focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15",
            suffix ? "pe-12" : "",
            error ? "border-[#C0392B]" : "border-[#E2E8F0]"
          )}
          dir="ltr"
        />
        {suffix && (
          <span className="absolute end-3 text-xs text-[#627D98] pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {/* Example/helper is shown BELOW the field — never inside the input — so it
          can't overlap the typed value or the unit suffix in RTL. */}
      {placeholder && !error && (
        <p className="text-[11px] text-[#627D98]">{placeholder}</p>
      )}
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
  dir: inputDir = "rtl",
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  error?: string;
  dir?: "rtl" | "ltr";
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
        dir={inputDir}
      />
      {error && <p className="text-xs text-[#C0392B]">{error}</p>}
    </div>
  );
}

function SelectPills({
  label,
  options,
  value,
  onChange,
  error,
  required,
  columns = 2,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  columns?: 2 | 3;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#102A43]">
        {label}
        {required && <span className="text-[#C0392B] ms-0.5">*</span>}
      </label>
      <div
        className={cn(
          "grid gap-2",
          columns === 3 ? "grid-cols-3" : "grid-cols-2"
        )}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "py-2.5 px-2 rounded-xl border text-xs font-medium transition-all text-center",
              value === opt.value
                ? "border-[#0A3C36] bg-[#E6F0EF] text-[#0A3C36]"
                : "border-[#E2E8F0] bg-white text-[#102A43]"
            )}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-[#C0392B]">{error}</p>}
    </div>
  );
}

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
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-medium transition-all",
        value
          ? "border-[#0A3C36] bg-[#E6F0EF] text-[#0A3C36]"
          : "border-[#E2E8F0] bg-white text-[#627D98]"
      )}
      aria-pressed={value}
    >
      {value && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )}
      {label}
    </button>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-bold text-[#102A43]">{title}</h3>
      {subtitle && <p className="text-xs text-[#627D98] mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Field visibility helper
// ─────────────────────────────────────────────────────────────────────────────

function useFieldVis(pt: PropertyType | null) {
  const show = (field: FieldName) => isFieldVisible(pt, field);
  const req  = (field: FieldName) => isFieldRequired(pt, field);
  return { show, req };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

interface StepDetailsProps {
  draft: ListingDraft;
  onChange: (patch: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
}

export function StepDetails({ draft, onChange, errors }: StepDetailsProps) {
  const { locale } = useTranslation();
  const isAr = locale === "ar";
  const pt = draft.propertyType;
  const { show, req } = useFieldVis(pt);
  const areaLabels = getAreaLabels(pt);

  // Helper: get bilingual option label
  function optLabel(opt: { labelAr: string; labelEn?: string }): string {
    return isAr ? opt.labelAr : (opt.labelEn ?? opt.labelAr);
  }

  // Convert option arrays for SelectPills
  function toOptions(opts: { value: string; labelAr: string; labelEn?: string }[]) {
    return opts.map((o) => ({ value: o.value, label: optLabel(o) }));
  }

  // ── Section: Bedrooms / Bathrooms ─────────────────────────────────────────
  const showRoomSection = show("bedrooms") || show("bathrooms");

  // ── Section: Areas ────────────────────────────────────────────────────────
  const showBuiltUp   = show("builtUpArea");
  const showLandArea  = show("landArea");

  // ── Section: Floors ───────────────────────────────────────────────────────
  const showFloorNum   = show("floorNumber");
  const showTotalFloors = show("totalFloorsInBuilding");
  const showVillaFloors = show("villaFloorCount");
  const showFloorSection = showFloorNum || showTotalFloors || showVillaFloors;

  // ── Section: Parking ──────────────────────────────────────────────────────
  const showParking = show("parkingSpots");

  // ── Section: Villa features ───────────────────────────────────────────────
  const showVillaFeatures =
    show("majlisCount") || show("maidRoom") || show("driverRoom") ||
    show("privatePool") || show("yard") || show("balconyCount") ||
    show("centralAc") || show("kitchenType") || show("storeRoom");

  // ── Section: Apartment amenities ─────────────────────────────────────────
  const showAptAmenities =
    show("elevator") || show("security") || show("sharedPool") ||
    show("sharedGym") || show("balcony") || show("centralAc") ||
    show("maidRoom");

  // ── Section: Views ────────────────────────────────────────────────────────
  const showViews = show("seaView") || show("mountainView");

  // ── Section: Furnishing ───────────────────────────────────────────────────
  const showFurnishing = show("furnishing");

  // ── Section: Property age ─────────────────────────────────────────────────
  const showAge = show("propertyAge");

  // ── Section: Land ─────────────────────────────────────────────────────────
  const showLandUse = show("landUse");
  const showLandAccess =
    show("roadAccess") || show("electricityAvailable") ||
    show("waterAvailable") || show("sewageAvailable");
  const showLandProps =
    show("cornerPlot") || show("boundaryWall") || show("plotNumber");
  const showLandNearby = show("nearbyMosque") || show("nearbySchool");

  // ── Section: Farm ─────────────────────────────────────────────────────────
  const showFarmWater      = show("waterSource");
  const showFarmHouse      = show("farmHouseExists");
  const showFarmDetails    = show("numberOfWells") || show("palmTreesCount") || show("otherTrees");
  const showFarmAmenities  = show("electricityAvailable") || show("pavedRoad") || show("boundaryWall");
  const showFarmLicense    = show("agriculturalLicense");

  // ── Section: Commercial ───────────────────────────────────────────────────
  const showCommercialFeatures =
    show("shopFrontage") || show("commercialLicense") ||
    show("displayWindow") || show("mainRoadFacing") || show("storeRoom");

  // ── Section: Office ───────────────────────────────────────────────────────
  const showOfficeFeatures =
    show("meetingRooms") || show("receptionArea") ||
    show("internetReady") || show("security") || show("elevator");

  // ── Section: Warehouse ────────────────────────────────────────────────────
  const showWarehouseTech =
    show("ceilingHeight") || show("powerCapacity");
  const showWarehouseAccess =
    show("loadingDock") || show("truckAccess");
  const showWarehouseSafety =
    show("fireSafety") || show("fenced") || show("crane") || show("officeSpace");

  // ── Section: Building ─────────────────────────────────────────────────────
  const showBuildingFeatures =
    show("commercialGroundFloor") || show("elevator") || show("currentRentalIncome");

  // ── Section: Chalet ───────────────────────────────────────────────────────
  const showChaletFeatures =
    show("privatePool") || show("yard") || show("barbecue") ||
    show("sharedBeachAccess") || show("maidRoom");

  return (
    <div className="px-4 py-6 space-y-6">

      {/* ── No type selected guard ──────────────────────────────────────── */}
      {!pt && (
        <div className="text-center py-10 text-sm text-[#627D98]">
          {isAr
            ? "يرجى اختيار نوع العقار في الخطوة السابقة أولاً"
            : "Please select a property type in the previous step first"}
        </div>
      )}

      {/* ── Bedrooms / Bathrooms ─────────────────────────────────────────── */}
      {showRoomSection && (
        <section>
          <SectionHeader title={isAr ? "الغرف" : "Rooms"} />
          <div className="grid grid-cols-2 gap-3">
            {show("bedrooms") && (
              <NumericStepper
                label={`${getFieldLabel("bedrooms", locale)}${req("bedrooms") ? " *" : ""}`}
                value={draft.bedrooms}
                min={0}
                max={20}
                onChange={(v) => onChange({ bedrooms: v })}
                error={errors.bedrooms}
              />
            )}
            {show("bathrooms") && (
              <NumericStepper
                label={`${getFieldLabel("bathrooms", locale)}${req("bathrooms") ? " *" : ""}`}
                value={draft.bathrooms}
                min={0}
                max={20}
                onChange={(v) => onChange({ bathrooms: v })}
                error={errors.bathrooms}
              />
            )}
          </div>
        </section>
      )}

      {/* ── Area fields ──────────────────────────────────────────────────── */}
      {(showBuiltUp || showLandArea) && (
        <section>
          <SectionHeader title={isAr ? "المساحة" : "Area"} />
          <div className="space-y-3">
            {showBuiltUp && (
              <NumberInput
                label={areaLabels.builtUp}
                value={draft.area}
                placeholder={isAr ? "مثال: 200" : "e.g. 200"}
                suffix="م²"
                onChange={(v) => onChange({ area: v })}
                error={errors.area}
                required={req("builtUpArea")}
              />
            )}
            {showLandArea && (
              <NumberInput
                label={areaLabels.land}
                value={draft.landArea}
                placeholder={isAr ? "مثال: 400" : "e.g. 400"}
                suffix="م²"
                onChange={(v) => onChange({ landArea: v })}
                error={errors.landArea}
                required={req("landArea")}
              />
            )}
            {/* Farm: show farmhouse area only when farmhouse exists */}
            {pt === "farm" && draft.farmHouseExists && showBuiltUp && (
              <p className="text-xs text-[#627D98]">
                {isAr
                  ? "مساحة المنزل الزراعي: أدخل مساحة البناء أعلاه"
                  : "Farmhouse area: enter the built-up area above"}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Floor fields ─────────────────────────────────────────────────── */}
      {showFloorSection && (
        <section>
          <SectionHeader title={isAr ? "الطوابق" : "Floors"} />
          <div className="grid grid-cols-2 gap-3">
            {showFloorNum && (
              <NumberInput
                label={getFieldLabel("floorNumber", locale)}
                value={draft.floorNumber}
                placeholder={isAr ? "مثال: 3" : "e.g. 3"}
                onChange={(v) => onChange({ floorNumber: v })}
                error={errors.floorNumber}
                required={req("floorNumber")}
              />
            )}
            {showTotalFloors && (
              <NumberInput
                label={getFieldLabel("totalFloorsInBuilding", locale)}
                value={draft.totalFloorsInBuilding}
                placeholder={isAr ? "مثال: 10" : "e.g. 10"}
                onChange={(v) => onChange({ totalFloorsInBuilding: v })}
                error={errors.totalFloorsInBuilding}
                required={req("totalFloorsInBuilding")}
              />
            )}
            {showVillaFloors && (
              <NumericStepper
                label={`${getFieldLabel("villaFloorCount", locale)}${req("villaFloorCount") ? " *" : ""}`}
                value={draft.floors}
                min={1}
                max={20}
                onChange={(v) => onChange({ floors: v })}
                error={errors.floors}
              />
            )}
          </div>
        </section>
      )}

      {/* ── Parking ──────────────────────────────────────────────────────── */}
      {showParking && (
        <section>
          <SectionHeader title={isAr ? "مواقف السيارات" : "Parking"} />
          <div className="max-w-[160px]">
            <NumericStepper
              label={getFieldLabel("parkingSpots", locale)}
              value={draft.parkingSpots}
              min={0}
              max={20}
              onChange={(v) => onChange({ parkingSpots: v })}
            />
          </div>
        </section>
      )}

      {/* ── Villa / Residential features ─────────────────────────────────── */}
      {showVillaFeatures && (
        <section>
          <SectionHeader
            title={isAr ? "خصائص الوحدة" : "Unit features"}
            subtitle={isAr ? "اختر ما ينطبق" : "Select all that apply"}
          />
          <div className="space-y-4">
            {/* Majlis count */}
            {show("majlisCount") && (
              <div className="max-w-[160px]">
                <NumericStepper
                  label={getFieldLabel("majlisCount", locale)}
                  value={draft.majlisCount}
                  min={0}
                  max={10}
                  onChange={(v) => onChange({ majlisCount: v, hasMajlis: v > 0 })}
                />
              </div>
            )}
            {/* Balcony count */}
            {show("balconyCount") && (
              <div className="max-w-[160px]">
                <NumericStepper
                  label={getFieldLabel("balconyCount", locale)}
                  value={draft.balconyCount}
                  min={0}
                  max={10}
                  onChange={(v) => onChange({ balconyCount: v })}
                />
              </div>
            )}
            {/* Kitchen type */}
            {show("kitchenType") && (
              <SelectPills
                label={getFieldLabel("kitchenType", locale)}
                options={toOptions(KITCHEN_TYPE_OPTIONS)}
                value={draft.kitchenType}
                onChange={(v) => onChange({ kitchenType: v })}
                columns={3}
              />
            )}
            {/* Boolean toggles */}
            <div className="flex flex-wrap gap-2">
              {show("maidRoom") && (
                <FeatureToggle
                  label={getFieldLabel("maidRoom", locale)}
                  value={draft.hasMaidRoom}
                  onChange={(v) => onChange({ hasMaidRoom: v })}
                />
              )}
              {show("driverRoom") && (
                <FeatureToggle
                  label={getFieldLabel("driverRoom", locale)}
                  value={draft.hasDriverRoom}
                  onChange={(v) => onChange({ hasDriverRoom: v })}
                />
              )}
              {show("privatePool") && (
                <FeatureToggle
                  label={getFieldLabel("privatePool", locale)}
                  value={draft.hasPrivatePool}
                  onChange={(v) => onChange({ hasPrivatePool: v })}
                />
              )}
              {show("yard") && (
                <FeatureToggle
                  label={getFieldLabel("yard", locale)}
                  value={draft.hasYard}
                  onChange={(v) => onChange({ hasYard: v })}
                />
              )}
              {show("centralAc") && (
                <FeatureToggle
                  label={getFieldLabel("centralAc", locale)}
                  value={draft.hasCentralAc}
                  onChange={(v) => onChange({ hasCentralAc: v })}
                />
              )}
              {show("storeRoom") && (
                <FeatureToggle
                  label={getFieldLabel("storeRoom", locale)}
                  value={draft.hasStoreRoom}
                  onChange={(v) => onChange({ hasStoreRoom: v })}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Apartment amenities ───────────────────────────────────────────── */}
      {showAptAmenities && (
        <section>
          <SectionHeader
            title={isAr ? "مرافق المبنى" : "Building amenities"}
            subtitle={isAr ? "اختر ما ينطبق" : "Select all that apply"}
          />
          <div className="flex flex-wrap gap-2">
            {show("elevator") && (
              <FeatureToggle
                label={getFieldLabel("elevator", locale)}
                value={draft.hasElevator}
                onChange={(v) => onChange({ hasElevator: v })}
              />
            )}
            {show("security") && (
              <FeatureToggle
                label={getFieldLabel("security", locale)}
                value={draft.hasSecurity}
                onChange={(v) => onChange({ hasSecurity: v })}
              />
            )}
            {show("sharedPool") && (
              <FeatureToggle
                label={getFieldLabel("sharedPool", locale)}
                value={draft.hasSharedPool}
                onChange={(v) => onChange({ hasSharedPool: v })}
              />
            )}
            {show("sharedGym") && (
              <FeatureToggle
                label={getFieldLabel("sharedGym", locale)}
                value={draft.hasSharedGym}
                onChange={(v) => onChange({ hasSharedGym: v })}
              />
            )}
            {show("balcony") && (
              <FeatureToggle
                label={getFieldLabel("balcony", locale)}
                value={draft.hasBalcony}
                onChange={(v) => onChange({ hasBalcony: v })}
              />
            )}
            {show("centralAc") && (
              <FeatureToggle
                label={getFieldLabel("centralAc", locale)}
                value={draft.hasCentralAc}
                onChange={(v) => onChange({ hasCentralAc: v })}
              />
            )}
            {show("maidRoom") && (
              <FeatureToggle
                label={getFieldLabel("maidRoom", locale)}
                value={draft.hasMaidRoom}
                onChange={(v) => onChange({ hasMaidRoom: v })}
              />
            )}
          </div>
        </section>
      )}

      {/* ── Views ────────────────────────────────────────────────────────── */}
      {showViews && (
        <section>
          <SectionHeader title={isAr ? "الإطلالة" : "Views"} />
          <div className="flex flex-wrap gap-2">
            {show("seaView") && (
              <FeatureToggle
                label={getFieldLabel("seaView", locale)}
                value={draft.hasSeaView}
                onChange={(v) => onChange({ hasSeaView: v })}
              />
            )}
            {show("mountainView") && (
              <FeatureToggle
                label={getFieldLabel("mountainView", locale)}
                value={draft.hasMountainView}
                onChange={(v) => onChange({ hasMountainView: v })}
              />
            )}
          </div>
        </section>
      )}

      {/* ── Furnishing ───────────────────────────────────────────────────── */}
      {showFurnishing && (
        <section>
          <SectionHeader title={`${getFieldLabel("furnishing", locale)}${req("furnishing") ? " *" : ""}`} />
          <div className="flex flex-col gap-2">
            {FURNISHING_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  onChange({ furnishing: opt.value as FurnishingStatus })
                }
                className={cn(
                  "w-full py-3 rounded-xl border text-sm font-medium transition-all text-center",
                  draft.furnishing === opt.value
                    ? "border-[#0A3C36] bg-[#E6F0EF] text-[#0A3C36]"
                    : "border-[#E2E8F0] bg-white text-[#102A43]"
                )}
                aria-pressed={draft.furnishing === opt.value}
              >
                {isAr ? opt.labelAr : (opt.labelEn ?? opt.labelAr)}
              </button>
            ))}
            {errors.furnishing && (
              <p className="text-xs text-[#C0392B]">{errors.furnishing}</p>
            )}
          </div>
        </section>
      )}

      {/* ── Property age ─────────────────────────────────────────────────── */}
      {showAge && (
        <section>
          <SectionHeader title={`${getFieldLabel("propertyAge", locale)}${req("propertyAge") ? " *" : ""}`} />
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY_AGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ propertyAge: opt.value })}
                className={cn(
                  "py-2.5 rounded-xl border text-xs font-medium transition-all text-center",
                  draft.propertyAge === opt.value
                    ? "border-[#0A3C36] bg-[#E6F0EF] text-[#0A3C36]"
                    : "border-[#E2E8F0] bg-white text-[#102A43]"
                )}
                aria-pressed={draft.propertyAge === opt.value}
              >
                {isAr ? opt.labelAr : (opt.labelEn ?? opt.labelAr)}
              </button>
            ))}
          </div>
          {errors.propertyAge && (
            <p className="text-xs text-[#C0392B] mt-1">{errors.propertyAge}</p>
          )}
        </section>
      )}

      {/* ── Availability date (all applicable types) ─────────────────────── */}
      {pt && !["land"].includes(pt) && (
        <section>
          <SectionHeader title={isAr ? "تاريخ الإتاحة (اختياري)" : "Availability date (optional)"} />
          <input
            type="date"
            value={draft.availabilityDate ?? ""}
            onChange={(e) =>
              onChange({ availabilityDate: e.target.value || null })
            }
            min={new Date().toISOString().split("T")[0]}
            className="w-full h-11 bg-white border border-[#E2E8F0] rounded-xl px-3.5 text-[#102A43] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15"
            dir="ltr"
          />
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  LAND                                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {showLandUse && (
        <section>
          <SelectPills
            label={getFieldLabel("landUse", locale)}
            options={toOptions(LAND_USE_OPTIONS)}
            value={draft.landUse}
            onChange={(v) => onChange({ landUse: v })}
            error={errors.landUse}
            required={req("landUse")}
            columns={3}
          />
        </section>
      )}

      {showLandAccess && (
        <section>
          <SectionHeader title={isAr ? "الوصول والبنية التحتية" : "Access & infrastructure"} />
          <div className="space-y-3">
            {show("roadAccess") && (
              <SelectPills
                label={getFieldLabel("roadAccess", locale)}
                options={toOptions(ROAD_ACCESS_OPTIONS)}
                value={draft.roadAccess}
                onChange={(v) => onChange({ roadAccess: v })}
              />
            )}
            <div className="flex flex-wrap gap-2">
              {show("electricityAvailable") && (
                <FeatureToggle
                  label={getFieldLabel("electricityAvailable", locale)}
                  value={draft.hasElectricity}
                  onChange={(v) => onChange({ hasElectricity: v })}
                />
              )}
              {show("waterAvailable") && (
                <FeatureToggle
                  label={getFieldLabel("waterAvailable", locale)}
                  value={draft.hasWater}
                  onChange={(v) => onChange({ hasWater: v })}
                />
              )}
              {show("sewageAvailable") && (
                <FeatureToggle
                  label={getFieldLabel("sewageAvailable", locale)}
                  value={draft.hasSewage}
                  onChange={(v) => onChange({ hasSewage: v })}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {showLandProps && (
        <section>
          <SectionHeader title={isAr ? "خصائص القطعة" : "Plot characteristics"} />
          <div className="space-y-3">
            {show("plotNumber") && (
              <TextInput
                label={getFieldLabel("plotNumber", locale)}
                value={draft.plotNumber}
                placeholder={isAr ? "مثال: P123456" : "e.g. P123456"}
                onChange={(v) => onChange({ plotNumber: v })}
                dir="ltr"
              />
            )}
            <div className="flex flex-wrap gap-2">
              {show("cornerPlot") && (
                <FeatureToggle
                  label={getFieldLabel("cornerPlot", locale)}
                  value={draft.isCornerPlot}
                  onChange={(v) => onChange({ isCornerPlot: v })}
                />
              )}
              {show("boundaryWall") && (
                <FeatureToggle
                  label={getFieldLabel("boundaryWall", locale)}
                  value={draft.hasBoundaryWall}
                  onChange={(v) => onChange({ hasBoundaryWall: v })}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {showLandNearby && (
        <section>
          <SectionHeader title={isAr ? "الخدمات القريبة" : "Nearby services"} />
          <div className="flex flex-wrap gap-2">
            {show("nearbyMosque") && (
              <FeatureToggle
                label={getFieldLabel("nearbyMosque", locale)}
                value={draft.hasNearbyMosque}
                onChange={(v) => onChange({ hasNearbyMosque: v })}
              />
            )}
            {show("nearbySchool") && (
              <FeatureToggle
                label={getFieldLabel("nearbySchool", locale)}
                value={draft.hasNearbySchool}
                onChange={(v) => onChange({ hasNearbySchool: v })}
              />
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  FARM                                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {showFarmWater && (
        <section>
          <SelectPills
            label={getFieldLabel("waterSource", locale)}
            options={toOptions(WATER_SOURCE_OPTIONS)}
            value={draft.waterSource}
            onChange={(v) => onChange({ waterSource: v })}
            error={errors.waterSource}
            required={req("waterSource")}
            columns={3}
          />
        </section>
      )}

      {showFarmHouse && (
        <section>
          <SectionHeader title={isAr ? "المنزل الزراعي" : "Farmhouse"} />
          <FeatureToggle
            label={getFieldLabel("farmHouseExists", locale)}
            value={draft.farmHouseExists}
            onChange={(v) => onChange({ farmHouseExists: v })}
          />
          {draft.farmHouseExists && (
            <div className="mt-3">
              <NumberInput
                label={isAr ? "مساحة المنزل الزراعي (م²)" : "Farmhouse area (sqm)"}
                value={draft.area}
                placeholder={isAr ? "مثال: 150" : "e.g. 150"}
                suffix="م²"
                onChange={(v) => onChange({ area: v })}
                error={errors.area}
              />
            </div>
          )}
        </section>
      )}

      {showFarmDetails && (
        <section>
          <SectionHeader title={isAr ? "الآبار والمحاصيل" : "Wells & crops"} />
          <div className="space-y-3">
            {show("numberOfWells") && (
              <div className="max-w-[160px]">
                <NumericStepper
                  label={getFieldLabel("numberOfWells", locale)}
                  value={draft.numberOfWells}
                  min={0}
                  max={50}
                  onChange={(v) => onChange({ numberOfWells: v })}
                />
              </div>
            )}
            {show("palmTreesCount") && (
              <NumberInput
                label={getFieldLabel("palmTreesCount", locale)}
                value={draft.palmTreesCount}
                placeholder={isAr ? "مثال: 50" : "e.g. 50"}
                onChange={(v) => onChange({ palmTreesCount: v })}
              />
            )}
            {show("otherTrees") && (
              <TextInput
                label={getFieldLabel("otherTrees", locale)}
                value={draft.otherTrees}
                placeholder={isAr ? "مثال: ليمون، مانغو" : "e.g. lemon, mango"}
                onChange={(v) => onChange({ otherTrees: v })}
              />
            )}
          </div>
        </section>
      )}

      {showFarmAmenities && (
        <section>
          <SectionHeader title={isAr ? "مرافق المزرعة" : "Farm utilities"} />
          <div className="flex flex-wrap gap-2">
            {show("electricityAvailable") && (
              <FeatureToggle
                label={getFieldLabel("electricityAvailable", locale)}
                value={draft.hasElectricity}
                onChange={(v) => onChange({ hasElectricity: v })}
              />
            )}
            {show("pavedRoad") && (
              <FeatureToggle
                label={getFieldLabel("pavedRoad", locale)}
                value={draft.hasPavedRoad}
                onChange={(v) => onChange({ hasPavedRoad: v })}
              />
            )}
            {show("boundaryWall") && (
              <FeatureToggle
                label={getFieldLabel("boundaryWall", locale)}
                value={draft.hasBoundaryWall}
                onChange={(v) => onChange({ hasBoundaryWall: v })}
              />
            )}
            {show("mountainView") && (
              <FeatureToggle
                label={getFieldLabel("mountainView", locale)}
                value={draft.hasMountainView}
                onChange={(v) => onChange({ hasMountainView: v })}
              />
            )}
          </div>
        </section>
      )}

      {showFarmLicense && (
        <section>
          <SectionHeader title={isAr ? "الترخيص" : "License"} />
          <FeatureToggle
            label={getFieldLabel("agriculturalLicense", locale)}
            value={draft.hasAgriculturalLicense}
            onChange={(v) => onChange({ hasAgriculturalLicense: v })}
          />
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  COMMERCIAL SHOP                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {showCommercialFeatures && (
        <section>
          <SectionHeader title={isAr ? "مواصفات المحل" : "Shop specifications"} />
          <div className="space-y-3">
            {show("shopFrontage") && (
              <NumberInput
                label={getFieldLabel("shopFrontage", locale)}
                value={draft.shopFrontageMeters}
                placeholder={isAr ? "مثال: 8" : "e.g. 8"}
                suffix="م"
                onChange={(v) => onChange({ shopFrontageMeters: v })}
              />
            )}
            <div className="flex flex-wrap gap-2">
              {show("displayWindow") && (
                <FeatureToggle
                  label={getFieldLabel("displayWindow", locale)}
                  value={draft.hasDisplayWindow}
                  onChange={(v) => onChange({ hasDisplayWindow: v })}
                />
              )}
              {show("mainRoadFacing") && (
                <FeatureToggle
                  label={getFieldLabel("mainRoadFacing", locale)}
                  value={draft.isMainRoadFacing}
                  onChange={(v) => onChange({ isMainRoadFacing: v })}
                />
              )}
              {show("commercialLicense") && (
                <FeatureToggle
                  label={getFieldLabel("commercialLicense", locale)}
                  value={draft.hasCommercialLicense}
                  onChange={(v) => onChange({ hasCommercialLicense: v })}
                />
              )}
              {show("storeRoom") && (
                <FeatureToggle
                  label={getFieldLabel("storeRoom", locale)}
                  value={draft.hasStoreRoom}
                  onChange={(v) => onChange({ hasStoreRoom: v })}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  OFFICE                                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {showOfficeFeatures && (
        <section>
          <SectionHeader title={isAr ? "مرافق المكتب" : "Office amenities"} />
          <div className="space-y-3">
            {show("meetingRooms") && (
              <div className="max-w-[200px]">
                <NumericStepper
                  label={getFieldLabel("meetingRooms", locale)}
                  value={draft.meetingRoomsCount}
                  min={0}
                  max={20}
                  onChange={(v) => onChange({ meetingRoomsCount: v })}
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {show("receptionArea") && (
                <FeatureToggle
                  label={getFieldLabel("receptionArea", locale)}
                  value={draft.hasReceptionArea}
                  onChange={(v) => onChange({ hasReceptionArea: v })}
                />
              )}
              {show("internetReady") && (
                <FeatureToggle
                  label={getFieldLabel("internetReady", locale)}
                  value={draft.isInternetReady}
                  onChange={(v) => onChange({ isInternetReady: v })}
                />
              )}
              {show("security") && (
                <FeatureToggle
                  label={getFieldLabel("security", locale)}
                  value={draft.hasSecurity}
                  onChange={(v) => onChange({ hasSecurity: v })}
                />
              )}
              {show("elevator") && (
                <FeatureToggle
                  label={getFieldLabel("elevator", locale)}
                  value={draft.hasElevator}
                  onChange={(v) => onChange({ hasElevator: v })}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  WAREHOUSE                                                          */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {showWarehouseTech && (
        <section>
          <SectionHeader title={isAr ? "المواصفات التقنية" : "Technical specifications"} />
          <div className="grid grid-cols-2 gap-3">
            {show("ceilingHeight") && (
              <NumberInput
                label={getFieldLabel("ceilingHeight", locale)}
                value={draft.ceilingHeightMeters}
                placeholder={isAr ? "مثال: 8" : "e.g. 8"}
                suffix="م"
                onChange={(v) => onChange({ ceilingHeightMeters: v })}
              />
            )}
            {show("powerCapacity") && (
              <NumberInput
                label={getFieldLabel("powerCapacity", locale)}
                value={draft.powerCapacityKw}
                placeholder={isAr ? "مثال: 200" : "e.g. 200"}
                suffix={isAr ? "كيلوواط" : "kW"}
                onChange={(v) => onChange({ powerCapacityKw: v })}
              />
            )}
          </div>
        </section>
      )}

      {showWarehouseAccess && (
        <section>
          <SectionHeader title={isAr ? "المداخل واللوجستيات" : "Access & logistics"} />
          <div className="flex flex-wrap gap-2">
            {show("loadingDock") && (
              <FeatureToggle
                label={getFieldLabel("loadingDock", locale)}
                value={draft.hasLoadingDock}
                onChange={(v) => onChange({ hasLoadingDock: v })}
              />
            )}
            {show("truckAccess") && (
              <FeatureToggle
                label={getFieldLabel("truckAccess", locale)}
                value={draft.hasTruckAccess}
                onChange={(v) => onChange({ hasTruckAccess: v })}
              />
            )}
          </div>
        </section>
      )}

      {showWarehouseSafety && (
        <section>
          <SectionHeader title={isAr ? "الأمن والسلامة" : "Safety & security"} />
          <div className="flex flex-wrap gap-2">
            {show("fireSafety") && (
              <FeatureToggle
                label={getFieldLabel("fireSafety", locale)}
                value={draft.hasFireSafety}
                onChange={(v) => onChange({ hasFireSafety: v })}
              />
            )}
            {show("fenced") && (
              <FeatureToggle
                label={getFieldLabel("fenced", locale)}
                value={draft.isFenced}
                onChange={(v) => onChange({ isFenced: v })}
              />
            )}
            {show("crane") && (
              <FeatureToggle
                label={getFieldLabel("crane", locale)}
                value={draft.hasCrane}
                onChange={(v) => onChange({ hasCrane: v })}
              />
            )}
            {show("officeSpace") && (
              <FeatureToggle
                label={getFieldLabel("officeSpace", locale)}
                value={draft.hasOfficeSpace}
                onChange={(v) => onChange({ hasOfficeSpace: v })}
              />
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  BUILDING                                                           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {show("totalUnits") && (
        <section>
          <SectionHeader title={isAr ? "الوحدات" : "Units"} />
          <NumberInput
            label={getFieldLabel("totalUnits", locale)}
            value={draft.totalUnits}
            placeholder={isAr ? "مثال: 24" : "e.g. 24"}
            onChange={(v) => onChange({ totalUnits: v })}
            error={errors.totalUnits}
            required={req("totalUnits")}
          />
        </section>
      )}

      {showBuildingFeatures && (
        <section>
          <SectionHeader title={isAr ? "مميزات العمارة" : "Building features"} />
          <div className="space-y-3">
            {show("currentRentalIncome") && (
              <NumberInput
                label={getFieldLabel("currentRentalIncome", locale)}
                value={draft.currentRentalIncome}
                placeholder={isAr ? "مثال: 2500" : "e.g. 2500"}
                suffix="ر.ع"
                onChange={(v) => onChange({ currentRentalIncome: v })}
              />
            )}
            <div className="flex flex-wrap gap-2">
              {show("commercialGroundFloor") && (
                <FeatureToggle
                  label={getFieldLabel("commercialGroundFloor", locale)}
                  value={draft.hasCommercialGroundFloor}
                  onChange={(v) => onChange({ hasCommercialGroundFloor: v })}
                />
              )}
              {show("elevator") && (
                <FeatureToggle
                  label={getFieldLabel("elevator", locale)}
                  value={draft.hasElevator}
                  onChange={(v) => onChange({ hasElevator: v })}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  CHALET                                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}

      {showChaletFeatures && (
        <section>
          <SectionHeader title={isAr ? "مميزات الشاليه" : "Chalet features"} />
          <div className="flex flex-wrap gap-2">
            {show("privatePool") && (
              <FeatureToggle
                label={getFieldLabel("privatePool", locale)}
                value={draft.hasPrivatePool}
                onChange={(v) => onChange({ hasPrivatePool: v })}
              />
            )}
            {show("yard") && (
              <FeatureToggle
                label={getFieldLabel("yard", locale)}
                value={draft.hasYard}
                onChange={(v) => onChange({ hasYard: v })}
              />
            )}
            {show("barbecue") && (
              <FeatureToggle
                label={getFieldLabel("barbecue", locale)}
                value={draft.hasBarbecue}
                onChange={(v) => onChange({ hasBarbecue: v })}
              />
            )}
            {show("sharedBeachAccess") && (
              <FeatureToggle
                label={getFieldLabel("sharedBeachAccess", locale)}
                value={draft.hasSharedBeachAccess}
                onChange={(v) => onChange({ hasSharedBeachAccess: v })}
              />
            )}
            {show("maidRoom") && (
              <FeatureToggle
                label={getFieldLabel("maidRoom", locale)}
                value={draft.hasMaidRoom}
                onChange={(v) => onChange({ hasMaidRoom: v })}
              />
            )}
          </div>
        </section>
      )}

    </div>
  );
}
