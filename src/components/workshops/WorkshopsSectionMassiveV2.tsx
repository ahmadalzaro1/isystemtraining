import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { format, addWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { Calendar as CalendarIcon, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Workshop, WorkshopFilters } from '@/types/workshop';
import { WorkshopService } from '@/services/workshopService';
import { filterWorkshopsByWeek, filterWorkshopsByFilters } from '@/utils/workshopFilters';
import { WorkshopCardV2 } from './WorkshopCardV2';
import { WorkshopRecommender } from '../recommendation/WorkshopRecommender';
import { NoWorkshopsFound } from './NoWorkshopsFound';
import { WorkshopSkeleton } from './WorkshopSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface WorkshopsSectionMassiveV2Props {
  onSelect: (workshop: Workshop) => void;
}

export function WorkshopsSectionMassiveV2({ onSelect }: WorkshopsSectionMassiveV2Props) {
  const prefersReducedMotion = useReducedMotion();
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [date, setDate] = useState<Date>();
  const [filters, setFilters] = useState<WorkshopFilters>({
    search: "",
    skillLevel: "All", 
    category: "All"
  });
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load workshops for the current week
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

  const handleReset = useCallback(() => {
    setFilters({ search: "", skillLevel: "All", category: "All" });
  }, []);

  const handleDateSelect = useCallback((selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setCurrentWeek(selectedDate);
    }
  }, []);

  // Filter workshops
  const currentWeekWorkshops = useMemo(() => {
    const weekFiltered = filterWorkshopsByWeek(workshops, currentWeek);
    return filterWorkshopsByFilters(weekFiltered, filters);
  }, [currentWeek, filters, workshops]);

  // Group workshops by date
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

  const categories = [
    { value: "All", label: "All Categories" },
    { value: "Mac", label: "💻 Mac" },
    { value: "iPhone", label: "📱 iPhone" },
    { value: "Apple Watch", label: "⌚ Apple Watch" },
    { value: "AI", label: "🤖 AI" },
    { value: "Digital Safety", label: "🔐 Digital Safety" },
    { value: "Creativity", label: "🎨 Creativity" },
    { value: "Productivity", label: "🚀 Productivity" },
    { value: "iCloud", label: "☁️ iCloud" }
  ];

  return (
    <section 
      id="workshops"
      className="py-20 px-8 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--surface))/0.3]"
      aria-labelledby="workshops-heading"
      style={{ 
        padding: '80px 32px !important',
        gap: '32px !important',
        minHeight: 'auto !important'
      }}
    >
      {/* Hero Header */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2
          id="workshops-heading"
          className="text-5xl font-bold mb-6 text-[hsl(var(--text-strong))]"
          style={{ marginBottom: '24px !important' }}
        >
          Upcoming Workshops
        </h2>
        <p className="text-xl text-[hsl(var(--text-muted))] mb-8 max-w-2xl mx-auto leading-relaxed">
          Pick a week, filter by your interests, then choose your perfect learning experience.
        </p>
      </div>

      {/* Navigation & Filters */}
      <div className="max-w-6xl mx-auto mb-16 space-y-12">
        {/* Week Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateWeek('prev')}
              className="px-8 py-4 text-lg h-14 min-w-[120px]"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Week
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentWeek(new Date())}
              className="px-8 py-4 text-lg h-14 min-w-[100px]"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateWeek('next')}
              className="px-8 py-4 text-lg h-14 min-w-[120px]"
            >
              Week
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg h-14 min-w-[180px]"
              >
                <CalendarIcon className="w-5 h-5 mr-3" />
                {date ? format(date, "MMM d") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-6" align="center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Week Display */}
        <div className="text-center">
          <p className="text-2xl text-[hsl(var(--text-muted))] font-medium">
            Week of {format(currentWeek, "MMMM d")} → {format(addWeeks(currentWeek, 1), "MMMM d, yyyy")}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))] h-6 w-6" />
            <Input
              placeholder="Search workshops..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-14 pr-14 h-16 text-lg bg-[hsl(var(--surface))] border-[hsl(var(--border))] focus:bg-[hsl(var(--background))] transition-colors rounded-2xl shadow-lg"
            />
            {filters.search && (
              <button
                onClick={() => setFilters({ ...filters, search: "" })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-strong))] transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>

        {/* Skill Level Filter */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center text-[hsl(var(--text-strong))]">Skill Level</h3>
          <div 
            className="flex gap-6 justify-center overflow-x-auto pb-4 px-4"
            style={{
              WebkitOverflowScrolling: 'touch',
              maskImage: 'linear-gradient(to right, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%)'
            }}
          >
            {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <Badge
                key={level}
                variant={filters.skillLevel === level ? "default" : "outline"}
                className={cn(
                  "px-10 py-5 text-xl rounded-full cursor-pointer transition-all duration-200 ease-out whitespace-nowrap flex-shrink-0 min-w-[140px] h-16 flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105",
                  filters.skillLevel === level 
                    ? "border-[hsl(var(--accent-a))] bg-[hsl(var(--accent-a))/0.12] text-[hsl(var(--accent-a))]" 
                    : "bg-[hsl(var(--surface))] hover:bg-[hsl(var(--surface-2))]"
                )}
                onClick={() => setFilters({ ...filters, skillLevel: level as WorkshopFilters["skillLevel"] })}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center text-[hsl(var(--text-strong))]">Categories</h3>
          <div 
            className="flex gap-6 justify-center overflow-x-auto pb-4 px-4"
            style={{
              WebkitOverflowScrolling: 'touch',
              maskImage: 'linear-gradient(to right, transparent 0%, black 40px, black calc(100% - 40px), transparent 100%)'
            }}
          >
            {categories.map(({ value, label }) => (
              <Badge
                key={value}
                variant={filters.category === value ? "default" : "outline"}
                className={cn(
                  "px-8 py-5 text-lg rounded-full cursor-pointer transition-all duration-200 ease-out whitespace-nowrap flex-shrink-0 min-w-[120px] h-16 flex items-center justify-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105",
                  filters.category === value 
                    ? "border-[hsl(var(--accent-a))] bg-[hsl(var(--accent-a))/0.12] text-[hsl(var(--accent-a))]" 
                    : "bg-[hsl(var(--surface))] hover:bg-[hsl(var(--surface-2))]"
                )}
                onClick={() => setFilters({ ...filters, category: value as WorkshopFilters["category"] })}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Reset Filters */}
        {(filters.search || filters.skillLevel !== "All" || filters.category !== "All") && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={handleReset}
              className="px-10 py-4 text-lg h-14 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Reset All Filters
            </Button>
          </div>
        )}

        {/* Workshop Recommender */}
        <div className="flex justify-center">
          <WorkshopRecommender 
            workshops={workshops}
            onSelect={onSelect}
          />
        </div>
      </div>

      {/* Workshop Listings */}
      <div className="max-w-6xl mx-auto">
        <div 
          className={cn(
            "bg-[hsl(var(--surface))] rounded-3xl border border-[hsl(var(--border))] shadow-2xl overflow-hidden",
            !prefersReducedMotion && `transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`
          )}
          style={{ minHeight: 'auto !important' }}
        >
          {(isLoading || isTransitioning) ? (
            <div className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <WorkshopSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {Object.entries(workshopsByDate).map(([dateStr, dayWorkshops]) => (
                <div key={dateStr} className="border-b border-[hsl(var(--border))] last:border-b-0">
                  {/* Date Header */}
                  <div className="bg-gradient-to-r from-[hsl(var(--surface-2))] to-[hsl(var(--surface))] px-12 py-8 border-b border-[hsl(var(--border))]">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-3xl font-bold text-[hsl(var(--text-strong))] mb-2">
                          {format(new Date(dateStr), 'EEEE, MMMM d')}
                        </h3>
                        <p className="text-lg text-[hsl(var(--text-muted))]">
                          {dayWorkshops.length} workshop{dayWorkshops.length === 1 ? '' : 's'} available
                        </p>
                      </div>
                      {format(new Date(dateStr), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && (
                        <Badge className="px-6 py-3 text-lg bg-[hsl(var(--accent-a))] text-white rounded-full">
                          Today
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Workshop Cards */}
                  <div className="p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {dayWorkshops
                        .sort((a, b) => a.spotsRemaining - b.spotsRemaining)
                        .map((workshop, index) => (
                          <WorkshopCardV2
                            key={workshop.id}
                            workshop={workshop}
                            onSelect={onSelect}
                            index={index}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
              
              {currentWeekWorkshops.length === 0 && (
                <div className="p-16">
                  <NoWorkshopsFound 
                    filters={filters}
                    onReset={handleReset}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}