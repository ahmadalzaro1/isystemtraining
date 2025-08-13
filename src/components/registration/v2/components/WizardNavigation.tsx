import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting,
  isValid,
}) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="flex items-center justify-between mt-8 pt-6">
      {/* Previous Button */}
      {!isFirstStep ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onPrevious}
          className={cn(
            "h-12 px-6 text-ios-body font-sf-pro",
            "bg-surface-2 hover:bg-surface border-0 rounded-xl2",
            "text-text-muted hover:text-text transition-all duration-200"
          )}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
      ) : (
        <div /> // Spacer
      )}

      {/* Next/Submit Button */}
      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !isValid}
          className={cn(
            "h-12 px-8 text-ios-body font-sf-pro font-semibold",
            "bg-accent-a hover:bg-accent-a/90 text-white border-0 rounded-xl2",
            "transition-all duration-200 min-w-[120px]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Registration'
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          className={cn(
            "h-12 px-6 text-ios-body font-sf-pro font-semibold",
            "bg-accent-a hover:bg-accent-a/90 text-white border-0 rounded-xl2",
            "transition-all duration-200"
          )}
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      )}
    </div>
  );
};