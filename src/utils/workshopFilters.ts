
import { Workshop, WorkshopFilters } from "@/types/workshop";
import { startOfWeek, endOfWeek, getDay } from "date-fns";

export const filterWorkshopsByWeek = (workshops: Workshop[], currentWeek: Date) => {
  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  
  return workshops.filter(workshop => {
    const workshopDate = new Date(workshop.date);
    const dayOfWeek = getDay(workshopDate);
    // Only show workshops on Sunday (0), Tuesday (2), and Thursday (4)
    const isValidDay = dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 4;
    return workshopDate >= weekStart && workshopDate <= weekEnd && isValidDay;
  });
};

export const filterWorkshopsByFilters = (workshops: Workshop[], filters: WorkshopFilters) => {
  return workshops.filter(workshop => {
    // Search filter
    const matchesSearch = 
      workshop.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      workshop.description.toLowerCase().includes(filters.search.toLowerCase());
    
    // Skill level filter
    const matchesSkillLevel = 
      filters.skillLevel === "All" || 
      workshop.skillLevel === filters.skillLevel;

    // Category filter
    const matchesCategory = 
      filters.category === "All" || 
      workshop.category === filters.category;

    // All conditions must be true for the workshop to be included
    return matchesSearch && matchesSkillLevel && matchesCategory;
  });
};
