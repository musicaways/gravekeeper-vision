
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

// Function to get text color based on priority for better tooltip visibility
const getPriorityTextColor = (priority: WorkOrderPriority): string => {
  switch (priority) {
    case "urgent":
      return "text-red-600 font-medium";
    case "high":
      return "text-orange-600 font-medium";
    case "medium":
      return "text-blue-600 font-medium";
    case "low":
      return "text-green-600 font-medium";
    default:
      return "text-primary font-medium";
  }
};

export function CalendarDayContent({ date, orderCount, orders, children }: CalendarDayContentProps) {
  // Group orders by priority
  const ordersByPriority = orders.reduce<Record<WorkOrderPriority, number>>((acc, order) => {
    acc[order.priority] = (acc[order.priority] || 0) + 1;
    return acc;
  }, {} as Record<WorkOrderPriority, number>);

  // Group orders by type
  const ordersByType = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.order_type] = (acc[order.order_type] || 0) + 1;
    return acc;
  }, {});

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
            <TooltipContent className="w-64">
              <div className="font-medium mb-1.5">{orderCount} work order{orderCount !== 1 ? 's' : ''}</div>
              
              {visiblePriorities.length > 0 && (
                <div className="text-xs space-y-1">
                  <div className="text-xs font-medium mb-1">By Priority:</div>
                  {visiblePriorities.map(priority => (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className={`inline-block h-2 w-2 rounded-full ${getPriorityColor(priority)} mr-1.5`}></span>
                        <span className={getPriorityTextColor(priority)}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </span>
                      </div>
                      <span>{ordersByPriority[priority]}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {Object.keys(ordersByType).length > 0 && (
                <div className="text-xs mt-2 pt-2 border-t border-border">
                  <div className="text-xs font-medium mb-1">By Type:</div>
                  {Object.entries(ordersByType).map(([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span>{type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}</span>
                      <span>{count}</span>
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
