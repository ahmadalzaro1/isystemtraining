import { Button } from "@/components/ui/button";
import { WorkshopFilters } from "@/types/workshop";
import { Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface NextAvailableWeek {
  hasWorkshops: boolean;
  weekStart?: Date;
  weekEnd?: Date;
  workshopCount?: number;
}

interface NoWorkshopsFoundProps {
  filters: WorkshopFilters;
  onReset: () => void;
  nextAvailableWeek?: NextAvailableWeek | null;
  onJumpToWeek?: (weekStart: Date) => void;
  isLoading?: boolean;
}

export const NoWorkshopsFound = ({ 
  filters, 
  onReset,
  nextAvailableWeek,
  onJumpToWeek,
  isLoading = false
}: NoWorkshopsFoundProps) => {
  const hasActiveFilters = filters.search || filters.skillLevel !== "All" || filters.category !== "All";

  return (
    <div className="text-center py-12 lgx-card rounded-2xl shadow-elev-1 animate-fade-up">
      {/* Icon */}
      <div className="text-6xl mb-4">📅</div>
      
      {/* Main Message */}
      <p className="text-xl font-semibold text-[hsl(var(--text-strong))] mb-2">
        No workshops found this week
      </p>
      
      {/* Secondary Message based on next available */}
      {isLoading && (
        <p className="text-base text-[hsl(var(--text-muted))] mb-6">
          Checking upcoming weeks...
        </p>
      )}
      
      {!isLoading && nextAvailableWeek?.hasWorkshops && nextAvailableWeek.weekStart && (
        <>
          <p className="text-lg text-[hsl(var(--accent-a))] font-medium mb-2">
            But good news! <strong>{nextAvailableWeek.workshopCount} workshop{nextAvailableWeek.workshopCount !== 1 ? 's' : ''}</strong> available next week
          </p>
          <p className="text-sm text-[hsl(var(--text-muted))] mb-6">
            {format(nextAvailableWeek.weekStart, 'MMM d')} - {format(nextAvailableWeek.weekEnd!, 'MMM d, yyyy')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              onClick={() => onJumpToWeek?.(nextAvailableWeek.weekStart!)}
              className="bg-gradient-to-r from-[hsl(var(--accent-a))] to-[hsl(var(--accent-b))] text-white shadow-elev-2 hover:shadow-focus transition-all duration-200 rounded-pill px-6 py-3"
            >
              Jump to Next Week
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </>
      )}
      
      {!isLoading && nextAvailableWeek && !nextAvailableWeek.hasWorkshops && (
        <p className="text-base text-[hsl(var(--text-muted))] mb-6">
          No workshops scheduled in the next 3 weeks
          {hasActiveFilters ? " — try adjusting your filters!" : "."}
        </p>
      )}
      
      {/* Reset Filter Button */}
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onReset}
        >
          <Calendar className="mr-2 w-4 h-4" />
          Reset Filters
        </Button>
      )}
    </div>
  );
};
