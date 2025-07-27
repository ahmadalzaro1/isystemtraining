
import { useState, useMemo, memo, useCallback } from "react";
import { format, addWeeks } from "date-fns";
import { Workshop, WorkshopFilters } from "@/types/workshop";
import { WorkshopNavigation } from "./workshops/WorkshopNavigation";
import { WorkshopDayGroup } from "./workshops/WorkshopDayGroup";
import { WorkshopRecommender } from "./recommendation/WorkshopRecommender";
import { WorkshopFilterBar } from "./workshops/WorkshopFilters";
import { NoWorkshopsFound } from "./workshops/NoWorkshopsFound";
import { mockWorkshops } from "@/data/mockWorkshops";
import { filterWorkshopsByWeek, filterWorkshopsByFilters } from "@/utils/workshopFilters";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface WorkshopCalendarProps {
  onSelect: (workshop: Workshop) => void;
}

export const WorkshopCalendar = memo(({ onSelect }: WorkshopCalendarProps) => {
  usePerformanceMonitor('WorkshopCalendar');
  const prefersReducedMotion = useReducedMotion();
  
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [filters, setFilters] = useState<WorkshopFilters>({
    search: "",
    skillLevel: "All",
    category: "All"
  });

  const navigateWeek = useCallback((direction: 'next' | 'prev') => {
    if (!prefersReducedMotion) {
      setIsTransitioning(true);
    }
    
    setTimeout(() => {
      setCurrentWeek(prev => direction === 'next' ? addWeeks(prev, 1) : addWeeks(prev, -1));
      if (!prefersReducedMotion) {
        setIsTransitioning(false);
      }
    }, prefersReducedMotion ? 0 : 300);
  }, [prefersReducedMotion]);

  const resetFilters = useCallback(() => {
    setFilters({ search: "", skillLevel: "All", category: "All" });
  }, []);

  // Memoize expensive calculations
  const currentWeekWorkshops = useMemo(() => {
    const weekFiltered = filterWorkshopsByWeek(mockWorkshops, currentWeek);
    const finalFiltered = filterWorkshopsByFilters(weekFiltered, filters);
    
    console.log('Workshop filtering:', {
      totalWorkshops: mockWorkshops.length,
      currentWeek: currentWeek.toISOString(),
      weekFiltered: weekFiltered.length,
      finalFiltered: finalFiltered.length,
      filters
    });
    
    return finalFiltered;
  }, [currentWeek, filters]);

  // Group workshops by date with memoization
  const workshopsByDate = useMemo(() => {
    return currentWeekWorkshops.reduce((acc, workshop) => {
      const dateStr = format(workshop.date, "yyyy-MM-dd");
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(workshop);
      return acc;
    }, {} as Record<string, Workshop[]>);
  }, [currentWeekWorkshops]);

  return (
    <div className={prefersReducedMotion ? "space-y-8" : "space-y-8 animate-fade-up"}>
      <header className="text-center space-y-2">
        <h2 
          id="workshops-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1D1D1F]"
        >
          Select Your Workshop
        </h2>
        <p className="text-[#6E6E73] text-base sm:text-lg">
          Choose a date to view available workshops
        </p>
      </header>

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

      <div 
        className={`grid gap-6 ${
          prefersReducedMotion ? '' : `transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`
        }`}
        role="region"
        aria-label="Workshop listings"
      >
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
});

WorkshopCalendar.displayName = 'WorkshopCalendar';
