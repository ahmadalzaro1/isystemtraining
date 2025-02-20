import { useState } from "react";
import { format, addWeeks } from "date-fns";
import { Workshop, WorkshopFilters } from "@/types/workshop";
import { WorkshopNavigation } from "./workshops/WorkshopNavigation";
import { WorkshopDayGroup } from "./workshops/WorkshopDayGroup";
import { WorkshopRecommender } from "./recommendation/WorkshopRecommender";
import { WorkshopFilterBar } from "./workshops/WorkshopFilters";
import { NoWorkshopsFound } from "./workshops/NoWorkshopsFound";
import { mockWorkshops } from "@/data/mockWorkshops";
import { filterWorkshopsByWeek, filterWorkshopsByFilters } from "@/utils/workshopFilters";

interface WorkshopCalendarProps {
  onSelect: (workshop: Workshop) => void;
}

export const WorkshopCalendar = ({ onSelect }: WorkshopCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [filters, setFilters] = useState<WorkshopFilters>({
    search: "",
    skillLevel: "All",
    category: "All"
  });

  const navigateWeek = (direction: 'next' | 'prev') => {
    setCurrentWeek(prev => 
      direction === 'next' ? addWeeks(prev, 1) : addWeeks(prev, -1)
    );
  };

  const resetFilters = () => {
    setFilters({ search: "", skillLevel: "All", category: "All" });
  };

  const currentWeekWorkshops = filterWorkshopsByFilters(
    filterWorkshopsByWeek(mockWorkshops, currentWeek),
    filters
  );

  // Group workshops by date
  const workshopsByDate = currentWeekWorkshops.reduce((acc, workshop) => {
    const dateStr = format(workshop.date, "yyyy-MM-dd");
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(workshop);
    return acc;
  }, {} as Record<string, Workshop[]>);

  return (
    <div className="space-y-8 animate-fade-up">
      <WorkshopNavigation 
        currentWeek={currentWeek}
        onNavigate={navigateWeek}
      />

      <WorkshopFilterBar 
        filters={filters}
        onChange={setFilters}
      />

      <div className="flex justify-center mb-8">
        <WorkshopRecommender 
          workshops={mockWorkshops}
          onSelect={onSelect}
        />
      </div>

      <div className="grid gap-6">
        {Object.entries(workshopsByDate).map(([dateStr, dayWorkshops]) => (
          <WorkshopDayGroup
            key={dateStr}
            date={dateStr}
            workshops={dayWorkshops}
            onSelect={onSelect}
          />
        ))}
        
        {currentWeekWorkshops.length === 0 && (
          <NoWorkshopsFound 
            filters={filters}
            onReset={resetFilters}
          />
        )}
      </div>
    </div>
  );
};
