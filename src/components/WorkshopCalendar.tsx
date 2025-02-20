
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

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
  const [selectedDate, setSelectedDate] = useState<Date>();

  // Mock workshops data
  const workshops: Workshop[] = [
    {
      id: "1",
      name: "iOS Basics",
      date: new Date(2024, 3, 15),
      time: "10:00 AM",
      description: "Learn the fundamentals of iOS",
      spotsRemaining: 7,
    },
    {
      id: "2",
      name: "macOS Pro Tips",
      date: new Date(2024, 3, 16),
      time: "2:00 PM",
      description: "Advanced macOS features",
      spotsRemaining: 5,
    },
    {
      id: "3",
      name: "iCloud Mastery",
      date: new Date(2024, 3, 17),
      time: "11:00 AM",
      description: "Master iCloud integration",
      spotsRemaining: 3,
    },
  ];

  const workshopsForDate = (date: Date) =>
    workshops.filter(
      (w) => format(w.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-medium tracking-tight">
          Select Your Workshop
        </h1>
        <p className="text-lg text-gray-600">
          Choose a date to view available workshops
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-xl border shadow-sm bg-white"
        />
        
        <div className="space-y-4">
          {selectedDate &&
            workshopsForDate(selectedDate).map((workshop) => (
              <Card
                key={workshop.id}
                className="p-4 hover:shadow-lg transition-all cursor-pointer animate-slide-in"
                onClick={() => onSelect(workshop)}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{workshop.name}</h3>
                    <span className="text-success text-sm">
                      {workshop.spotsRemaining} spots left
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{workshop.description}</p>
                  <div className="text-sm text-gray-500">
                    {format(workshop.date, "MMMM d, yyyy")} at {workshop.time}
                  </div>
                </div>
              </Card>
            ))}
          
          {selectedDate && workshopsForDate(selectedDate).length === 0 && (
            <div className="text-center py-8 text-gray-500 animate-fade-up">
              No workshops available on this date
            </div>
          )}
          
          {!selectedDate && (
            <div className="text-center py-8 text-gray-500 animate-fade-up">
              Select a date to view available workshops
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
