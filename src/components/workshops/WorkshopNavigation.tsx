
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addWeeks } from "date-fns";

interface WorkshopNavigationProps {
  currentWeek: Date;
  onNavigate: (direction: 'next' | 'prev') => void;
}

export const WorkshopNavigation = ({ currentWeek, onNavigate }: WorkshopNavigationProps) => {
  const nextWeek = addWeeks(currentWeek, 1);

  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-medium tracking-tight text-primary">
        Available Workshops
      </h1>

      <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={() => onNavigate('prev')}
          className="flex items-center gap-2 px-4 py-6 text-base hover:bg-gray-50"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous Week
        </Button>

        <div className="text-xl text-gray-600 font-medium">
          <div className="mb-1">Week of</div>
          <div className="text-primary">
            {format(currentWeek, "MMMM d")}
            <span className="text-gray-400 mx-2">→</span>
            {format(nextWeek, "MMMM d, yyyy")}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => onNavigate('next')}
          className="flex items-center gap-2 px-4 py-6 text-base hover:bg-gray-50"
        >
          Next Week
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <p className="text-gray-500">
        Workshops available on Sundays, Tuesdays, and Thursdays
      </p>
    </div>
  );
};
