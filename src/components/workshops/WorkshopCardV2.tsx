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
      className="wk-card p-5 cursor-pointer group relative transition-all duration-150 ease-[var(--ease-ios)] hover:-translate-y-[1px] active:scale-[.99] hover:shadow-md motion-reduce:transition-none motion-reduce:transform-none h-full flex flex-col rounded-2xl"
      onClick={handleCardClick}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Meta row */}
      <div className="text-[12px] text-[hsl(var(--text-muted))] mb-2">
        {format(workshop.date, "EEE, MMM d")} • {workshop.time} • {workshop.skillLevel} • {workshop.category}
      </div>

      {/* Title */}
      <h3 className="font-medium text-xl text-[hsl(var(--text-strong))] leading-tight mb-2">
        {workshop.name}
      </h3>

      {/* Description */}
      <p className="text-[hsl(var(--text-muted))] leading-relaxed text-sm line-clamp-3 mb-4">
        {workshop.description}
      </p>

      {/* Capacity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
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
      <div className="mt-auto pt-4 border-t border-[hsl(var(--border))] flex justify-end">
        {workshop.spotsRemaining > 0 ? (
          <Button
            variant="ios"
            size="sm"
            className="min-w-[120px]"
            onClick={handleRegister}
            aria-label="Register for this workshop"
          >
            Register
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="min-w-[120px]"
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
