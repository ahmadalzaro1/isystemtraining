import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useViewportResize } from '@/hooks/useViewportResize';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ id: string; title: string; description: string }>;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  const viewport = useViewportResize();
  
  return (
    <div className={cn(
      "flex items-center justify-center overflow-x-auto pb-2",
      viewport.isSmall ? "space-x-2" : "space-x-4 sm:space-x-8"
    )}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        // Responsive sizing
        const circleSize = viewport.isSmall ? "w-8 h-8" : "w-10 h-10";
        const iconSize = viewport.isSmall ? "w-4 h-4" : "w-5 h-5";
        const textSize = viewport.isSmall ? "text-xs" : "text-ios-footnote";

        return (
          <div key={step.id} className="flex items-center flex-shrink-0">
            {/* Step Circle */}
            <div
              className={cn(
                "flex items-center justify-center rounded-full",
                "border-2 transition-all duration-300 font-sf-pro font-semibold",
                circleSize,
                isCompleted && "bg-accent-a border-accent-a text-white",
                isCurrent && "bg-accent-a/10 border-accent-a text-accent-a",
                isUpcoming && "bg-surface-2 border-border text-text-muted"
              )}
            >
              {isCompleted ? (
                <Check className={iconSize} />
              ) : (
                <span className={textSize}>{index + 1}</span>
              )}
            </div>

            {/* Step Title (Responsive visibility) */}
            {!viewport.isSmall && (
              <div className="ml-3 min-w-0">
                <div
                  className={cn(
                    "font-sf-pro font-medium truncate",
                    viewport.isMedium ? "text-xs" : "text-ios-footnote",
                    isCurrent && "text-text",
                    (isCompleted || isUpcoming) && "text-text-muted"
                  )}
                >
                  {step.title}
                </div>
              </div>
            )}

            {/* Connector Line */}
            {index < totalSteps - 1 && !viewport.isSmall && (
              <div
                className={cn(
                  "h-0.5 transition-all duration-300 flex-shrink-0",
                  viewport.isMedium ? "w-8 mx-2" : "w-12 lg:w-16 mx-4",
                  index < currentStep ? "bg-accent-a" : "bg-border"
                )}
              />
            )}

            {/* Mobile dots connector */}
            {index < totalSteps - 1 && viewport.isSmall && (
              <div
                className={cn(
                  "w-1 h-1 rounded-full mx-1 transition-all duration-300",
                  index < currentStep ? "bg-accent-a" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};