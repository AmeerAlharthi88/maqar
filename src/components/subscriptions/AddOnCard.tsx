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
          "bg-white rounded-2xl border border-[#F0EBE3] px-4 py-4",
          className
        )}
        dir="rtl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#1E1E1E]">
              {ADDON_LABELS_AR[addOnType]}
            </p>
            <p className="text-xs text-[#7A6B5E] mt-0.5 leading-relaxed">
              {descAr}
            </p>
            {disabled && disabledReason && (
              <p className="text-[10px] text-[#C65D3B] mt-1">{disabledReason}</p>
            )}
          </div>
          <div className="flex-shrink-0 text-end">
            <p className="text-sm font-bold text-[#C65D3B]">
              {toArabicNumerals(price)} ر.ع.
            </p>
            <p className="text-[10px] text-[#A89480]">/ {unit}</p>
          </div>
        </div>

        <button
          onClick={() => !disabled && setShowModal(true)}
          disabled={disabled}
          className={cn(
            "mt-3 w-full py-2.5 rounded-xl text-xs font-bold transition-colors",
            disabled
              ? "bg-[#F5F0EA] text-[#A89480] cursor-not-allowed"
              : "bg-[#C65D3B] text-white"
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
