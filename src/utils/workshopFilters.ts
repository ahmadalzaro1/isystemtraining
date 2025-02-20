
import { Workshop, WorkshopFilters } from "@/types/workshop";
import { startOfWeek, endOfWeek } from "date-fns";

export const filterWorkshopsByWeek = (workshops: Workshop[], currentWeek: Date) => {
  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  
  return workshops.filter(workshop => {
    const workshopDate = workshop.date;
    return workshopDate >= weekStart && workshopDate <= weekEnd;
  });
};

export const filterWorkshopsByFilters = (workshops: Workshop[], filters: WorkshopFilters) => {
  return workshops.filter(workshop => {
    const matchesSearch = workshop.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      workshop.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesSkillLevel = filters.skillLevel === "All" || workshop.skillLevel === filters.skillLevel;
    const matchesCategory = filters.category === "All" || workshop.category === filters.category;

    return matchesSearch && matchesSkillLevel && matchesCategory;
  });
};
