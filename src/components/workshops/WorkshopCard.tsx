
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users, CheckCircle, Flame, Zap, UserCircle2 } from "lucide-react";
import { Workshop } from "@/types/workshop";
import { SeatsProgressBar } from "./SeatsProgressBar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WorkshopCardProps {
  workshop: Workshop;
  onSelect: (workshop: Workshop) => void;
}

export const WorkshopCard = ({ workshop, onSelect }: WorkshopCardProps) => {
  const totalSeats = 12;
  const isTrending = workshop.spotsRemaining <= 4;
  const isAlmostFull = workshop.spotsRemaining <= 2;

  const handleWaitlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Added to waitlist", {
      description: "We'll notify you if a spot becomes available"
    });
  };

  return (
    <Card
      className="p-6 hover:shadow-lg transition-all cursor-pointer animate-fade-up group bg-white relative"
      onClick={() => onSelect(workshop)}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-xl group-hover:text-primary transition-colors">
                {workshop.name}
              </h3>
              {isTrending && (
                <span className="flex items-center gap-1 text-orange-500 animate-fade-in">
                  <Flame className="h-4 w-4" />
                  Trending
                </span>
              )}
            </div>
            {isAlmostFull && (
              <div className="text-red-500 font-medium flex items-center gap-1 animate-fade-in">
                <Zap className="h-4 w-4" />
                Limited Spots Left!
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 leading-relaxed">
          {workshop.description}
        </p>

        <div className="flex items-center gap-2 text-gray-500">
          <UserCircle2 className="h-4 w-4" />
          <span>{workshop.instructor}</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Available Spots</span>
            <span className={cn(
              "font-medium",
              workshop.spotsRemaining <= 2 ? "text-red-500" : 
              workshop.spotsRemaining <= 4 ? "text-yellow-500" : 
              "text-green-500"
            )}>
              {workshop.spotsRemaining} / {totalSeats}
            </span>
          </div>
          <SeatsProgressBar 
            totalSeats={totalSeats} 
            spotsRemaining={workshop.spotsRemaining}
          />
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{workshop.time}</span>
          </div>
          {workshop.spotsRemaining > 0 ? (
            <Button 
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Register Now
            </Button>
          ) : (
            <Button 
              size="sm"
              variant="outline"
              onClick={handleWaitlist}
              className="opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              Join Waitlist
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
