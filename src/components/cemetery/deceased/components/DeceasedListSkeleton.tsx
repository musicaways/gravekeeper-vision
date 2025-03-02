
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const DeceasedListSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors duration-200">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-3 w-[60%]" />
          </div>
        </div>
      ))}
    </div>
  );
};
