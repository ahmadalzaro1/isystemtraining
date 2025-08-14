
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addWeeks } from "date-fns";

interface WorkshopNavigationProps {
  currentWeek: Date;
  onNavigate: (direction: 'next' | 'prev') => void;
}

export const WorkshopNavigation = ({ currentWeek, onNavigate }: WorkshopNavigationProps) => {
  const nextWeek = addWeeks(currentWeek, 1);

  return (
    <div className="max-w-[min(1100px,92vw)] mx-auto px-[clamp(12px,4vw,24px)]">
      <h2 className="text-[clamp(24px,4.5vw,32px)] leading-tight mb-1 text-[hsl(var(--text-strong))]">Available Workshops</h2>
      <p className="text-[hsl(var(--text-muted))] mb-[clamp(24px,6vw,32px)] text-[clamp(14px,2.9vw,16px)]">Pick a week, filter, then choose your seat.</p>
      
      <div className="wk-sticky">
        <div className="max-w-[min(1100px,92vw)] mx-auto py-[clamp(16px,4vw,24px)] px-[clamp(12px,4vw,24px)]">
          <div className="flex justify-center gap-[clamp(12px,3vw,24px)] mb-[clamp(24px,6vw,32px)]">
            <div className="wk-seg" role="group" aria-label="Week navigation">
              <button 
                className="px-[clamp(16px,4vw,32px)] py-[clamp(12px,3vw,16px)] text-[clamp(14px,2.8vw,18px)] bg-surface2 border-none transition-all duration-ios hover:bg-surface min-h-[44px] flex items-center justify-center" 
                aria-pressed="false" 
                onClick={() => onNavigate('prev')}
              >
                ‹ Week
              </button>
              <button 
                className="px-[clamp(16px,4vw,32px)] py-[clamp(12px,3vw,16px)] text-[clamp(14px,2.8vw,18px)] bg-surface2 border-none transition-all duration-ios hover:bg-surface min-h-[44px] flex items-center justify-center" 
                aria-pressed="false" 
                onClick={() => onNavigate('next')}
              >
                Week ›
              </button>
            </div>
          </div>
          
          <div className="text-center text-[clamp(14px,2.8vw,18px)] text-[hsl(var(--text-muted))]">
            Week of {format(currentWeek, "MMMM d")} → {format(addWeeks(currentWeek, 1), "MMMM d, yyyy")}
          </div>
        </div>
      </div>
    </div>
  );
};
