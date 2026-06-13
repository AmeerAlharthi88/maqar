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
import { useLocaleStore } from "@/store/locale.store";
import { createListingDevAction } from "@/app/actions/listing-actions";

const DEV_SKIP_AUTH = process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === "true";

// ── Initial draft factory ─────────────────────────────────────────────────────
function makeInitialDraft(): ListingDraft {
  return {
    id: generateDraftId(),
    purpose: null,
    propertyType: null,

    // Core specs
    bedrooms: null,
    bathrooms: null,
    area: null,
    landArea: null,
    parkingSpots: null,
    furnishing: null,
    propertyAge: null,
    availabilityDate: null,

    // Floor fields
    floorNumber: null,
    totalFloorsInBuilding: null,
    floors: null,

    // Villa / residential features
    hasMajlis: false,
    majlisCount: null,
    hasMaidRoom: false,
    hasDriverRoom: false,
    hasPrivatePool: false,
    hasYard: false,
    balconyCount: null,
    hasCentralAc: false,
    kitchenType: null,
    hasStoreRoom: false,

    // Apartment features
    hasElevator: false,
    hasSecurity: false,
    hasSharedPool: false,
    hasSharedGym: false,
    hasBalcony: false,

    // Views
    hasSeaView: false,
    hasMountainView: false,

    // Legacy booleans
    hasOutdoorKitchen: false,
    hasIndoorKitchen: false,
    isFreehold: false,
    isExpatAllowed: false,
    isFamilyOnly: false,
    isBachelorAllowed: false,

    // Land
    landUse: null,
    roadAccess: null,
    isCornerPlot: false,
    hasElectricity: false,
    hasWater: false,
    hasSewage: false,
    hasBoundaryWall: false,
    plotNumber: "",
    hasNearbyMosque: false,
    hasNearbySchool: false,

    // Farm
    waterSource: null,
    farmHouseExists: false,
    numberOfWells: null,
    palmTreesCount: null,
    otherTrees: "",
    hasPavedRoad: false,
    hasAgriculturalLicense: false,

    // Commercial shop
    shopFrontageMeters: null,
    hasCommercialLicense: false,
    hasDisplayWindow: false,
    isMainRoadFacing: false,

    // Office
    meetingRoomsCount: null,
    hasReceptionArea: false,
    isInternetReady: false,

    // Warehouse
    ceilingHeightMeters: null,
    hasLoadingDock: false,
    hasTruckAccess: false,
    powerCapacityKw: null,
    hasFireSafety: false,
    isFenced: false,
    hasCrane: false,
    hasOfficeSpace: false,

    // Building
    totalUnits: null,
    hasCommercialGroundFloor: false,
    currentRentalIncome: null,

    // Chalet
    hasBarbecue: false,
    hasSharedBeachAccess: false,

    // Step 4 — Price
    price: null,
    rentPeriod: null,
    isNegotiable: false,
    depositAmount: null,
    serviceCharges: null,
    isPriceHidden: false,

    // Step 5 — Location
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

    // Step 6 — Media
    images: [],
    videoLink: "",
    tourLink: "",

    // Step 7 — Documents
    documents: [],
    requestVerification: true,

    // Step 8 — Description
    titleAr: "",
    descriptionAr: "",
    highlights: [],
    amenities: [],

    // Meta
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ── State interface ───────────────────────────────────────────────────────────
interface AddListingState {
  // ID of the authenticated user who owns the persisted draft. Scopes the
  // draft to a single account so Account A's in-progress listing can never
  // surface for Account B on the same device. null = unclaimed / logged out.
  ownerId: string | null;
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

  // Session / ownership
  reconcileOwner: (userId: string | null) => void;

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
      ownerId: null,
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

      // ── Session / ownership ───────────────────────────────────────────────────
      // Keeps the persisted draft scoped to the authenticated user. Called on
      // every auth resolution (login, logout, user switch) and on add-listing
      // mount. Guarantees Account A's draft/step never appears for Account B.
      reconcileOwner: (userId) => {
        const { ownerId } = get();
        if (!userId) {
          // Logged out → wipe any device-local draft so the next account that
          // signs in on this device starts from a clean slate.
          if (ownerId !== null) {
            get().resetFlow();
            set({ ownerId: null });
          }
          return;
        }
        if (ownerId !== userId) {
          // Draft belongs to a different user (or is unclaimed) → discard it and
          // claim a fresh draft for the current user. Resets currentStep to 1.
          get().resetFlow();
          set({ ownerId: userId });
        }
        // else: same owner → preserve their in-progress draft.
      },

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
        // Locale-aware validation messages (store lives outside React, so read
        // the current locale directly from the locale store).
        const locale = useLocaleStore.getState().locale;
        const errors = validateStep(currentStep, draft, locale);
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
      // v3: drafts are now scoped to an authenticated user via ownerId.
      // Bumping the key clears every pre-v3 draft — those were stored under a
      // single un-scoped key and could leak across accounts on a shared device.
      name: "maqar-add-listing-v3",
      // Persist only serializable fields — strip blob URLs and File objects
      partialize: (s) => ({
        ownerId: s.ownerId,
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
