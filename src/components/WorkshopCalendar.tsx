
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addWeeks, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Mock workshops data
  const workshops: Workshop[] = [
    {
      id: "1",
      name: "MacBook Mastery 101",
      date: new Date(2024, 3, 15),
      time: "10:00 AM",
      description: "Learn essential macOS shortcuts & optimizations for power users",
      spotsRemaining: 8,
    },
    {
      id: "2",
      name: "iPhone Pro Tips",
      date: new Date(2024, 3, 15),
      time: "2:00 PM",
      description: "Optimize your iPhone for maximum efficiency & security",
      spotsRemaining: 6,
    },
    {
      id: "3",
      name: "Switching from Windows?",
      date: new Date(2024, 3, 16),
      time: "11:00 AM",
      description: "Making the transition to macOS smooth and painless",
      spotsRemaining: 10,
    },
    {
      id: "4",
      name: "Privacy & Security",
      date: new Date(2024, 3, 16),
      time: "3:00 PM",
      description: "Protect your data like a pro on all Apple devices",
      spotsRemaining: 7,
    },
    {
      id: "5",
      name: "Mastering iCloud",
      date: new Date(2024, 3, 17),
      time: "10:00 AM",
      description: "Sync, share, and back up with confidence across devices",
      spotsRemaining: 5,
    },
    {
      id: "6",
      name: "Business Productivity",
      date: new Date(2024, 3, 17),
      time: "2:00 PM",
      description: "Essential Apple tools and workflows for business success",
      spotsRemaining: 4,
    },
    {
      id: "7",
      name: "Pro Apps Training",
      date: new Date(2024, 3, 18),
      time: "11:00 AM",
      description: "Get started with Final Cut Pro & Logic Pro",
      spotsRemaining: 6,
    },
    {
      id: "8",
      name: "Apple Ecosystem",
      date: new Date(2024, 3, 18),
      time: "3:00 PM",
      description: "Seamlessly integrate Mac, iPad, iPhone & Watch",
      spotsRemaining: 8,
    },
    {
      id: "9",
      name: "Maintenance Mastery",
      date: new Date(2024, 3, 19),
      time: "10:00 AM",
      description: "Keep your Apple devices running like new",
      spotsRemaining: 9,
    },
  ];

  const workshopsForDate = (date: Date) =>
    workshops.filter(
      (w) => format(w.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

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

  console.log('Current week workshops:', currentWeekWorkshops); // Debug log

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-medium tracking-tight">
          Select Your Workshop
        </h1>
        <p className="text-lg text-gray-600">
          Browse available workshops for the week of {format(currentWeek, "MMMM d, yyyy")}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-xl border shadow-sm bg-white"
          />
          
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => navigateWeek('prev')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Week
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateWeek('next')}
              className="flex items-center gap-2"
            >
              Next Week
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {currentWeekWorkshops.map((workshop) => (
            <Card
              key={workshop.id}
              className="p-4 hover:shadow-lg transition-all cursor-pointer animate-slide-in group"
              onClick={() => onSelect(workshop)}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                    {workshop.name}
                  </h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    workshop.spotsRemaining <= 5 
                      ? 'bg-red-100 text-red-600 animate-pulse' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {workshop.spotsRemaining} spots left
                  </span>
                </div>
                <p className="text-sm text-gray-600">{workshop.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {format(workshop.date, "MMMM d, yyyy")} at {workshop.time}
                  </div>
                  <Button 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {currentWeekWorkshops.length === 0 && (
            <div className="text-center py-8 text-gray-500 animate-fade-up">
              No workshops available this week
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
