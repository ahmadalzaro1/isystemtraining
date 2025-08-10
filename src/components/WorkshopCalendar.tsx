
import { useState, useMemo, memo, useCallback, useEffect } from "react";
import { format, addWeeks } from "date-fns";
import { Workshop, WorkshopFilters } from "@/types/workshop";
import { WorkshopNavigation } from "./workshops/WorkshopNavigation";
import { WorkshopDayGroup } from "./workshops/WorkshopDayGroup";
import { WorkshopRecommender } from "./recommendation/WorkshopRecommender";
import { WorkshopFilterBar } from "./workshops/WorkshopFilters";
import { NoWorkshopsFound } from "./workshops/NoWorkshopsFound";
import { WorkshopService } from "@/services/workshopService";
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
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  // Load workshops from Supabase so IDs are UUIDs
  useEffect(() => {
    let isMounted = true;
    WorkshopService.getWorkshops()
      .then((list) => { if (isMounted) setWorkshops(list); })
      .catch(() => { /* noop */ });
    return () => { isMounted = false; };
  }, []);

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
    const weekFiltered = filterWorkshopsByWeek(workshops, currentWeek);
    const finalFiltered = filterWorkshopsByFilters(weekFiltered, filters);
    
    console.log('Workshop filtering:', {
      totalWorkshops: workshops.length,
      currentWeek: currentWeek.toISOString(),
      weekFiltered: weekFiltered.length,
      finalFiltered: finalFiltered.length,
      filters
    });
    
    return finalFiltered;
  }, [currentWeek, filters, workshops]);

  // Group workshops by date with memoization
  const workshopsByDate = useMemo(() => {
    const grouped = currentWeekWorkshops.reduce((acc, workshop) => {
      const dateStr = format(workshop.date, "yyyy-MM-dd");
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(workshop);
      return acc;
    }, {} as Record<string, Workshop[]>);
    
    console.log('Workshops grouped by date:', {
      groupedKeys: Object.keys(grouped),
      totalGrouped: Object.values(grouped).reduce((sum, workshops) => sum + workshops.length, 0),
      grouped
    });
    
    return grouped;
  }, [currentWeekWorkshops]);

  return (
    <div className={prefersReducedMotion ? "space-y-8" : "space-y-8 animate-fade-up"}>
      <header className="text-center space-y-2">
        <h2 
          id="workshops-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[hsl(var(--text-strong))]"
        >
          Select Your Workshop
        </h2>
        <p className="text-[hsl(var(--text-muted))] text-base sm:text-lg">
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
          workshops={workshops}
          onSelect={onSelect}
        />
      </div>

      <div 
        className={`grid gap-6 bg-surface rounded-xl2 hairline ${
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
