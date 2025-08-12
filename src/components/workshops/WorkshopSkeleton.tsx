import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const WorkshopSkeleton: React.FC = () => {
  return (
    <div className="wk-card p-5 h-full flex flex-col">
      {/* Meta row */}
      <Skeleton className="h-3 w-2/3 mb-3" />

      {/* Title */}
      <Skeleton className="h-5 w-3/4 mb-2" />

      {/* Description */}
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-4" />

      {/* Capacity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-1 w-full" />
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-[hsl(var(--border))] flex justify-end">
        <Skeleton className="h-9 w-[120px] rounded-md" />
      </div>
    </div>
  );
};
