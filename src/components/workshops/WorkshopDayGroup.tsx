
import { format, isToday } from "date-fns";
import { Workshop } from "@/types/workshop";
import { WorkshopCard } from "./WorkshopCard";

interface WorkshopDayGroupProps {
  date: string;
  workshops: Workshop[];
  onSelect: (workshop: Workshop) => void;
}

export const WorkshopDayGroup = ({ date, workshops, onSelect }: WorkshopDayGroupProps) => {

  const dateObj = new Date(date);
  const today = isToday(dateObj);

  // Sort workshops by remaining spots
  const sortedWorkshops = [...workshops].sort((a, b) => {
    return a.spotsRemaining - b.spotsRemaining;
  });

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-medium text-[hsl(var(--text-strong))]">
          {format(new Date(date), "EEEE, MMMM d")}
        </h2>
        {today && (
          <span className="rounded-full bg-[hsl(var(--accent-a))/0.12] text-[hsl(var(--accent-a))] px-2 py-0.5 text-[12px]">
            Today
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedWorkshops.map((w) => (
          <span
            key={`${w.id}-chip`}
            className="rounded-pill px-2 py-0.5 border border-[hsl(var(--border))] text-[12px] text-muted-foreground"
          >
            {format(w.date, "HH:mm")} • {w.name}
          </span>
        ))}
      </div>
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
