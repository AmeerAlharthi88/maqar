"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useAddListingStore } from "@/store/add-listing.store";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useTranslation } from "@/i18n/useTranslation";
import { ROUTES } from "@/config/routes";
import { Dialog } from "@/components/ui/Dialog";

import { LoginRequired } from "./LoginRequired";
import { StepperProgress } from "./StepperProgress";
import { StickyStepActions } from "./StickyStepActions";

import { StepPurpose } from "./steps/StepPurpose";
import { StepPropertyType } from "./steps/StepPropertyType";
import { StepDetails } from "./steps/StepDetails";
import { StepPrice } from "./steps/StepPrice";
import { StepLocation } from "./steps/StepLocation";
import { StepPhotos } from "./steps/StepPhotos";
import { StepDocuments } from "./steps/StepDocuments";
import { StepDescription } from "./steps/StepDescription";
import { StepReview } from "./steps/StepReview";
import { StepSubmit } from "./steps/StepSubmit";

import { UpgradePrompt } from "@/components/subscriptions/UpgradePrompt";
import { canCreateListing } from "@/lib/payments/usage-limits";
import { MOCK_USER_SUBSCRIPTION, MOCK_FREE_USAGE_LIMITS } from "@/mock/subscriptions";
import type { DraftPurpose } from "@/types/listing-draft";
import type { PropertyType } from "@/types/listing";

export function AddListingShell() {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const isOnline = useOnlineStatus();
  const router = useRouter();
  const { t, dir } = useTranslation();
  const isAr = dir === "rtl";

  const [showCancel, setShowCancel] = useState(false);

  const {
    ownerId,
    currentStep,
    completedSteps,
    draft,
    validationErrors,
    isDirty,
    isSubmitting,
    submitSuccess,
    submitError,
    qualityScore,
    duplicateRisk,
    suspiciousPrice,
    suspiciousMessage,
    amlFlagged: _aml, // tracked internally, not shown to user
    termsAccepted,
    reconcileOwner,
    updateDraft,
    validateAndAdvance,
    prevStep,
    saveDraft,
    submitListing,
    resetFlow,
    setTermsAccepted,
  } = useAddListingStore();

  // ── Draft ownership guard ────────────────────────────────────────────────────
  // Scope the persisted draft to the current user. Backs up AuthSessionProvider
  // and also covers client-side navigations into the flow. A draft left by a
  // different account is discarded here so it can never appear for this user.
  // Wait until auth has resolved (isLoading=false) — reconciling while the
  // session is still loading (user=null) would wrongly wipe the owner's draft.
  useEffect(() => {
    if (isLoading) return;
    reconcileOwner(user?.id ?? null);
  }, [isLoading, user?.id, reconcileOwner]);

  // ── Handlers — must be declared before any early returns (rules-of-hooks) ────
  // Step 10 submit action comes from StepSubmit directly
  const handleStepSubmit = useCallback(async () => {
    await submitListing();
  }, [submitListing]);

  // Cancel the in-progress listing: clears ONLY this device's local draft/state
  // (never touches submitted DB rows or other accounts), then exits to /account.
  const handleCancelConfirmed = useCallback(() => {
    resetFlow();
    try {
      useAddListingStore.persist?.clearStorage?.();
    } catch {
      /* clearing persisted storage is best-effort */
    }
    setShowCancel(false);
    router.replace(ROUTES.account);
  }, [resetFlow, router]);

  // ── Auth gate ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#E2E8F0] border-t-[#0A3C36] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginRequired />;
  }

  // Draft still owned by a different account — the reconcile effect runs on the
  // next tick. Show a spinner for that single frame instead of briefly flashing
  // the previous user's step/data.
  if (user && ownerId !== null && ownerId !== user.id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#E2E8F0] border-t-[#0A3C36] animate-spin" />
      </div>
    );
  }

  // ── Listing limit gate (Phase 14) ─────────────────────────────────────────────
  // TODO Phase 15+: read real subscription + usage from Supabase
  const mockListingUsage = MOCK_FREE_USAGE_LIMITS.find((u) => u.feature === "listing");
  const mockCurrentListings = mockListingUsage?.current ?? 0;
  const mockLimitReached = !canCreateListing(MOCK_USER_SUBSCRIPTION.planId, mockCurrentListings);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function handleNext() {
    if (currentStep === 10) {
      submitListing();
    } else {
      validateAndAdvance();
    }
  }

  // ── Step renderer ─────────────────────────────────────────────────────────────
  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <StepPurpose
            value={draft.purpose}
            onChange={(v: DraftPurpose) => updateDraft({ purpose: v })}
            error={validationErrors.purpose}
          />
        );

      case 2:
        return (
          <StepPropertyType
            value={draft.propertyType}
            onChange={(v: PropertyType) => updateDraft({ propertyType: v })}
            error={validationErrors.propertyType}
          />
        );

      case 3:
        return (
          <StepDetails
            draft={draft}
            onChange={updateDraft}
            errors={validationErrors}
          />
        );

      case 4:
        return (
          <StepPrice
            draft={draft}
            onChange={updateDraft}
            errors={validationErrors}
            suspiciousPrice={suspiciousPrice}
            suspiciousMessage={suspiciousMessage}
            amlFlagged={false}
          />
        );

      case 5:
        return (
          <StepLocation
            draft={draft}
            onChange={updateDraft}
            errors={validationErrors}
          />
        );

      case 6:
        return (
          <StepPhotos
            draft={draft}
            onChange={updateDraft}
            errors={validationErrors}
          />
        );

      case 7:
        return (
          <StepDocuments
            draft={draft}
            onChange={updateDraft}
          />
        );

      case 8:
        return (
          <StepDescription
            draft={draft}
            onChange={updateDraft}
            errors={validationErrors}
          />
        );

      case 9:
        return (
          <StepReview
            draft={draft}
            qualityScore={qualityScore}
            duplicateRisk={duplicateRisk}
            suspiciousPrice={suspiciousPrice}
            suspiciousMessage={suspiciousMessage}
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
            errors={validationErrors}
          />
        );

      case 10:
        return (
          <StepSubmit
            draft={draft}
            qualityScore={qualityScore}
            isSubmitting={isSubmitting}
            submitSuccess={submitSuccess}
            termsAccepted={termsAccepted}
            submitError={submitError}
            onSubmit={handleStepSubmit}
            onSaveDraft={saveDraft}
            onReset={resetFlow}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div
      className="min-h-screen bg-[#F8F9FA]"
      dir={dir}
      style={{ paddingBottom: "calc(128px + env(safe-area-inset-bottom, 0px))" }}
    >
      {/* Step progress header */}
      <StepperProgress
        currentStep={currentStep}
        completedSteps={completedSteps}
        onCancel={() => setShowCancel(true)}
      />

      {/* Validation error summary (if any) */}
      {Object.keys(validationErrors).length > 0 && currentStep !== 10 && (
        <div className="mx-4 mt-3 bg-[#FEF0EE] border border-[#C0392B]/30 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-[#C0392B] mb-1">
            {isAr ? "يرجى تصحيح الأخطاء التالية:" : "Please fix the following errors:"}
          </p>
          <ul className="space-y-0.5">
            {Object.values(validationErrors).map((err, i) => (
              <li key={i} className="text-xs text-[#C0392B]">• {err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Usage limit gate — shown when free user reaches listing limit */}
      {mockLimitReached && (
        <div className="px-4 py-4">
          <UpgradePrompt
            titleAr={t("addListing.limitReached.title")}
            messageAr={t("addListing.limitReached.message")}
            ctaAr={t("addListing.limitReached.cta")}
            variant="banner"
          />
        </div>
      )}

      {/* Current step content */}
      {!mockLimitReached && renderStep()}

      {/* Offline submit block — shown only on final steps when offline */}
      {!isOnline && (currentStep === 9 || currentStep === 10) && (
        <div className="mx-4 mt-3 bg-[#FEF9EC] border border-[#C8860A]/30 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-[#C8860A] mb-0.5">
            {t("addListing.offline.title")}
          </p>
          <p className="text-[11px] text-[#627D98]">
            {t("addListing.offline.message")}
          </p>
        </div>
      )}

      {/* Sticky bottom actions — hidden on submit success step */}
      {!(currentStep === 10 && submitSuccess) && (
        <StickyStepActions
          currentStep={currentStep}
          isSubmitting={isSubmitting}
          isDirty={isDirty}
          onNext={handleNext}
          onPrev={prevStep}
          onSaveDraft={saveDraft}
          // Step 9 (review) advances to the submit step. Step 10 hides the
          // footer's button so StepSubmit's "Submit for review" is the single
          // primary final CTA (UAT-053 — no duplicate submit button).
          nextLabel={
            currentStep === 9
              ? (isAr ? "التالي — الإرسال" : "Next — Submit")
              : undefined
          }
          hideNext={currentStep === 10}
        />
      )}

      {/* Cancel-listing confirmation */}
      <Dialog
        open={showCancel}
        onClose={() => setShowCancel(false)}
        title={isAr ? "هل تريد إلغاء هذا الإعلان؟" : "Cancel this listing?"}
        description={
          isAr
            ? "سيتم حذف المسودة من هذا الجهاز."
            : "This draft will be removed from this device."
        }
        confirmLabel={isAr ? "إلغاء الإعلان" : "Cancel Listing"}
        cancelLabel={isAr ? "متابعة التعديل" : "Keep editing"}
        confirmVariant="danger"
        onConfirm={handleCancelConfirmed}
      />
    </div>
  );
}
