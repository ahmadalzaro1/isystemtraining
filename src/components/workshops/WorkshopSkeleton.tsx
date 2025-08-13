import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const WorkshopSkeleton: React.FC = () => {
  return (
    <div className="wk-card p-12 h-full flex flex-col bg-gradient-to-b from-[hsl(var(--surface))] to-[hsl(var(--surface-2))] shadow-md">
      {/* Meta row */}
      <Skeleton className="h-4 w-2/3 mb-6" />

      {/* Title */}
      <Skeleton className="h-5 w-3/4 mb-6" />

      {/* Description */}
      <Skeleton className="h-5 w-full mb-4" />
      <Skeleton className="h-5 w-5/6 mb-10" />

      {/* Capacity */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-1 w-full" />
      </div>

      {/* Footer */}
      <div className="mt-auto pt-10 border-t border-[hsl(var(--border))] flex justify-end">
        <Skeleton className="h-10 w-full sm:w-[120px] rounded-md" />
      </div>
    </div>
  );
};
