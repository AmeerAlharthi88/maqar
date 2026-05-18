"use client";

import { useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useAddListingStore } from "@/store/add-listing.store";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

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
  const { isAuthenticated, isLoading } = useAuthStore();
  const isOnline = useOnlineStatus();

  const {
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
    updateDraft,
    validateAndAdvance,
    prevStep,
    saveDraft,
    submitListing,
    resetFlow,
    setTermsAccepted,
  } = useAddListingStore();

  // ── Handlers — must be declared before any early returns (rules-of-hooks) ────
  // Step 10 submit action comes from StepSubmit directly
  const handleStepSubmit = useCallback(async () => {
    await submitListing();
  }, [submitListing]);

  // ── Auth gate ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-[#E8DDD0] border-t-[#C65D3B] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginRequired />;
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
      className="min-h-screen bg-[#FAF7F4]"
      dir="rtl"
      style={{ paddingBottom: "calc(128px + env(safe-area-inset-bottom, 0px))" }}
    >
      {/* Step progress header */}
      <StepperProgress currentStep={currentStep} completedSteps={completedSteps} />

      {/* Validation error summary (if any) */}
      {Object.keys(validationErrors).length > 0 && currentStep !== 10 && (
        <div className="mx-4 mt-3 bg-[#FBF0EB] border border-[#C65D3B]/30 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-[#C65D3B] mb-1">يرجى تصحيح الأخطاء التالية:</p>
          <ul className="space-y-0.5">
            {Object.values(validationErrors).map((err, i) => (
              <li key={i} className="text-xs text-[#C65D3B]">• {err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Usage limit gate — shown when free user reaches listing limit */}
      {mockLimitReached && (
        <div className="px-4 py-4">
          <UpgradePrompt
            titleAr="وصلت إلى الحد الأقصى للإعلانات"
            messageAr="يمكنك نشر حتى ٣ إعلانات نشطة في الخطة المجانية. قم بالترقية لنشر المزيد."
            ctaAr="ترقية الخطة"
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
            لا يوجد اتصال بالإنترنت
          </p>
          <p className="text-[11px] text-[#7A6B5E]">
            يمكنك حفظ المسودة وإرسال الإعلان عند استعادة الاتصال.
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
          nextLabel={
            currentStep === 9
              ? "التالي — الإرسال"
              : currentStep === 10
              ? "إرسال الإعلان"
              : undefined
          }
          disableNext={
            (currentStep === 10 && !termsAccepted) ||
            // Block final submission when offline — draft save still works
            (!isOnline && currentStep === 10)
          }
        />
      )}
    </div>
  );
}
