import React, { useState, useMemo } from 'react';
import { format, addWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Workshop, WorkshopFilters } from '@/types/workshop';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface WorkshopsSectionV4Props {
  workshops: Workshop[];
  onSelect: (workshop: Workshop) => void;
}

export function WorkshopsSectionV4({ workshops, onSelect }: WorkshopsSectionV4Props) {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [filters, setFilters] = useState<WorkshopFilters>({
    search: "",
    skillLevel: "All",
    category: "All",
    location: "All"
  });

  // Group workshops by week
  const weekWorkshops = useMemo(() => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
    
    return workshops.filter(workshop => {
      const workshopDate = new Date(workshop.date);
      const inWeek = workshopDate >= weekStart && workshopDate <= weekEnd;
      const matchesLevel = filters.skillLevel === "All" || workshop.skillLevel === filters.skillLevel;
      const matchesCategory = filters.category === "All" || workshop.category === filters.category;
      
      return inWeek && matchesLevel && matchesCategory;
    }); // Show all workshops for current week
  }, [workshops, currentWeek, filters]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'next' ? addWeeks(prev, 1) : addWeeks(prev, -1));
  };

  const handleFilterChange = (newFilters: Partial<WorkshopFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <section className="py-[clamp(40px,8vh,80px)] px-[clamp(16px,4vw,32px)] bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--surface))/0.3]">
      <div className="max-w-[min(1100px,92vw)] mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-[clamp(32px,8vw,64px)]">
          <h2 className="text-[clamp(32px,6vw,56px)] font-bold text-[hsl(var(--text-strong))] mb-[clamp(16px,3vw,24px)] leading-tight">
            Upcoming Workshops
          </h2>
          <p className="text-[clamp(16px,3.2vw,20px)] text-[hsl(var(--text-muted))] max-w-[min(600px,90%)] mx-auto leading-relaxed">
            Navigate by week, filter by your needs, and register for the perfect learning experience.
          </p>
        </div>

        {/* Week Navigation */}
        <div className="flex flex-col items-center gap-[clamp(16px,4vw,24px)] mb-[clamp(32px,6vw,48px)]">
          <div className="flex flex-col sm:flex-row items-center gap-[clamp(8px,2vw,16px)] w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateWeek('prev')}
              className="min-h-[clamp(48px,8vw,56px)] px-[clamp(16px,4vw,32px)] text-[clamp(14px,2.8vw,18px)] w-full sm:w-auto"
            >
              <ChevronLeft className="w-[clamp(16px,3vw,20px)] h-[clamp(16px,3vw,20px)] mr-2" />
              Previous Week
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentWeek(new Date())}
              className="min-h-[clamp(48px,8vw,56px)] px-[clamp(16px,4vw,32px)] text-[clamp(14px,2.8vw,18px)] w-full sm:w-auto"
            >
              <Calendar className="w-[clamp(16px,3vw,20px)] h-[clamp(16px,3vw,20px)] mr-2" />
              This Week
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateWeek('next')}
              className="min-h-[clamp(48px,8vw,56px)] px-[clamp(16px,4vw,32px)] text-[clamp(14px,2.8vw,18px)] w-full sm:w-auto"
            >
              Next Week
              <ChevronRight className="w-[clamp(16px,3vw,20px)] h-[clamp(16px,3vw,20px)] ml-2" />
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-[clamp(18px,3.5vw,24px)] font-semibold text-[hsl(var(--text-strong))]">
              {format(startOfWeek(currentWeek, { weekStartsOn: 0 }), 'MMMM d')} - {format(endOfWeek(currentWeek, { weekStartsOn: 0 }), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-[clamp(24px,6vw,40px)] mb-[clamp(32px,6vw,64px)]">
          {/* Difficulty Filter */}
          <div className="text-center">
            <h3 className="text-[clamp(20px,3.8vw,28px)] font-semibold text-[hsl(var(--text-strong))] mb-[clamp(16px,3vw,24px)]">Difficulty Level</h3>
            <div className="flex gap-[clamp(8px,2.5vw,12px)] overflow-x-auto snap-x snap-mandatory -mx-[clamp(8px,2vw,16px)] px-[clamp(8px,2vw,16px)] -webkit-overflow-scrolling-touch">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <Badge
                  key={level}
                  variant={filters.skillLevel === level ? "default" : "outline"}
                  className={cn(
                    "px-[clamp(16px,4vw,32px)] py-[clamp(12px,3vw,16px)] text-[clamp(14px,2.8vw,18px)] cursor-pointer transition-all duration-200 min-h-[44px] flex items-center justify-center flex-none snap-start whitespace-nowrap",
                    filters.skillLevel === level 
                      ? "bg-[hsl(var(--accent-a))] text-white border-[hsl(var(--accent-a))]" 
                      : "hover:bg-[hsl(var(--surface-2))]"
                  )}
                  onClick={() => handleFilterChange({ skillLevel: level as WorkshopFilters["skillLevel"] })}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="text-center">
            <h3 className="text-[clamp(20px,3.8vw,28px)] font-semibold text-[hsl(var(--text-strong))] mb-[clamp(16px,3vw,24px)]">Categories</h3>
            <div className="flex gap-[clamp(8px,2.5vw,12px)] overflow-x-auto snap-x snap-mandatory -mx-[clamp(8px,2vw,16px)] px-[clamp(8px,2vw,16px)] -webkit-overflow-scrolling-touch">
              {[
                { value: 'Digital Safety', label: '🔐 Digital Safety & Security' },
                { value: 'AI', label: '🤖 AI Tools for Everyday Life' },
                { value: 'Parental Controls', label: '👨‍👩‍👧‍👦 Parental Controls & Child Tech' }
              ].map(({ value, label }) => (
                <Badge
                  key={value}
                  variant={filters.category === value ? "default" : "outline"}
                  className={cn(
                    "px-[clamp(16px,4vw,24px)] py-[clamp(12px,3vw,16px)] text-[clamp(14px,2.8vw,18px)] cursor-pointer transition-all duration-200 min-h-[44px] flex items-center justify-center flex-none snap-start whitespace-nowrap",
                    filters.category === value 
                      ? "bg-[hsl(var(--accent-a))] text-white border-[hsl(var(--accent-a))]" 
                      : "hover:bg-[hsl(var(--surface-2))]"
                  )}
                  onClick={() => handleFilterChange({ category: value as WorkshopFilters["category"] })}
                >
                  {label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Reset Filter */}
          {(filters.skillLevel !== "All" || filters.category !== "All") && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setFilters({ search: "", skillLevel: "All", category: "All", location: "All" })}
                className="min-h-[clamp(44px,6vw,48px)] px-[clamp(16px,4vw,32px)] text-[clamp(14px,2.8vw,18px)] w-full sm:w-auto"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Workshop Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[clamp(16px,3vw,24px)] auto-rows-fr">
          {weekWorkshops.map((workshop) => (
            <Card key={workshop.id} className="lgx-card hover:shadow-xl transition-all duration-300 w-full min-w-0">
              <CardHeader className="pb-[clamp(12px,3vw,16px)] p-[clamp(16px,4.5vw,24px)]">
                <div className="text-[clamp(12px,2.5vw,14px)] text-[hsl(var(--text-muted))] mb-2">
                  {format(new Date(workshop.date), 'EEEE, MMMM d')}
                </div>
                <CardTitle className="text-[clamp(18px,3.5vw,24px)] leading-tight">
                  {workshop.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-[clamp(12px,3vw,16px)] p-[clamp(16px,4.5vw,24px)] pt-0">
                <div className="flex flex-wrap gap-[clamp(8px,2vw,16px)] text-[clamp(12px,2.5vw,14px)] text-[hsl(var(--text-muted))]">
                  <span className="flex items-center gap-1">
                    🕐 {workshop.time}
                  </span>
                  <span className="flex items-center gap-1">
                    📊 {workshop.skillLevel}
                  </span>
                  <span className="flex items-center gap-1">
                    📁 {workshop.category}
                  </span>
                  <span className="flex items-center gap-1">
                    📍 {workshop.location}
                  </span>
                </div>
                
                <p className="text-[clamp(14px,2.9vw,16px)] text-[hsl(var(--text-muted))] leading-relaxed">
                  {workshop.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[clamp(12px,2.5vw,14px)]">
                    <span>Available spots</span>
                    <span className="font-medium">{workshop.spotsRemaining} spots left</span>
                  </div>
                  <div className="w-full bg-[hsl(var(--surface-2))] rounded-full h-2">
                    <div 
                      className="bg-[hsl(var(--accent-a))] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(0, 100 - (workshop.spotsRemaining * 10))}%` }}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-[clamp(16px,4.5vw,24px)] pt-0">
                <Button
                  onClick={() => navigate(`/registration/${workshop.id}`)}
                  className="w-full min-h-[clamp(44px,6vw,48px)] text-[clamp(14px,2.8vw,18px)] bg-[hsl(var(--accent-a))] hover:bg-[hsl(var(--accent-a))/0.9] text-white"
                  disabled={workshop.spotsRemaining === 0}
                >
                  {workshop.spotsRemaining === 0 ? 'Fully Booked' : 'Register Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {weekWorkshops.length === 0 && (
            <div className="col-span-full text-center py-[clamp(32px,8vw,64px)]">
              <div className="text-[clamp(48px,10vw,96px)] mb-[clamp(16px,3vw,24px)]">📅</div>
              <h3 className="text-[clamp(20px,3.8vw,28px)] font-semibold text-[hsl(var(--text-strong))] mb-2">
                No workshops this week
              </h3>
              <p className="text-[clamp(16px,3.2vw,20px)] text-[hsl(var(--text-muted))]">
                Try navigating to a different week or adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}