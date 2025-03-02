
import React from "react";

export function WorkOrderLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="text-muted-foreground">Loading work orders...</p>
    </div>
  );
}
