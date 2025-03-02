
import React from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { WorkOrder, WorkOrderPriority } from "@/types";

interface CalendarDayContentProps {
  date: Date;
  orderCount: number;
  orders: WorkOrder[];
  children: React.ReactNode;
}

// Function to get color based on priority
const getPriorityColor = (priority: WorkOrderPriority): string => {
  switch (priority) {
    case "urgent":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-blue-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-primary";
  }
};

export function CalendarDayContent({ date, orderCount, orders, children }: CalendarDayContentProps) {
  // Group orders by priority
  const ordersByPriority = orders.reduce<Record<WorkOrderPriority, number>>((acc, order) => {
    acc[order.priority] = (acc[order.priority] || 0) + 1;
    return acc;
  }, {} as Record<WorkOrderPriority, number>);

  // Get priorities in descending order of importance
  const priorities: WorkOrderPriority[] = ["urgent", "high", "medium", "low"];
  const visiblePriorities = priorities.filter(p => ordersByPriority[p] > 0).slice(0, 3);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div>{children}</div>
      {orderCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute -bottom-1 right-0 left-0 flex justify-center">
                {visiblePriorities.map((priority, index) => (
                  <span 
                    key={priority} 
                    className={`${index > 0 ? "ml-0.5" : ""} flex h-1.5 w-1.5 rounded-full ${getPriorityColor(priority)}`}
                  ></span>
                ))}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {orderCount} work order{orderCount !== 1 ? 's' : ''}
              {visiblePriorities.length > 0 && (
                <div className="text-xs mt-1">
                  {visiblePriorities.map(priority => (
                    <div key={priority} className="flex items-center">
                      <span className={`inline-block h-1.5 w-1.5 rounded-full ${getPriorityColor(priority)} mr-1`}></span>
                      {ordersByPriority[priority]} {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
