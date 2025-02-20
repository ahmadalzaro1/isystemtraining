
import { format } from "date-fns";
import { Workshop } from "@/types/workshop";
import { WorkshopCard } from "./WorkshopCard";

interface WorkshopDayGroupProps {
  date: string;
  workshops: Workshop[];
  onSelect: (workshop: Workshop) => void;
}

export const WorkshopDayGroup = ({ date, workshops, onSelect }: WorkshopDayGroupProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-medium text-gray-800">
        {format(new Date(date), "EEEE, MMMM d")}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {workshops.map((workshop) => (
          <WorkshopCard
            key={workshop.id}
            workshop={workshop}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};
