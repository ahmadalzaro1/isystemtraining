
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

      <div className="relative px-12 py-6 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm">
        <div className="text-xl text-gray-600 font-medium">
          Week of {format(currentWeek, "MMMM d")}
          <span className="text-gray-400"> → </span>
          {format(nextWeek, "MMMM d, yyyy")}
        </div>
        
        <div className="absolute inset-y-0 left-0 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('prev')}
            className="h-full px-3 rounded-l-lg hover:bg-gray-50/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('next')}
            className="h-full px-3 rounded-r-lg hover:bg-gray-50/50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <p className="text-gray-500">
        Workshops available on Sundays, Tuesdays, and Thursdays
      </p>
    </div>
  );
};
