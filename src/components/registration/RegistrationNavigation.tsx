
import { Button } from "@/components/ui/button";

interface RegistrationNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const RegistrationNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
}: RegistrationNavigationProps) => (
  <div className="flex justify-between gap-4 pb-8">
    {currentStep > 1 && (
      <Button
        variant="secondaryOutline"
        onClick={onPrevious}
        className="flex-1 sm:flex-none animate-fade-up transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        Back
      </Button>
    )}
    <Button
      variant="primaryMinimal"
      onClick={onNext}
      className={`flex-1 sm:flex-none animate-fade-up transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
        currentStep === 1 ? "w-full" : "ml-auto"
      }`}
    >
      {currentStep === totalSteps ? "Complete Registration" : "Continue"}
    </Button>
  </div>
);
