"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { IMAGE_CONSTRAINTS } from "@/lib/constants/add-listing";
import { formatNumber } from "@/lib/formatters";
import { useTranslation } from "@/i18n/useTranslation";
import type { ListingDraft, UploadedFile } from "@/types/listing-draft";

interface StepPhotosProps {
  draft: ListingDraft;
  onChange: (patch: Partial<ListingDraft>) => void;
  errors: Record<string, string>;
}

function generateFileId(): string {
  return `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function StepPhotos({ draft, onChange, errors }: StepPhotosProps) {
  const { t, locale } = useTranslation();
  const isAr = locale === "ar";
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const remaining = IMAGE_CONSTRAINTS.maxCount - draft.images.length;
    if (remaining <= 0) return;

    const newFiles: UploadedFile[] = [];

    Array.from(fileList)
      .slice(0, remaining)
      .forEach((file) => {
        // Type validation
        if (!IMAGE_CONSTRAINTS.acceptedTypes.includes(file.type)) return;
        // Size validation
        if (file.size > IMAGE_CONSTRAINTS.maxSizeBytes) return;

        const id = generateFileId();
        const previewUrl = URL.createObjectURL(file);
        newFiles.push({
          id,
          name: file.name,
          size: file.size,
          mimeType: file.type,
          previewUrl,
          isMain: draft.images.length === 0 && newFiles.length === 0, // first image is main
          uploadStatus: "pending",
        });
      });

    if (newFiles.length > 0) {
      onChange({ images: [...draft.images, ...newFiles] });
    }
  }

  function removeImage(id: string) {
    const remaining = draft.images.filter((img) => img.id !== id);
    // If we removed the main image, set first remaining as main
    if (!remaining.some((img) => img.isMain) && remaining.length > 0) {
      remaining[0] = { ...remaining[0], isMain: true };
    }
    onChange({ images: remaining });
  }

  function setMain(id: string) {
    onChange({
      images: draft.images.map((img) => ({ ...img, isMain: img.id === id })),
    });
  }

  const canAddMore = draft.images.length < IMAGE_CONSTRAINTS.maxCount;

  return (
    <div className="px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#627D98]">
          {isAr
            ? `أضف حتى ${formatNumber(IMAGE_CONSTRAINTS.maxCount, locale)} صورة بصيغة JPG أو PNG أو WebP (٨ ميغابايت لكل صورة).`
            : `Add up to ${formatNumber(IMAGE_CONSTRAINTS.maxCount, locale)} photos in JPG, PNG or WebP format (8 MB each).`}
        </p>
        <span className="text-xs font-semibold text-[#627D98] flex-shrink-0 ms-2">
          {formatNumber(draft.images.length, locale)} / {formatNumber(IMAGE_CONSTRAINTS.maxCount, locale)}
        </span>
      </div>

      {/* Upload area */}
      {canAddMore && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-[#E2E8F0] rounded-2xl py-8 flex flex-col items-center gap-3 bg-[#F8F9FA] active:bg-[#F0F4F8] transition-colors"
          aria-label={t("addListing.photos.addMore")}
        >
          <div className="w-12 h-12 rounded-full bg-[#E6F0EF] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A3C36" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[#102A43]">
              {isAr ? "اضغط لاختيار الصور" : "Tap to choose photos"}
            </p>
            <p className="text-xs text-[#627D98]">
              {isAr ? "أو اسحب وأفلت الصور هنا" : "or drag and drop here"}
            </p>
          </div>
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={IMAGE_CONSTRAINTS.acceptedExtensions}
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
        aria-hidden="true"
      />

      {/* Validation error */}
      {errors.images && (
        <p className="text-xs text-[#C8860A] flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
          {errors.images}
        </p>
      )}

      {/* Image grid */}
      {draft.images.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#627D98] mb-2">
            {isAr ? "اضغط على أي صورة لتعيينها كصورة رئيسية" : "Tap any photo to set it as the main image"}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {draft.images.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border-2 transition-all"
                style={{ borderColor: img.isMain ? "#0A3C36" : "transparent" }}
              >
                {/* Preview */}
                {img.previewUrl ? (
                  <img
                    src={img.previewUrl}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#F0F4F8] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#627D98" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}

                {/* Main badge */}
                {img.isMain && (
                  <div className="absolute top-1 start-1 bg-[#0A3C36] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {t("addListing.photos.isMain")}
                  </div>
                )}

                {/* Set main button */}
                {!img.isMain && (
                  <button
                    onClick={() => setMain(img.id)}
                    className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 active:opacity-100 flex items-center justify-center transition-opacity"
                    aria-label={t("addListing.photos.setMain")}
                  >
                    <span className="bg-white/90 text-[#102A43] text-[10px] font-semibold px-2 py-1 rounded-full">
                      {t("addListing.photos.setMain")}
                    </span>
                  </button>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 end-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center"
                  aria-label={t("addListing.photos.remove")}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video / 360 tour */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-[#102A43]">
          {isAr ? "وسائط إضافية (اختياري)" : "Additional media (optional)"}
        </h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#627D98]">
            {t("addListing.photos.videoLink")}
          </label>
          <input
            type="url"
            inputMode="url"
            placeholder="https://youtube.com/watch?v=..."
            value={draft.videoLink}
            onChange={(e) => onChange({ videoLink: e.target.value })}
            className="w-full h-11 bg-white border border-[#E2E8F0] rounded-xl px-3.5 text-sm text-[#102A43] placeholder:text-[#627D98] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15"
            dir="ltr"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#627D98]">
            {t("addListing.photos.tourLink")}
          </label>
          <input
            type="url"
            inputMode="url"
            placeholder="https://my360tour.com/..."
            value={draft.tourLink}
            onChange={(e) => onChange({ tourLink: e.target.value })}
            className="w-full h-11 bg-white border border-[#E2E8F0] rounded-xl px-3.5 text-sm text-[#102A43] placeholder:text-[#627D98] outline-none focus:border-[#0A3C36] focus:ring-2 focus:ring-[#0A3C36]/15"
            dir="ltr"
          />
        </div>
      </section>
    </div>
  );
}
