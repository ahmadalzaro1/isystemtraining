
import { Clock, CheckCircle, Flame, Zap, UserCircle2 } from "lucide-react";
import { Workshop } from "@/types/workshop";
import { SeatsProgressBar } from "./SeatsProgressBar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IOSCard } from "@/components/ui/ios-card";

interface WorkshopCardProps {
  workshop: Workshop;
  onSelect: (workshop: Workshop) => void;
  index: number;
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

  const handleRegister = (e: React.MouseEvent) => {
    
    e.stopPropagation();
    onSelect(workshop);
  };

  const handleCardClick = () => {
    
    onSelect(workshop);
  };

  return (
    <div
      className="wk-card p-5 cursor-pointer group relative transition-[transform,box-shadow] duration-300 hover:-translate-y-[2px] hover:shadow-lg w-[90vw] max-w-[420px] mx-auto"
      onClick={handleCardClick}
      style={{ 
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="space-y-4 transition-transform duration-300">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-xl text-[hsl(var(--text-strong))] transition-colors leading-tight">
                {workshop.name}
              </h3>
              <div className="flex items-center gap-2 text-[hsl(var(--text-muted))]">
                <UserCircle2 className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium">Instructor:</span>
                <span className="truncate">{workshop.instructor}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {isTrending && (
                <span className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                  <Flame className="h-4 w-4 animate-pulse" />
                  Trending
                </span>
              )}
              {isAlmostFull && (
                <span className="text-red-500 text-sm font-medium flex items-center gap-1">
                  <Zap className="h-4 w-4 animate-[pulse_2s_ease-in-out_infinite]" />
                  Limited!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[hsl(var(--text-muted))] leading-relaxed text-sm line-clamp-2">
          {workshop.description}
        </p>

        {/* Seats Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[hsl(var(--text-muted))]">Available Spots</span>
            <span className={cn(
              "font-medium",
              workshop.spotsRemaining <= 2 ? "text-red-500" : 
              workshop.spotsRemaining <= 4 ? "text-yellow-500" : 
              "text-green-500"
            )}>
              {workshop.spotsRemaining} / {totalSeats}
            </span>
          </div>
          <div className="wk-progress mt-3">
            <i style={{width: `${((totalSeats - workshop.spotsRemaining) / totalSeats) * 100}%`}}></i>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[hsl(var(--border))]">
          <div className="flex items-center gap-2 text-[hsl(var(--text-muted))]">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{workshop.time}</span>
          </div>
          
          {workshop.spotsRemaining > 0 ? (
            <button 
              className="wk-cta flex items-center gap-2 text-[hsl(var(--text-strong))]"
              onClick={handleRegister}
            >
              <CheckCircle className="h-4 w-4" />
              Register
            </button>
          ) : (
            <button 
              className="wk-cta text-[hsl(var(--text-muted))]"
              onClick={handleWaitlist}
            >
              Waitlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
