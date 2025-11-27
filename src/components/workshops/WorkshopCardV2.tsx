import React, { useState } from "react";
import { format } from "date-fns";
import { Workshop } from "@/types/workshop";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatTime } from "@/lib/utils";
import { shouldHideCapacity } from "@/utils/workshopUtils";
import { WaitlistDialog } from "./WaitlistDialog";

interface WorkshopCardV2Props {
  workshop: Workshop;
  onSelect: (workshop: Workshop) => void;
  index: number;
}

export const WorkshopCardV2 = ({ workshop, onSelect, index }: WorkshopCardV2Props) => {
  const navigate = useNavigate();
  const [showWaitlistDialog, setShowWaitlistDialog] = useState(false);
  console.log('WorkshopCardV2 workshop data:', workshop);

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/registration/${workshop.id}`);
  };

  const handleWaitlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWaitlistDialog(true);
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
      className="wk-card p-4 sm:p-6 lg:p-8 cursor-pointer group relative transition-all duration-150 ease-[var(--ease-ios)] hover:-translate-y-[1px] active:scale-[.99] hover:shadow-lg motion-reduce:transition-none motion-reduce:transform-none h-full flex flex-col rounded-xl sm:rounded-2xl bg-gradient-to-b from-[hsl(var(--surface))] to-[hsl(var(--surface-2))] shadow-md touch-manipulation"
      onClick={handleCardClick}
      style={{ animationDelay: `${index * 0.1}s` }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Meta row - Mobile optimized */}
      <div className="text-xs sm:text-sm text-[hsl(var(--text-muted))] mb-3 sm:mb-4 lg:mb-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
          <span className="font-medium">{format(workshop.date, "EEE, MMM d")}</span>
          <span className="hidden sm:inline">•</span>
          <span>{formatTime(workshop.time)}</span>
          <span className="hidden sm:inline">•</span>
          <span className="truncate">{workshop.location}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-1">
          <span className="inline-flex items-center px-2 py-1 text-xs bg-[hsl(var(--surface-2))] rounded-md">
            {workshop.skillLevel}
          </span>
          <span className="inline-flex items-center px-2 py-1 text-xs bg-[hsl(var(--surface-2))] rounded-md">
            {workshop.category}
          </span>
        </div>
      </div>

      {/* Title - Mobile optimized */}
      <h3 className="font-semibold text-lg sm:text-xl lg:text-2xl text-[hsl(var(--text-strong))] leading-tight mb-3 sm:mb-4 lg:mb-6 line-clamp-2">
        {workshop.name}
      </h3>

      {/* Description - Mobile optimized */}
      <p className="text-sm sm:text-base text-[hsl(var(--text-muted))] leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 lg:mb-10 flex-grow">
        {workshop.description}
      </p>

      {/* Capacity - Mobile optimized */}
      {!shouldHideCapacity(workshop.location) && (
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          <div className="flex items-center justify-between text-sm sm:text-base">
            <span className="text-[hsl(var(--text-muted))]">Available spots</span>
            <span className="font-medium text-[hsl(var(--text-strong))]">
              {workshop.registrationsCount} / {workshop.maxCapacity}
            </span>
          </div>
          <div className="w-full bg-[hsl(var(--surface-2))] rounded-full h-1.5 sm:h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[hsl(var(--accent-a))] to-[hsl(var(--accent-b))] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(0, Math.min(100, (workshop.registrationsCount / workshop.maxCapacity) * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer - Mobile optimized */}
      <div className="mt-4 sm:mt-6 lg:mt-auto lg:pt-10 lg:border-t lg:border-[hsl(var(--border))] flex justify-between items-center">
        {workshop.spotsRemaining > 0 ? (
          <Button
            variant="ios"
            size="default"
            className="w-full sm:min-w-[120px] sm:w-auto h-10 sm:h-auto text-sm sm:text-base touch-manipulation"
            onClick={handleRegister}
            aria-label={`Register for ${workshop.name}`}
          >
            Register
          </Button>
        ) : (
          <Button
            variant="outline"
            size="default"
            className="w-full sm:min-w-[120px] sm:w-auto h-10 sm:h-auto text-sm sm:text-base touch-manipulation"
            onClick={handleWaitlist}
            aria-label={`Join waitlist for ${workshop.name}`}
          >
            Waitlist
          </Button>
        )}
      </div>

      <WaitlistDialog
        workshop={workshop}
        open={showWaitlistDialog}
        onOpenChange={setShowWaitlistDialog}
      />
    </div>
  );
};
