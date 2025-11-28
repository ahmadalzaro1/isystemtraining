
import { Clock, CheckCircle, Flame, Zap, UserCircle2 } from "lucide-react";
import { Workshop } from "@/types/workshop";
import { SeatsProgressBar } from "./SeatsProgressBar";
import { cn, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IOSCard } from "@/components/ui/ios-card";
import { useNavigate } from "react-router-dom";
import { shouldHideCapacity } from "@/utils/workshopUtils";
import { WaitlistDialog } from "./WaitlistDialog";
import { useState } from "react";

interface WorkshopCardProps {
  workshop: Workshop;
  onSelect: (workshop: Workshop) => void;
  index: number;
}

export const WorkshopCard = ({ workshop, onSelect, index }: WorkshopCardProps) => {
  const navigate = useNavigate();
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  const hideCapacity = shouldHideCapacity(workshop.location);
  const isTrending = !hideCapacity && workshop.spotsRemaining <= 4;
  const isAlmostFull = !hideCapacity && workshop.spotsRemaining <= 2;

  const handleWaitlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWaitlistDialog(true);
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/registration/${workshop.id}`);
  };

  const handleCardClick = () => {
    if (workshop.spotsRemaining > 0) {
      navigate(`/registration/${workshop.id}`);
    } else {
      setShowWaitlistDialog(true);
    }
  };

  return (
    <div
      className="wk-card p-[clamp(16px,4.5vw,24px)] cursor-pointer group relative transition-[transform,box-shadow] duration-300 hover:-translate-y-[2px] hover:shadow-lg h-full flex flex-col w-full min-w-0"
      onClick={handleCardClick}
      style={{ 
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="flex-1 flex flex-col transition-transform duration-300">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-[clamp(8px,2vw,12px)]">
            <div className="space-y-1 min-w-0 flex-1">
              <h3 className="font-medium text-[clamp(18px,3.5vw,24px)] text-[hsl(var(--text-strong))] transition-colors leading-tight">
                {workshop.name}
              </h3>
              <div className="flex items-center gap-2 text-[hsl(var(--text-muted))] text-[clamp(12px,2.5vw,14px)]">
                <UserCircle2 className="h-[clamp(14px,2.8vw,16px)] w-[clamp(14px,2.8vw,16px)] flex-shrink-0" />
                <span className="font-medium">Instructor:</span>
                <span className="truncate">{workshop.instructor}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {isTrending && (
                <span className="flex items-center gap-1 text-[hsl(var(--accent-a))] text-[clamp(12px,2.5vw,14px)] font-medium">
                  <Flame className="h-[clamp(14px,2.8vw,16px)] w-[clamp(14px,2.8vw,16px)] animate-pulse" />
                  Trending
                </span>
              )}
              {isAlmostFull && (
                <span className="text-[hsl(var(--accent-b))] text-[clamp(12px,2.5vw,14px)] font-medium flex items-center gap-1">
                  <Zap className="h-[clamp(14px,2.8vw,16px)] w-[clamp(14px,2.8vw,16px)] animate-[pulse_2s_ease-in-out_infinite]" />
                  Limited!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[hsl(var(--text-muted))] leading-relaxed text-[clamp(14px,2.9vw,16px)] line-clamp-2">
          {workshop.description}
        </p>

        {/* Seats Progress */}
        {!hideCapacity && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[clamp(12px,2.5vw,14px)]">
              <span className="text-[hsl(var(--text-muted))]">Available Spots</span>
              <span className="font-medium text-[hsl(var(--text-strong))]">
                {workshop.spotsRemaining} / {workshop.maxCapacity}
              </span>
            </div>
            <div className="wk-progress mt-3">
              <i style={{width: `${((workshop.maxCapacity - workshop.spotsRemaining) / workshop.maxCapacity) * 100}%`}}></i>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-[clamp(12px,3vw,16px)] border-t border-[hsl(var(--border))]">
          <div className="flex items-center gap-2 text-[hsl(var(--text-muted))]">
            <Clock className="h-[clamp(14px,2.8vw,16px)] w-[clamp(14px,2.8vw,16px)]" />
            <span className="text-[clamp(12px,2.5vw,14px)]">{formatTime(workshop.time)}</span>
          </div>
          
          {workshop.spotsRemaining > 0 ? (
            <button 
              className="wk-cta flex items-center gap-2 text-[hsl(var(--text-strong))] min-h-[44px] px-[clamp(12px,3vw,16px)]"
              onClick={handleRegister}
            >
              <CheckCircle className="h-[clamp(14px,2.8vw,16px)] w-[clamp(14px,2.8vw,16px)]" />
              <span className="text-[clamp(12px,2.5vw,14px)]">Register</span>
            </button>
          ) : (
            <button 
              className="wk-cta text-[hsl(var(--text-muted))] min-h-[44px] px-[clamp(12px,3vw,16px)] text-[clamp(12px,2.5vw,14px)]"
              onClick={handleWaitlist}
            >
              Waitlist
            </button>
          )}
        </div>
      </div>

      <WaitlistDialog
        workshop={workshop}
        open={showWaitlistDialog}
        onOpenChange={setShowWaitlistDialog}
      />
    </div>
  );
};
