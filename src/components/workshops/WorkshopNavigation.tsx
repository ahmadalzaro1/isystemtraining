
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface WorkshopNavigationProps {
  currentWeek: Date;
  onNavigate: (direction: 'next' | 'prev') => void;
}

export const WorkshopNavigation = ({ currentWeek, onNavigate }: WorkshopNavigationProps) => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-medium tracking-tight text-primary">
        Available Workshops
      </h1>
      <p className="text-xl text-gray-600">
        Week of {format(currentWeek, "MMMM d, yyyy")}
      </p>
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => onNavigate('prev')}
          className="flex items-center gap-2 hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous Week
        </Button>
        <Button
          variant="outline"
          onClick={() => onNavigate('next')}
          className="flex items-center gap-2 hover:bg-gray-50"
        >
          Next Week
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
