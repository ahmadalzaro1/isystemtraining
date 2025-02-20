
import { format } from "date-fns";
import { Workshop } from "@/types/workshop";
import { WorkshopCard } from "./WorkshopCard";

interface WorkshopDayGroupProps {
  date: string;
  workshops: Workshop[];
  onSelect: (workshop: Workshop) => void;
}

export const WorkshopDayGroup = ({ date, workshops, onSelect }: WorkshopDayGroupProps) => {
  // Sort workshops by trending status and remaining spots
  const sortedWorkshops = [...workshops].sort((a, b) => {
    // First prioritize workshops with fewer spots
    return a.spotsRemaining - b.spotsRemaining;
  });

  return (
    <div className="space-y-4 animate-fade-up">
      <h2 className="text-2xl font-medium text-gray-800">
        {format(new Date(date), "EEEE, MMMM d")}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {sortedWorkshops.map((workshop, index) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            onSelect={onSelect}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
