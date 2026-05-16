import { cn } from "@/lib/utils";
import { toArabicNumerals } from "@/lib/formatters";

interface FormStep {
  id: string;
  labelAr: string;
}

interface FormStepLayoutProps {
  steps: FormStep[];
  currentStep: number;
  titleAr: string;
  subtitleAr?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function FormStepLayout({
  steps,
  currentStep,
  titleAr,
  subtitleAr,
  children,
  footer,
  className,
}: FormStepLayoutProps) {
  const progress = ((currentStep) / steps.length) * 100;

  return (
    <div className={cn("flex flex-col min-h-svh bg-[#FAF7F2]", className)}>
      {/* Progress bar */}
      <div className="w-full h-1 bg-[#F0EBE3]">
        <div
          className="h-full bg-[#C65D3B] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-1.5 pt-4 pb-2">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={cn(
              "transition-all duration-300",
              i < currentStep
                ? "w-2 h-2 rounded-full bg-[#C65D3B]"
                : i === currentStep
                ? "w-6 h-2 rounded-full bg-[#C65D3B]"
                : "w-2 h-2 rounded-full bg-[#E8DDD0]"
            )}
          />
        ))}
      </div>

      {/* Header */}
      <div className="px-5 pt-4 pb-6">
        <p className="text-xs font-medium text-[#A89480] mb-1">
          الخطوة {toArabicNumerals(currentStep + 1)} من {toArabicNumerals(steps.length)}
        </p>
        <h1 className="text-2xl font-bold text-[#1E1E1E]">{titleAr}</h1>
        {subtitleAr && <p className="text-sm text-[#7A6B5E] mt-1">{subtitleAr}</p>}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 overflow-y-auto">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="sticky bottom-0 p-5 bg-white/95 backdrop-blur-md border-t border-[#F0EBE3]">
          {footer}
        </div>
      )}
    </div>
  );
}
