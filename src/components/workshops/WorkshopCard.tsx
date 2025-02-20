
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle, Flame, Zap, UserCircle2 } from "lucide-react";
import { Workshop } from "@/types/workshop";
import { SeatsProgressBar } from "./SeatsProgressBar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WorkshopCardProps {
  workshop: Workshop;
  onSelect: (workshop: Workshop) => void;
  index: number; // Add index prop for staggered animation
}

export const WorkshopCard = ({ workshop, onSelect, index }: WorkshopCardProps) => {
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
      className={cn(
        "p-6 hover:shadow-lg transition-all cursor-pointer group bg-white relative",
        "opacity-0 translate-y-4",
        "animate-[card-slide-up_0.5s_ease-out_forwards]"
      )}
      onClick={() => onSelect(workshop)}
      style={{ 
        animationDelay: `${index * 0.2}s`,
        transform: "perspective(1000px) translateZ(0)",
      }}
    >
      <div className="space-y-4 transition-transform duration-300 group-hover:scale-[1.02]">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-xl group-hover:text-primary transition-colors">
                {workshop.name}
              </h3>
              <div className="flex items-center gap-2 text-gray-600">
                <UserCircle2 className="h-4 w-4" />
                <span className="font-medium">Instructor:</span>
                <span>{workshop.instructor}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              {isTrending && (
                <span className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                  <Flame className="h-4 w-4 animate-pulse" />
                  Trending
                </span>
              )}
              {isAlmostFull && (
                <span className="text-red-500 text-sm font-medium flex items-center gap-1">
                  <Zap className="h-4 w-4 animate-[pulse_2s_ease-in-out_infinite]" />
                  Limited Spots!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {workshop.description}
        </p>

        {/* Seats Progress */}
        <div className="space-y-2">
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{workshop.time}</span>
          </div>
          
          {workshop.spotsRemaining > 0 ? (
            <Button 
              size="sm"
              className="animate-[pulse_2s_ease-in-out_infinite] flex items-center gap-2 hover:animate-none"
            >
              <CheckCircle className="h-4 w-4" />
              Register Now
            </Button>
          ) : (
            <Button 
              size="sm"
              variant="outline"
              onClick={handleWaitlist}
            >
              Join Waitlist
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
