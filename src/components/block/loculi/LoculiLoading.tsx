
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const LoculiLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border rounded-md p-4">
          <Skeleton className="h-5 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
};
