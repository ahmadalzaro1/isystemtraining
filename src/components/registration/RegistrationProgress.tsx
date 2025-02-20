
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
  const progress = (currentStepIndex / (totalSteps - 1)) * 100;

  return (
    <div className="space-y-4">
      <Progress 
        value={progress} 
        className="h-1 bg-gray-100 transition-all duration-500"
      />
      <div className="flex space-x-2 sm:space-x-4 overflow-hidden">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              index <= currentStepIndex ? "bg-primary scale-100" : "bg-gray-200 scale-95"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
