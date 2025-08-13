
import { format, isToday } from "date-fns";
import { Workshop } from "@/types/workshop";
import { WorkshopCardV2 } from "./WorkshopCardV2";

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
    <div id={`day-${date}`} className="space-y-6 md:space-y-8 animate-fade-up">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-medium text-[hsl(var(--text-strong))]">
          {format(new Date(date), "EEEE, MMMM d")}
        </h2>
        {today && (
          <span className="rounded-full bg-[hsl(var(--accent-a))/0.12] text-[hsl(var(--accent-a))] px-3 py-1 text-sm">
            Today
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-4">
        {sortedWorkshops.map((w) => (
          <span
            key={`${w.id}-chip`}
            className="rounded-pill px-3 py-1 border border-[hsl(var(--border))] text-sm text-muted-foreground"
          >
            {format(w.date, "HH:mm")} {w.name}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6 md:gap-8 min-w-0">
        {sortedWorkshops.map((workshop, index) => (
          <WorkshopCardV2
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
