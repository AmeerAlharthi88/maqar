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
      termsAccepted: false,

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
        set({ isSubmitting: true });
        // Simulate async submission — replace with Supabase insert in future
        await new Promise<void>((resolve) => setTimeout(resolve, 1500));
        set((s) => ({
          isSubmitting: false,
          submitSuccess: true,
          draft: { ...s.draft, status: "pending_review", updatedAt: new Date().toISOString() },
          isDirty: false,
          completedSteps: Array.from({ length: ADD_LISTING_TOTAL_STEPS }, (_, i) => i + 1),
        }));
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
          termsAccepted: false,
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
        termsAccepted: s.termsAccepted,
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
