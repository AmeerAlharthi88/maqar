"use client";

// ── AddOnCard — purchasable add-on with mock checkout trigger ─────────────────

import { useState } from "react";
import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";
import type { AddOnType } from "@/lib/payments/types";
import { ADDON_LABELS_AR } from "@/lib/payments/plans";
import { CheckoutModal } from "@/components/subscriptions/CheckoutModal";

interface AddOnCardProps {
  addOnType: AddOnType;
  price: number;
  unit: string;
  descAr: string;
  listingId?: string;
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
}

export function AddOnCard({
  addOnType,
  price,
  unit,
  descAr,
  listingId,
  disabled = false,
  disabledReason,
  className,
}: AddOnCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className={cn(
          "bg-white rounded-2xl border border-[#E2E8F0] px-4 py-4",
          className
        )}
        dir="rtl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#102A43]">
              {ADDON_LABELS_AR[addOnType]}
            </p>
            <p className="text-xs text-[#627D98] mt-0.5 leading-relaxed">
              {descAr}
            </p>
            {disabled && disabledReason && (
              <p className="text-[10px] text-[#627D98] mt-1">{disabledReason}</p>
            )}
          </div>
          <div className="flex-shrink-0 text-end">
            <p className="text-sm font-bold text-[#0A3C36]">
              {toArabicNumerals(price)} ر.ع.
            </p>
            <p className="text-[10px] text-[#627D98]">/ {unit}</p>
          </div>
        </div>

        <button
          onClick={() => !disabled && setShowModal(true)}
          disabled={disabled}
          className={cn(
            "mt-3 w-full py-2.5 rounded-xl text-xs font-bold transition-colors",
            disabled
              ? "bg-[#F0F4F8] text-[#627D98] cursor-not-allowed"
              : "bg-[#0A3C36] text-white"
          )}
          aria-label={disabled ? disabledReason : `شراء ${ADDON_LABELS_AR[addOnType]}`}
        >
          {disabled ? "يتطلب ترقية الخطة" : `شراء — ${toArabicNumerals(price)} ر.ع.`}
        </button>
      </div>

      {showModal && (
        <CheckoutModal
          addOnType={addOnType}
          listingId={listingId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
