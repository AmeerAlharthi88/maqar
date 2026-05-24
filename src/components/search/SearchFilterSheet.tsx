"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { useSearchStore } from "@/store/search.store";
import { PROPERTY_TYPES, FURNISHING_LABELS } from "@/lib/constants/property-types";
import { OMAN_GOVERNORATES } from "@/lib/constants/oman-locations";
import { cn } from "@/lib/utils";

interface SearchFilterSheetProps {
  open: boolean;
  onClose: () => void;
  resultCount?: number;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="pb-5 border-b border-[#F5F0EA] last:border-0">
      <p className="text-sm font-bold text-[#1E1E1E] mb-3">{title}</p>
      {children}
    </section>
  );
}

function PurposeBtn({ label, value, active, onClick }: { label: string; value: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 h-10 rounded-xl text-sm font-semibold transition-colors border",
        active ? "bg-[#C65D3B] text-white border-[#C65D3B]" : "bg-white text-[#7A6B5E] border-[#E8DDD0] hover:border-[#C65D3B]"
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function CounterBtn({ value, onDecrement, onIncrement, min = 0 }: { value: number; onDecrement: () => void; onIncrement: () => void; min?: number }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrement}
        disabled={value <= min}
        className="w-9 h-9 rounded-full border border-[#E8DDD0] flex items-center justify-center text-[#7A6B5E] disabled:opacity-40 hover:border-[#C65D3B] hover:text-[#C65D3B] transition-colors"
        aria-label="تقليل"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <span className="w-6 text-center text-sm font-bold text-[#1E1E1E]">{value === 0 ? "أي" : `+${value}`}</span>
      <button
        onClick={onIncrement}
        className="w-9 h-9 rounded-full border border-[#E8DDD0] flex items-center justify-center text-[#7A6B5E] hover:border-[#C65D3B] hover:text-[#C65D3B] transition-colors"
        aria-label="زيادة"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  );
}

function BoolChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "px-3 h-8 rounded-full text-xs font-semibold border transition-colors",
        active ? "bg-[#C65D3B] text-white border-[#C65D3B]" : "bg-white text-[#7A6B5E] border-[#E8DDD0] hover:border-[#C65D3B]"
      )}
    >
      {label}
    </button>
  );
}

export function SearchFilterSheet({ open, onClose, resultCount }: SearchFilterSheetProps) {
  const { filters, setFilters, resetFilters } = useSearchStore();

  // Local draft state
  const [draft, setDraft] = useState(() => ({ ...filters }));

  function update<K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function toggleArr(key: "propertyTypes" | "furnishing", val: string) {
    const arr = draft[key] as string[];
    const next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
    update(key, next as (typeof draft)[typeof key]);
  }

  function handleApply() {
    setFilters(draft);
    onClose();
  }

  function handleReset() {
    const reset = {
      purpose: "all" as const,
      propertyTypes: [] as string[],
      governorateId: "",
      wilayatId: "",
      areaId: "",
      minPrice: null,
      maxPrice: null,
      minBeds: 0,
      minBaths: 0,
      minArea: null,
      maxArea: null,
      furnishing: [] as string[],
      isVerified: null,
      isFreehold: null,
      hasMajlis: null,
      hasMaidRoom: null,
      hasDriverRoom: null,
      hasParking: null,
      hasSeaView: null,
      hasMountainView: null,
      expatAllowed: null,
      familyOnly: null,
      amenities: [] as string[],
    };
    setDraft((d) => ({ ...d, ...reset }));
  }

  const selectedGov = OMAN_GOVERNORATES.find((g) => g.id === draft.governorateId);
  const wilayats = selectedGov?.wilayats ?? [];
  const selectedWilayat = wilayats.find((w) => w.id === draft.wilayatId);
  const areas = selectedWilayat?.areas ?? [];

  return (
    <BottomSheet open={open} onClose={onClose} title="تصفية النتائج" snapToContent={false}>
      <div className="flex flex-col gap-5 p-5">

        {/* Purpose */}
        <FilterSection title="الغرض">
          <div className="flex gap-2">
            <PurposeBtn label="الكل" value="all" active={draft.purpose === "all"} onClick={() => update("purpose", "all")} />
            <PurposeBtn label="للبيع" value="sale" active={draft.purpose === "sale"} onClick={() => update("purpose", "sale")} />
            <PurposeBtn label="للإيجار" value="rent" active={draft.purpose === "rent"} onClick={() => update("purpose", "rent")} />
          </div>
        </FilterSection>

        {/* Property type */}
        <FilterSection title="نوع العقار">
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((pt) => (
              <button
                key={pt.value}
                onClick={() => toggleArr("propertyTypes", pt.value)}
                aria-pressed={draft.propertyTypes.includes(pt.value)}
                className={cn(
                  "px-3 h-9 rounded-full text-xs font-semibold border transition-colors",
                  draft.propertyTypes.includes(pt.value)
                    ? "bg-[#C65D3B] text-white border-[#C65D3B]"
                    : "bg-white text-[#7A6B5E] border-[#E8DDD0] hover:border-[#C65D3B]"
                )}
              >
                {pt.labelAr}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection title="الموقع">
          <div className="flex flex-col gap-2">
            <select
              value={draft.governorateId}
              onChange={(e) => {
                update("governorateId", e.target.value);
                update("wilayatId", "");
                update("areaId", "");
              }}
              className="w-full h-11 px-4 rounded-xl border border-[#E8DDD0] text-sm text-[#1E1E1E] bg-white outline-none focus:border-[#C65D3B]"
              aria-label="المحافظة"
            >
              <option value="">جميع المحافظات</option>
              {OMAN_GOVERNORATES.map((g) => (
                <option key={g.id} value={g.id}>{g.nameAr}</option>
              ))}
            </select>

            {wilayats.length > 0 && (
              <select
                value={draft.wilayatId}
                onChange={(e) => {
                  update("wilayatId", e.target.value);
                  update("areaId", "");
                }}
                className="w-full h-11 px-4 rounded-xl border border-[#E8DDD0] text-sm text-[#1E1E1E] bg-white outline-none focus:border-[#C65D3B]"
                aria-label="الولاية"
              >
                <option value="">جميع الولايات</option>
                {wilayats.map((w) => (
                  <option key={w.id} value={w.id}>{w.nameAr}</option>
                ))}
              </select>
            )}

            {areas.length > 0 && (
              <select
                value={draft.areaId}
                onChange={(e) => update("areaId", e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-[#E8DDD0] text-sm text-[#1E1E1E] bg-white outline-none focus:border-[#C65D3B]"
                aria-label="المنطقة"
              >
                <option value="">جميع المناطق</option>
                {areas.map((a) => (
                  <option key={a.id} value={a.id}>{a.nameAr}</option>
                ))}
              </select>
            )}
          </div>
        </FilterSection>

        {/* Price range */}
        <FilterSection title="نطاق السعر (ر.ع)">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={draft.minPrice ?? ""}
              onChange={(e) => update("minPrice", e.target.value ? Number(e.target.value) : null)}
              placeholder="من"
              min={0}
              className="flex-1 h-11 px-4 rounded-xl border border-[#E8DDD0] text-sm text-[#1E1E1E] outline-none focus:border-[#C65D3B]"
              aria-label="الحد الأدنى للسعر"
              dir="ltr"
            />
            <span className="text-[#A89480] text-sm">—</span>
            <input
              type="number"
              value={draft.maxPrice ?? ""}
              onChange={(e) => update("maxPrice", e.target.value ? Number(e.target.value) : null)}
              placeholder="إلى"
              min={0}
              className="flex-1 h-11 px-4 rounded-xl border border-[#E8DDD0] text-sm text-[#1E1E1E] outline-none focus:border-[#C65D3B]"
              aria-label="الحد الأقصى للسعر"
              dir="ltr"
            />
          </div>
        </FilterSection>

        {/* Bedrooms / Bathrooms */}
        <FilterSection title="غرف النوم والحمامات">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#7A6B5E]">غرف النوم</span>
              <CounterBtn
                value={draft.minBeds}
                onDecrement={() => update("minBeds", Math.max(0, draft.minBeds - 1))}
                onIncrement={() => update("minBeds", draft.minBeds + 1)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#7A6B5E]">الحمامات</span>
              <CounterBtn
                value={draft.minBaths}
                onDecrement={() => update("minBaths", Math.max(0, draft.minBaths - 1))}
                onIncrement={() => update("minBaths", draft.minBaths + 1)}
              />
            </div>
          </div>
        </FilterSection>

        {/* Area size */}
        <FilterSection title="المساحة (م²)">
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={draft.minArea ?? ""}
              onChange={(e) => update("minArea", e.target.value ? Number(e.target.value) : null)}
              placeholder="من"
              min={0}
              className="flex-1 h-11 px-4 rounded-xl border border-[#E8DDD0] text-sm outline-none focus:border-[#C65D3B]"
              aria-label="الحد الأدنى للمساحة"
              dir="ltr"
            />
            <span className="text-[#A89480] text-sm">—</span>
            <input
              type="number"
              value={draft.maxArea ?? ""}
              onChange={(e) => update("maxArea", e.target.value ? Number(e.target.value) : null)}
              placeholder="إلى"
              min={0}
              className="flex-1 h-11 px-4 rounded-xl border border-[#E8DDD0] text-sm outline-none focus:border-[#C65D3B]"
              aria-label="الحد الأقصى للمساحة"
              dir="ltr"
            />
          </div>
        </FilterSection>

        {/* Furnishing */}
        <FilterSection title="حالة التأثيث">
          <div className="flex flex-wrap gap-2">
            {Object.entries(FURNISHING_LABELS).map(([val, label]) => (
              <button
                key={val}
                onClick={() => toggleArr("furnishing", val)}
                aria-pressed={draft.furnishing.includes(val)}
                className={cn(
                  "px-3 h-9 rounded-full text-xs font-semibold border transition-colors",
                  draft.furnishing.includes(val)
                    ? "bg-[#C65D3B] text-white border-[#C65D3B]"
                    : "bg-white text-[#7A6B5E] border-[#E8DDD0] hover:border-[#C65D3B]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Features */}
        <FilterSection title="مميزات العقار">
          <div className="flex flex-wrap gap-2">
            <BoolChip label="موثوق" active={!!draft.isVerified} onClick={() => update("isVerified", draft.isVerified ? null : true)} />
            <BoolChip label="مجلس" active={!!draft.hasMajlis} onClick={() => update("hasMajlis", draft.hasMajlis ? null : true)} />
            <BoolChip label="غرفة خادمة" active={!!draft.hasMaidRoom} onClick={() => update("hasMaidRoom", draft.hasMaidRoom ? null : true)} />
            <BoolChip label="غرفة سائق" active={!!draft.hasDriverRoom} onClick={() => update("hasDriverRoom", draft.hasDriverRoom ? null : true)} />
            <BoolChip label="موقف سيارات" active={!!draft.hasParking} onClick={() => update("hasParking", draft.hasParking ? null : true)} />
            <BoolChip label="إطلالة بحرية" active={!!draft.hasSeaView} onClick={() => update("hasSeaView", draft.hasSeaView ? null : true)} />
            <BoolChip label="إطلالة جبلية" active={!!draft.hasMountainView} onClick={() => update("hasMountainView", draft.hasMountainView ? null : true)} />
            <BoolChip label="تملك حر" active={!!draft.isFreehold} onClick={() => update("isFreehold", draft.isFreehold ? null : true)} />
            <BoolChip label="متاح للوافدين" active={!!draft.expatAllowed} onClick={() => update("expatAllowed", draft.expatAllowed ? null : true)} />
            <BoolChip label="للعائلات فقط" active={!!draft.familyOnly} onClick={() => update("familyOnly", draft.familyOnly ? null : true)} />
          </div>
        </FilterSection>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white border-t border-[#F0EBE3] p-4 flex items-center gap-3"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <Button variant="outline" size="md" className="flex-1" onClick={handleReset}>
          إعادة تعيين
        </Button>
        <Button variant="primary" size="md" className="flex-1" onClick={handleApply}>
          {resultCount !== undefined ? `عرض ${resultCount} نتيجة` : "تطبيق الفلاتر"}
        </Button>
      </div>
    </BottomSheet>
  );
}
