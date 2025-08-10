
import { Progress } from "@/components/ui/progress";

interface RegistrationProgressProps {
  currentStepIndex: number;
  totalSteps: number;
  isTransitioning: boolean;
}

export const RegistrationProgress = ({ 
  currentStepIndex, 
  totalSteps,
  isTransitioning 
}: RegistrationProgressProps) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-2 sm:space-x-4 overflow-hidden">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              index <= currentStepIndex ? "bg-primary scale-100" : "bg-[hsl(var(--border))] scale-95"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
