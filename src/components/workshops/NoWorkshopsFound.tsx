
import { Button } from "@/components/ui/button";
import { WorkshopFilters } from "@/types/workshop";

interface NoWorkshopsFoundProps {
  filters: WorkshopFilters;
  onReset: () => void;
}

export const NoWorkshopsFound = ({ filters, onReset }: NoWorkshopsFoundProps) => {
  const hasActiveFilters = filters.search || filters.skillLevel !== "All" || filters.category !== "All";

  return (
    <div className="text-center py-12 bg-surface2 rounded-xl border border-[hsl(var(--border))] shadow-elev-1 animate-fade-up">
      <p className="text-xl text-[hsl(var(--text-muted))]">
        No workshops found
        {hasActiveFilters ? " — try adjusting your filters!" : " this week"}
      </p>
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onReset}
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
};
