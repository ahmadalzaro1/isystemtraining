
import { useState, useMemo, memo, useCallback, useEffect } from "react";
import { format, addWeeks, startOfWeek, endOfWeek } from "date-fns";
import { Workshop, WorkshopFilters } from "@/types/workshop";
import { WorkshopDayGroup } from "./workshops/WorkshopDayGroup";
import { WorkshopRecommender } from "./recommendation/WorkshopRecommender";
import { NoWorkshopsFound } from "./workshops/NoWorkshopsFound";
import Explorer from "@/components/workshops/Explorer";
import UpcomingSectionIOS from "@/components/workshops/UpcomingSectionIOS";
import { WorkshopService } from "@/services/workshopService";
import { filterWorkshopsByWeek, filterWorkshopsByFilters } from "@/utils/workshopFilters";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WorkshopSkeleton } from "./workshops/WorkshopSkeleton";

interface WorkshopCalendarProps {
  onSelect: (workshop: Workshop) => void;
  variant?: 'v1' | 'v2';
}

export const WorkshopCalendar = memo(({ onSelect, variant = 'v2' }: WorkshopCalendarProps) => {
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
  const [isLoading, setIsLoading] = useState(true);

  // Load workshops for the current week via RPC, keep UUIDs intact
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
    WorkshopService.getWorkshopsWeek(weekStart, weekEnd, filters)
      .then((list) => { if (isMounted) setWorkshops(list); })
      .catch(() => { /* noop */ })
      .finally(() => { if (isMounted) setIsLoading(false); });
    return () => { isMounted = false; };
  }, [currentWeek, filters]);

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
    
    
    return grouped;
  }, [currentWeekWorkshops]);


  // Build explorer UI data
  const allCategories: Workshop["category"][] = ["Mac","iPhone","Apple Watch","AI","Digital Safety","Creativity","Productivity","iCloud"];
  const weekDays = useMemo(() => {
    return Object.entries(workshopsByDate)
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([dateStr, list]) => ({
        key: dateStr,
        label: format(new Date(dateStr), 'EEE d'),
        date: dateStr,
        count: list.length,
        active: false,
      }));
  }, [workshopsByDate]);
  const categoriesList = useMemo(() => allCategories.map(c => ({ id: c, name: c, active: filters.category === c })), [filters.category]);

  return (
    <Explorer
      weekLabel={`Week of ${format(currentWeek, "MMMM d")} → ${format(addWeeks(currentWeek, 1), "MMMM d, yyyy")}`}
      weekDays={weekDays}
      level={filters.skillLevel}
      categories={categoriesList}
      onPrevWeek={() => navigateWeek('prev')}
      onNextWeek={() => navigateWeek('next')}
      onToday={() => setCurrentWeek(new Date())}
      onOpenCalendar={() => {}}
      onSearch={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
      onLevel={(l) => setFilters(prev => ({ ...prev, skillLevel: l as WorkshopFilters["skillLevel"] }))}
      onToggleCat={(id) => setFilters(prev => ({ ...prev, category: prev.category === id ? "All" : (id as Workshop["category"]) }))}
      onResetFilters={resetFilters}
      onSelectDay={(d) => document.getElementById(`day-${d}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
    >
      <div className="flex justify-center mb-10">
        <WorkshopRecommender 
          workshops={workshops}
          onSelect={onSelect}
        />
      </div>
      <div 
        className={`grid gap-8 bg-surface rounded-xl2 hairline ${
          prefersReducedMotion ? '' : `transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`
        }`}
        role="region"
        aria-label="Workshop listings"
      >
        {(isLoading || isTransitioning) ? (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6 md:gap-8 min-w-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <WorkshopSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </Explorer>
  );
});

WorkshopCalendar.displayName = 'WorkshopCalendar';
