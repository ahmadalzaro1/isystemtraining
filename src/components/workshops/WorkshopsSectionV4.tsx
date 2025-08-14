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
    category: "All"
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
    }).slice(0, 3); // Show max 3 workshops
  }, [workshops, currentWeek, filters]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'next' ? addWeeks(prev, 1) : addWeeks(prev, -1));
  };

  const handleFilterChange = (newFilters: Partial<WorkshopFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--surface))/0.3]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[hsl(var(--text-strong))] mb-6">
            Upcoming Workshops
          </h2>
          <p className="text-xl text-[hsl(var(--text-muted))] max-w-2xl mx-auto">
            Navigate by week, filter by your needs, and register for the perfect learning experience.
          </p>
        </div>

        {/* Week Navigation */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateWeek('prev')}
              className="h-14 px-8 text-lg"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous Week
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentWeek(new Date())}
              className="h-14 px-8 text-lg"
            >
              <Calendar className="w-5 h-5 mr-2" />
              This Week
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateWeek('next')}
              className="h-14 px-8 text-lg"
            >
              Next Week
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-semibold text-[hsl(var(--text-strong))]">
              {format(startOfWeek(currentWeek, { weekStartsOn: 0 }), 'MMMM d')} - {format(endOfWeek(currentWeek, { weekStartsOn: 0 }), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-10 mb-16">
          {/* Difficulty Filter */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-[hsl(var(--text-strong))] mb-6">Difficulty Level</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                <Badge
                  key={level}
                  variant={filters.skillLevel === level ? "default" : "outline"}
                  className={cn(
                    "px-8 py-4 text-lg cursor-pointer transition-all duration-200 min-h-[44px] flex items-center justify-center",
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
            <h3 className="text-2xl font-semibold text-[hsl(var(--text-strong))] mb-6">Categories</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-4xl mx-auto">
              {[
                { value: 'Digital Safety', label: '🔐 Digital Safety & Security' },
                { value: 'AI', label: '🤖 AI Tools for Everyday Life' },
                { value: 'Parental Controls', label: '👨‍👩‍👧‍👦 Parental Controls & Child Tech' }
              ].map(({ value, label }) => (
                <Badge
                  key={value}
                  variant={filters.category === value ? "default" : "outline"}
                  className={cn(
                    "px-6 py-4 text-lg cursor-pointer transition-all duration-200 min-h-[44px] flex items-center justify-center flex-1",
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
                onClick={() => setFilters({ search: "", skillLevel: "All", category: "All" })}
                className="h-12 px-8 text-lg"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Workshop Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {weekWorkshops.map((workshop) => (
            <Card key={workshop.id} className="lgx-card hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="text-sm text-[hsl(var(--text-muted))] mb-2">
                  {format(new Date(workshop.date), 'EEEE, MMMM d')}
                </div>
                <CardTitle className="text-xl leading-tight">
                  {workshop.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-[hsl(var(--text-muted))]">
                  <span className="flex items-center">
                    🕐 {workshop.time}
                  </span>
                  <span className="flex items-center">
                    📊 {workshop.skillLevel}
                  </span>
                  <span className="flex items-center">
                    📁 {workshop.category}
                  </span>
                </div>
                
                <p className="text-[hsl(var(--text-muted))] leading-relaxed">
                  {workshop.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
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
              
              <CardFooter>
                <Button
                  onClick={() => navigate(`/registration/${workshop.id}`)}
                  className="w-full h-12 text-lg bg-[hsl(var(--accent-a))] hover:bg-[hsl(var(--accent-a))/0.9] text-white"
                  disabled={workshop.spotsRemaining === 0}
                >
                  {workshop.spotsRemaining === 0 ? 'Fully Booked' : 'Register Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {weekWorkshops.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-semibold text-[hsl(var(--text-strong))] mb-2">
                No workshops this week
              </h3>
              <p className="text-lg text-[hsl(var(--text-muted))]">
                Try navigating to a different week or adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}