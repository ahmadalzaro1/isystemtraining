
import { cn } from "@/lib/utils";

interface SeatsProgressBarProps {
  totalSeats: number;
  spotsRemaining: number;
}

export const SeatsProgressBar = ({ totalSeats, spotsRemaining }: SeatsProgressBarProps) => {
  const spotsTaken = totalSeats - spotsRemaining;
  const percentageFilled = (spotsTaken / totalSeats) * 100;
  
  const getProgressColor = () => {
    if (percentageFilled >= 80) return "bg-red-500";
    if (percentageFilled >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const shouldPulse = percentageFilled >= 80;

  return (
    <div className="w-full h-0.5 bg-[hsl(var(--border))] rounded overflow-hidden">
      <div
        className={cn(
          "h-full transition-all duration-500 ease-out rounded-full progress-bar-fill",
          getProgressColor(),
          shouldPulse && "animate-pulse"
        )}
        style={{ 
          width: `${percentageFilled}%`,
          '--progress-width': `${percentageFilled}%`
        } as React.CSSProperties}
      />
    </div>
  );
};
