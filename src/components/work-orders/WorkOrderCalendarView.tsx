
import React from "react";
import { Calendar } from "lucide-react";

export function WorkOrderCalendarView() {
  return (
    <div className="min-h-[500px] flex items-center justify-center">
      <div className="text-center p-8">
        <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">Calendar View</h3>
        <p className="text-muted-foreground">
          Calendar view is not implemented yet. Check back soon!
        </p>
      </div>
    </div>
  );
}
