import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

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
  return (
    <div className="flex items-center justify-center space-x-4 sm:space-x-8">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step Circle */}
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                "border-2 transition-all duration-300 font-sf-pro font-semibold",
                isCompleted && "bg-accent-a border-accent-a text-white",
                isCurrent && "bg-accent-a/10 border-accent-a text-accent-a",
                isUpcoming && "bg-surface-2 border-border text-text-muted"
              )}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-ios-footnote">{index + 1}</span>
              )}
            </div>

            {/* Step Title (Hidden on small screens) */}
            <div className="hidden sm:block ml-3">
              <div
                className={cn(
                  "text-ios-footnote font-sf-pro font-medium",
                  isCurrent && "text-text",
                  (isCompleted || isUpcoming) && "text-text-muted"
                )}
              >
                {step.title}
              </div>
            </div>

            {/* Connector Line */}
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "hidden sm:block w-12 lg:w-16 h-0.5 mx-4 transition-all duration-300",
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