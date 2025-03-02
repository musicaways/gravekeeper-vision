
import React from "react";
import { CalendarIcon } from "lucide-react";

export function WorkOrderEmptyState() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
      <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">No work orders</h3>
      <p className="mt-1 text-sm text-gray-500">
        No work orders scheduled or requested for this date.
      </p>
    </div>
  );
}
