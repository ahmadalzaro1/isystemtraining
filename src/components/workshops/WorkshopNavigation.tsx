
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
      <p className="text-[hsl(var(--text-muted))] mb-4">Pick a week, filter, then choose your seat.</p>
      
      <div className="wk-sticky">
        <div className="wk-wrap py-3">
          <div className="wk-row">
            <div className="wk-seg" role="group" aria-label="Week navigation">
              <button aria-pressed="false" onClick={() => onNavigate('prev')}>‹ Week</button>
              <button aria-pressed="false" onClick={() => onNavigate('next')}>Week ›</button>
            </div>
            <div className="grow"></div>
          </div>
          
          <div className="text-center mt-4 text-[hsl(var(--text-muted))]">
            Week of {format(currentWeek, "MMMM d")} → {format(addWeeks(currentWeek, 1), "MMMM d, yyyy")}
          </div>
        </div>
      </div>
    </div>
  );
};
