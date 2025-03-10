
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DeceasedLoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-md">
          <Skeleton className="h-16 w-full rounded-t-md" />
          <div className="p-3">
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="p-3 border-t">
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="p-3 border-t">
            <Skeleton className="h-4 w-1/2 mb-1" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeceasedLoadingSkeleton;
