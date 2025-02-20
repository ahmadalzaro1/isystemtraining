
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addWeeks, startOfWeek, endOfWeek, addDays } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, Users, CheckCircle } from "lucide-react";

type Workshop = {
  id: string;
  name: string;
  date: Date;
  time: string;
  description: string;
  spotsRemaining: number;
};

interface WorkshopCalendarProps {
  onSelect: (workshop: Workshop) => void;
}

export const WorkshopCalendar = ({ onSelect }: WorkshopCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());

  // Get start of current week for reference
  const thisWeekStart = startOfWeek(new Date());

  // Mock workshops data with dates relative to current week
  const workshops: Workshop[] = [
    {
      id: "1",
      name: "MacBook Mastery 101",
      date: addDays(thisWeekStart, 1),
      time: "10:00 AM",
      description: "Learn essential macOS shortcuts & optimizations for power users",
      spotsRemaining: 8,
    },
    {
      id: "2",
      name: "iPhone Pro Tips",
      date: addDays(thisWeekStart, 1),
      time: "2:00 PM",
      description: "Optimize your iPhone for maximum efficiency & security",
      spotsRemaining: 6,
    },
    {
      id: "3",
      name: "Switching from Windows?",
      date: addDays(thisWeekStart, 2),
      time: "11:00 AM",
      description: "Making the transition to macOS smooth and painless",
      spotsRemaining: 10,
    },
    {
      id: "4",
      name: "Privacy & Security",
      date: addDays(thisWeekStart, 2),
      time: "3:00 PM",
      description: "Protect your data like a pro on all Apple devices",
      spotsRemaining: 7,
    },
    {
      id: "5",
      name: "Mastering iCloud",
      date: addDays(thisWeekStart, 3),
      time: "10:00 AM",
      description: "Sync, share, and back up with confidence across devices",
      spotsRemaining: 5,
    },
    {
      id: "6",
      name: "Business Productivity",
      date: addDays(thisWeekStart, 3),
      time: "2:00 PM",
      description: "Essential Apple tools and workflows for business success",
      spotsRemaining: 4,
    },
    {
      id: "7",
      name: "Pro Apps Training",
      date: addDays(thisWeekStart, 4),
      time: "11:00 AM",
      description: "Get started with Final Cut Pro & Logic Pro",
      spotsRemaining: 6,
    },
    {
      id: "8",
      name: "Apple Ecosystem",
      date: addDays(thisWeekStart, 4),
      time: "3:00 PM",
      description: "Seamlessly integrate Mac, iPad, iPhone & Watch",
      spotsRemaining: 8,
    },
    {
      id: "9",
      name: "Maintenance Mastery",
      date: addDays(thisWeekStart, 5),
      time: "10:00 AM",
      description: "Keep your Apple devices running like new",
      spotsRemaining: 9,
    },
  ];

  const navigateWeek = (direction: 'next' | 'prev') => {
    setCurrentWeek(prev => 
      direction === 'next' ? addWeeks(prev, 1) : addWeeks(prev, -1)
    );
  };

  const currentWeekWorkshops = workshops.filter(workshop => {
    const workshopDate = workshop.date;
    const weekStart = startOfWeek(currentWeek);
    const weekEnd = endOfWeek(currentWeek);
    return workshopDate >= weekStart && workshopDate <= weekEnd;
  });

  // Group workshops by date
  const workshopsByDate = currentWeekWorkshops.reduce((acc, workshop) => {
    const dateStr = format(workshop.date, "yyyy-MM-dd");
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(workshop);
    return acc;
  }, {} as Record<string, Workshop[]>);

  return (
    <div className="space-y-8 animate-fade-up">
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
            onClick={() => navigateWeek('prev')}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Week
          </Button>
          <Button
            variant="outline"
            onClick={() => navigateWeek('next')}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            Next Week
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(workshopsByDate).map(([dateStr, dayWorkshops]) => (
          <div key={dateStr} className="space-y-4">
            <h2 className="text-2xl font-medium text-gray-800">
              {format(new Date(dateStr), "EEEE, MMMM d")}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {dayWorkshops.map((workshop) => (
                <Card
                  key={workshop.id}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer animate-fade-up group bg-white"
                  onClick={() => onSelect(workshop)}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-xl group-hover:text-primary transition-colors">
                        {workshop.name}
                      </h3>
                      <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${
                        workshop.spotsRemaining <= 5 
                          ? 'bg-red-50 text-red-600 animate-pulse' 
                          : 'bg-green-50 text-green-600'
                      }`}>
                        <Users className="h-4 w-4" />
                        {workshop.spotsRemaining} spots
                      </span>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {workshop.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{workshop.time}</span>
                      </div>
                      <Button 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Register Now
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
        
        {currentWeekWorkshops.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg animate-fade-up">
            <p className="text-xl text-gray-500">
              No workshops available this week
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigateWeek('next')}
            >
              Check Next Week
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
