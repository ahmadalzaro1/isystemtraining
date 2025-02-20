
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
      <h1 className="text-[2rem] sm:text-[2.5rem] font-medium tracking-tight text-[#007AFF]">
        Available Workshops
      </h1>

      <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
        <div className="text-[#1D1D1F] text-center">
          <div className="text-lg text-gray-600 mb-2">Week of</div>
          <div className="text-[1.5rem] sm:text-[2rem] text-[#007AFF] font-medium">
            {format(currentWeek, "MMMM d")}
            <span className="mx-2 text-[#007AFF]">→</span>
            {format(nextWeek, "MMMM d, yyyy")}
          </div>
        </div>

        <div className="flex items-center justify-between w-full gap-4 mt-4">
          <Button
            variant="outline"
            onClick={() => onNavigate('prev')}
            className="flex-1 py-6 text-base hover:bg-gray-50 rounded-full border-2 border-gray-200"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous Week
          </Button>

          <Button
            variant="outline"
            onClick={() => onNavigate('next')}
            className="flex-1 py-6 text-base hover:bg-gray-50 rounded-full border-2 border-gray-200"
          >
            Next Week
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>

      <p className="text-gray-500 text-lg">
        Workshops available on Sundays, Tuesdays, and Thursdays
      </p>
    </div>
  );
};
