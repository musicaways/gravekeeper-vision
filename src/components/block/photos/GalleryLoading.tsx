
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const GalleryLoading: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="w-full aspect-square rounded-md" />
      ))}
    </div>
  );
};

export default GalleryLoading;
