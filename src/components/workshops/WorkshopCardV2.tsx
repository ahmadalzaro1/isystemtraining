import React from "react";
import { format } from "date-fns";
import { Workshop } from "@/types/workshop";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface WorkshopCardV2Props {
  workshop: Workshop;
  onSelect: (workshop: Workshop) => void;
  index: number;
}

export const WorkshopCardV2 = ({ workshop, onSelect, index }: WorkshopCardV2Props) => {
  const totalSeats = 12;
  const percentFilled = ((totalSeats - workshop.spotsRemaining) / totalSeats) * 100;

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(workshop);
  };

  const handleWaitlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Added to waitlist", {
      description: "We'll notify you if a spot becomes available",
    });
  };

  const handleCardClick = () => {
    onSelect(workshop);
  };

  return (
    <div
      className="wk-card p-6 cursor-pointer group relative transition-all duration-150 ease-[var(--ease-ios)] hover:-translate-y-[1px] active:scale-[.99] hover:shadow-md motion-reduce:transition-none motion-reduce:transform-none h-full flex flex-col rounded-2xl"
      onClick={handleCardClick}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Meta row */}
      <div className="text-base text-[hsl(var(--text-muted))] mb-3">
        {format(workshop.date, "EEE, MMM d")} • {workshop.time} • {workshop.skillLevel} • {workshop.category}
      </div>

      {/* Title */}
      <h3 className="font-medium text-xl text-[hsl(var(--text-strong))] leading-tight mb-3">
        {workshop.name}
      </h3>

      {/* Description */}
      <p className="text-[hsl(var(--text-muted))] leading-relaxed text-base line-clamp-3 mb-5">
        {workshop.description}
      </p>

      {/* Capacity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-base">
          <span className="text-[hsl(var(--text-muted))]">Available spots</span>
          <span className="font-medium text-[hsl(var(--text-strong))]">
            {workshop.spotsRemaining} / {totalSeats}
          </span>
        </div>
        <div className="wk-progress mt-1">
          <i style={{ width: `${percentFilled}%` }}></i>
        </div>
      </div>

      {/* Footer - aligned action */}
      <div className="mt-auto pt-5 border-t border-[hsl(var(--border))] flex justify-end">
        {workshop.spotsRemaining > 0 ? (
          <Button
            variant="ios"
            size="default"
            className="min-w-[120px] w-full sm:w-auto"
            onClick={handleRegister}
            aria-label="Register for this workshop"
          >
            Register
          </Button>
        ) : (
          <Button
            variant="outline"
            size="default"
            className="min-w-[120px] w-full sm:w-auto"
            onClick={handleWaitlist}
            aria-label="Join the waitlist for this workshop"
          >
            Waitlist
          </Button>
        )}
      </div>
    </div>
  );
};
