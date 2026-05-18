import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ListingDraft } from "@/types/listing-draft";
import {
  computeQualityScore,
  checkSuspiciousPrice,
  checkDuplicateRisk,
  generateDraftId,
  validateStep,
} from "@/lib/helpers/add-listing";
import type { DuplicateRisk, ValidationErrors } from "@/lib/helpers/add-listing";
import { ADD_LISTING_TOTAL_STEPS } from "@/lib/constants/add-listing";
import { createListingClient } from "@/lib/supabase/listings";
import { uploadListingImages } from "@/lib/supabase/listing-images";
import { useAuthStore } from "@/store/auth.store";
import { createListingDevAction } from "@/app/actions/listing-actions";

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

// ── Initial draft factory ─────────────────────────────────────────────────────
function makeInitialDraft(): ListingDraft {
  return {
    id: generateDraftId(),
    purpose: null,
    propertyType: null,
    bedrooms: null,
    bathrooms: null,
    area: null,
    landArea: null,
    floors: null,
    parkingSpots: null,
    furnishing: null,
    propertyAge: null,
    availabilityDate: null,
    hasMajlis: false,
    hasMaidRoom: false,
    hasDriverRoom: false,
    hasOutdoorKitchen: false,
    hasIndoorKitchen: false,
    hasYard: false,
    hasSeaView: false,
    hasMountainView: false,
    isFreehold: false,
    isExpatAllowed: false,
    isFamilyOnly: false,
    isBachelorAllowed: false,
    price: null,
    rentPeriod: null,
    isNegotiable: false,
    depositAmount: null,
    serviceCharges: null,
    isPriceHidden: false,
    governorateId: null,
    governorateAr: "",
    wilayatId: null,
    wilayatAr: "",
    areaId: null,
    areaAr: "",
    block: "",
    street: "",
    locationNotes: "",
    hideExactLocation: false,
    mapLat: null,
    mapLng: null,
    images: [],
    videoLink: "",
    tourLink: "",
    documents: [],
    requestVerification: true,
    titleAr: "",
    descriptionAr: "",
    highlights: [],
    amenities: [],
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ── State interface ───────────────────────────────────────────────────────────
interface AddListingState {
  currentStep: number;
  completedSteps: number[];
  draft: ListingDraft;
  validationErrors: ValidationErrors;
  isDirty: boolean;
  isSubmitting: boolean;
  submitSuccess: boolean;
  qualityScore: number;
  duplicateRisk: DuplicateRisk;
  suspiciousPrice: boolean;
  amlFlagged: boolean;
  suspiciousMessage: string | null;
  termsAccepted: boolean;
  submitError: string | null;

  // Navigation
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Data
  updateDraft: (patch: Partial<ListingDraft>) => void;
  setValidationErrors: (errors: ValidationErrors) => void;
  clearValidationErrors: () => void;
  setTermsAccepted: (v: boolean) => void;

  // Validation
  validateAndAdvance: () => boolean;

  // Actions
  saveDraft: () => void;
  submitListing: () => Promise<void>;
  resetFlow: () => void;
  recomputeScores: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useAddListingStore = create<AddListingState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      completedSteps: [],
      draft: makeInitialDraft(),
      validationErrors: {},
      isDirty: false,
      isSubmitting: false,
      submitSuccess: false,
      qualityScore: 0,
      duplicateRisk: "none",
      suspiciousPrice: false,
      amlFlagged: false,
      suspiciousMessage: null,
      termsAccepted: true,  // default true — step 9 shows terms, user already reviewed them
      submitError: null,

      // ── Navigation ──────────────────────────────────────────────────────────
      goToStep: (step) => {
        set({ currentStep: Math.max(1, Math.min(ADD_LISTING_TOTAL_STEPS, step)) });
      },

      nextStep: () => {
        const { currentStep, completedSteps } = get();
        const next = Math.min(ADD_LISTING_TOTAL_STEPS, currentStep + 1);
        set({
          currentStep: next,
          completedSteps: completedSteps.includes(currentStep)
            ? completedSteps
            : [...completedSteps, currentStep],
          validationErrors: {},
        });
      },

      prevStep: () => {
        const { currentStep } = get();
        set({ currentStep: Math.max(1, currentStep - 1), validationErrors: {} });
      },

      // ── Data ────────────────────────────────────────────────────────────────
      updateDraft: (patch) => {
        set((s) => ({
          draft: { ...s.draft, ...patch, updatedAt: new Date().toISOString() },
          isDirty: true,
        }));
        // Debounced score recompute (immediate is fine for demo)
        get().recomputeScores();
      },

      setValidationErrors: (errors) => set({ validationErrors: errors }),
      clearValidationErrors: () => set({ validationErrors: {} }),
      setTermsAccepted: (v) => set({ termsAccepted: v }),

      // ── Validation + advance ─────────────────────────────────────────────────
      validateAndAdvance: () => {
        const { currentStep, draft, nextStep } = get();
        const errors = validateStep(currentStep, draft);
        if (Object.keys(errors).length > 0) {
          set({ validationErrors: errors });
          return false;
        }
        nextStep();
        return true;
      },

      // ── Actions ─────────────────────────────────────────────────────────────
      saveDraft: () => {
        set((s) => ({
          draft: { ...s.draft, status: "draft", updatedAt: new Date().toISOString() },
          isDirty: false,
        }));
      },

      submitListing: async () => {
        set({ isSubmitting: true, submitError: null });

        try {
          const { draft } = get();

          // Get the authenticated user ID from auth store.
          // Falls back to "dev-user" in mock/dev mode — createListingClient
          // returns a fake ID when Supabase is not configured.
          const userId = useAuthStore.getState().user?.id ?? "dev-user";

          // 1. INSERT the listing row — get the real UUID back
          // Race against a 20-second timeout so slow/unreachable Supabase servers
          // never leave isSubmitting stuck on true forever.
          // In dev bypass mode, use the Server Action (service role, no auth needed).
          // In production, use the browser client with a 20-second timeout.
          let listingId: string | null;
          let createError: string | null;

          if (DEV_SKIP_AUTH) {
            ({ listingId, error: createError } = await createListingDevAction(draft, userId));
          } else {
            const timeoutPromise = new Promise<{ listingId: null; error: string }>(
              (resolve) =>
                setTimeout(
                  () =>
                    resolve({
                      listingId: null,
                      error: "انتهت مهلة الاتصال بالخادم (٢٠ ثانية). تحقق من اتصالك بالإنترنت وأعد المحاولة.",
                    }),
                  20_000
                )
            );
            ({ listingId, error: createError } = await Promise.race([
              createListingClient(draft, userId),
              timeoutPromise,
            ]));
          }

          if (createError || !listingId) {
            console.error("[AddListing] createListingClient error:", createError);
            set({ isSubmitting: false, submitError: createError ?? "فشل إنشاء الإعلان" });
            return;
          }

          // 2. Upload images (only those still holding a blob previewUrl)
          if (draft.images.length > 0) {
            const { failedCount } = await uploadListingImages(listingId, draft.images);
            if (failedCount > 0) {
              // Non-fatal: listing was created; warn but continue
              console.warn(
                `[AddListing] ${failedCount} image(s) failed to upload for listing ${listingId}`
              );
            }
          }

          // 3. Mark submit as complete
          set((s) => ({
            isSubmitting: false,
            submitSuccess: true,
            draft: {
              ...s.draft,
              status: "pending_review",
              updatedAt: new Date().toISOString(),
            },
            isDirty: false,
            completedSteps: Array.from(
              { length: ADD_LISTING_TOTAL_STEPS },
              (_, i) => i + 1
            ),
          }));
        } catch (err) {
          console.error("[AddListing] submitListing exception:", err);
          const msg = err instanceof Error ? err.message : "حدث خطأ غير متوقع";
          set({ isSubmitting: false, submitError: msg });
        }
      },

      resetFlow: () => {
        set({
          currentStep: 1,
          completedSteps: [],
          draft: makeInitialDraft(),
          validationErrors: {},
          isDirty: false,
          isSubmitting: false,
          submitSuccess: false,
          qualityScore: 0,
          duplicateRisk: "none",
          suspiciousPrice: false,
          amlFlagged: false,
          suspiciousMessage: null,
          termsAccepted: true,
          submitError: null,
        });
      },

      recomputeScores: () => {
        const { draft } = get();
        const score = computeQualityScore(draft);
        const suspicious = checkSuspiciousPrice(draft);
        const duplicate = checkDuplicateRisk(draft);
        set({
          qualityScore: score,
          suspiciousPrice: suspicious.isSuspicious,
          amlFlagged: suspicious.amlFlagged,
          suspiciousMessage: suspicious.userMessage,
          duplicateRisk: duplicate,
        });
      },
    }),
    {
      name: "maqar-add-listing-v1",
      // Persist only serializable fields — strip blob URLs and File objects
      partialize: (s) => ({
        currentStep: s.currentStep,
        completedSteps: s.completedSteps,
        // termsAccepted is intentionally NOT persisted so it always resets to true (default)
        // The user reviews terms on step 9 each session
        draft: {
          ...s.draft,
          // Strip local blob URLs — they are invalid after page reload
          images: s.draft.images.map(({ previewUrl: _p, ...img }) => img),
          // Strip file references — must be re-uploaded
          documents: s.draft.documents.map(({ file: _f, ...doc }) => doc),
        },
      }),
    }
  )
);
