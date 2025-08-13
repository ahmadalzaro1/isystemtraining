
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
    <div className="wk-wrap">
      <h2 className="text-[28px] leading-[32px] mb-1 text-[hsl(var(--text-strong))]">Available Workshops</h2>
      <p className="text-[hsl(var(--text-muted))] mb-8">Pick a week, filter, then choose your seat.</p>
      
      <div className="wk-sticky">
        <div className="wk-wrap py-6">
          <div className="flex justify-center gap-6 mb-8">
            <div className="wk-seg" role="group" aria-label="Week navigation">
              <button 
                className="px-8 py-4 text-lg bg-surface2 border-none transition-all duration-ios hover:bg-surface" 
                aria-pressed="false" 
                onClick={() => onNavigate('prev')}
              >
                ‹ Week
              </button>
              <button 
                className="px-8 py-4 text-lg bg-surface2 border-none transition-all duration-ios hover:bg-surface" 
                aria-pressed="false" 
                onClick={() => onNavigate('next')}
              >
                Week ›
              </button>
            </div>
          </div>
          
          <div className="text-center text-lg text-[hsl(var(--text-muted))]">
            Week of {format(currentWeek, "MMMM d")} → {format(addWeeks(currentWeek, 1), "MMMM d, yyyy")}
          </div>
        </div>
      </div>
    </div>
  );
};
