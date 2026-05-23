"use client";

import { useState } from "react";
import { useMapStore } from "@/store/map.store";
import { LAYER_LABELS } from "@/lib/constants/map-constants";
import { cn } from "@/lib/utils";
import type { MapLayerState } from "@/store/map.store";

// ── Layer toggle row ───────────────────────────────────────────────────────────

interface LayerToggleProps {
  layerKey: keyof MapLayerState;
  label: string;
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
  comingSoon?: boolean;
  isWarning?: boolean;
}

function LayerToggle({
  label,
  active,
  onToggle,
  disabled,
  comingSoon,
  isWarning,
}: LayerToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            "text-xs font-medium truncate",
            disabled ? "text-[#627D98]" : "text-[#102A43]"
          )}
        >
          {label}
        </span>
        {comingSoon && (
          <span className="flex-shrink-0 text-[10px] text-[#627D98] bg-[#F0F4F8] px-1.5 py-0.5 rounded-full">
            قريباً
          </span>
        )}
        {isWarning && (
          <span className="flex-shrink-0 text-[10px] text-[#C8860A] bg-[#FFF8E6] px-1.5 py-0.5 rounded-full">
            تجريبي
          </span>
        )}
      </div>

      {/* Toggle switch */}
      <button
        onClick={onToggle}
        disabled={disabled}
        aria-label={`${active ? "إيقاف" : "تشغيل"} طبقة ${label}`}
        aria-pressed={active}
        className={cn(
          "relative flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-200",
          "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#0A3C36]",
          disabled
            ? "bg-[#E2E8F0] cursor-not-allowed opacity-50"
            : active
            ? "bg-[#0A3C36]"
            : "bg-[#E2E8F0]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
            active ? "translate-x-[-18px]" : "translate-x-[-2px]"
          )}
        />
      </button>
    </div>
  );
}

// ── Main layer controls panel ──────────────────────────────────────────────────

export function MapLayerControls() {
  const [open, setOpen] = useState(false);
  const { layers, toggleLayer } = useMapStore();

  const nearbyLayers: Array<keyof MapLayerState> = [
    "schools",
    "mosques",
    "hospitals",
    "beaches",
    "malls",
    "fuelStations",
  ];

  return (
    <div
      className="fixed z-[70]"
      style={{
        left: "12px",
        bottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Panel */}
      {open && (
        <div
          className="absolute bottom-12 left-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-elevated p-4 w-56 animate-slide-up"
          role="dialog"
          aria-label="طبقات الخريطة"
        >
          {/* Nearby services (placeholder) */}
          <p className="text-[11px] font-bold text-[#627D98] uppercase tracking-wide mb-2">
            خدمات قريبة
          </p>
          <p className="text-[10px] text-[#627D98] mb-2">
            البيانات الحية غير متاحة حالياً
          </p>
          <div className="divide-y divide-[#E2E8F0]">
            {nearbyLayers.map((key) => (
              <LayerToggle
                key={key}
                layerKey={key}
                label={LAYER_LABELS[key]}
                active={layers[key]}
                onToggle={() => toggleLayer(key)}
                disabled
                comingSoon
              />
            ))}
          </div>

          {/* Risk layers */}
          <p className="text-[11px] font-bold text-[#627D98] uppercase tracking-wide mt-4 mb-2">
            طبقات المخاطر
          </p>
          <p className="text-[10px] text-[#C8860A] bg-[#FFF8E6] rounded-lg px-2 py-1 mb-2">
            هذه الطبقة تجريبية ولا تعكس بيانات مخاطر فيضانات رسمية
          </p>
          <LayerToggle
            layerKey="wadiRisk"
            label={LAYER_LABELS["wadiRisk"]}
            active={layers.wadiRisk}
            onToggle={() => toggleLayer("wadiRisk")}
            disabled
            isWarning
          />
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="طبقات الخريطة"
        aria-expanded={open}
        className={cn(
          "w-11 h-11 rounded-full flex items-center justify-center shadow-elevated transition-colors",
          open
            ? "bg-[#0A3C36] text-white border-2 border-[#082E29]"
            : "bg-white text-[#627D98] border border-[#E2E8F0] hover:border-[#0A3C36] hover:text-[#0A3C36]"
        )}
      >
        {/* Layers icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </button>
    </div>
  );
}
