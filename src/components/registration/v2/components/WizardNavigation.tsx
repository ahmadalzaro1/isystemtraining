import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useViewportResize } from '@/hooks/useViewportResize';

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
  const viewport = useViewportResize();
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  // Responsive button sizing
  const buttonHeight = viewport.isSmall ? "h-11" : viewport.isMedium ? "h-12" : "h-14";
  const buttonPadding = viewport.isSmall ? "px-4" : "px-6";
  const textSize = viewport.isSmall ? "text-sm" : "text-ios-body";
  const iconSize = viewport.isSmall ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className={cn(
      "flex items-center justify-between pt-6",
      viewport.isSmall ? "mt-6" : "mt-8"
    )}>
      {/* Previous Button */}
      {!isFirstStep ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onPrevious}
          className={cn(
            buttonHeight, buttonPadding, textSize, "font-sf-pro",
            "bg-surface-2 hover:bg-surface border-0 rounded-xl2",
            "text-text-muted hover:text-text transition-all duration-200",
            "touch-manipulation" // Better touch response
          )}
        >
          <ChevronLeft className={cn(iconSize, "mr-2")} />
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
            buttonHeight, textSize, "font-sf-pro font-semibold",
            "bg-accent-a hover:bg-accent-a/90 text-white border-0 rounded-xl2",
            "transition-all duration-200 touch-manipulation",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "w-1/2 min-w-[200px]"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className={cn(iconSize, "mr-2 animate-spin")} />
              {viewport.isSmall ? "Submitting..." : "Submitting..."}
            </>
          ) : (
            viewport.isSmall ? "Submit" : "Submit Registration"
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          className={cn(
            buttonHeight, buttonPadding, textSize, "font-sf-pro font-semibold",
            "bg-accent-a hover:bg-accent-a/90 text-white border-0 rounded-xl2",
            "transition-all duration-200 touch-manipulation",
            "w-1/2 min-w-[200px]"
          )}
        >
          Next
          <ChevronRight className={cn(iconSize, "ml-2")} />
        </Button>
      )}
    </div>
  );
};