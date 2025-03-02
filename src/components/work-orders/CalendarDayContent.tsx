
import React from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface CalendarDayContentProps {
  date: Date;
  orderCount: number;
  children: React.ReactNode;
}

export function CalendarDayContent({ date, orderCount, children }: CalendarDayContentProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div>{children}</div>
      {orderCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute -bottom-1 right-0 left-0 flex justify-center">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                {orderCount > 1 && (
                  <>
                    <span className="ml-0.5 flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                    {orderCount > 2 && (
                      <span className="ml-0.5 flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                    )}
                  </>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {orderCount} work order{orderCount !== 1 ? 's' : ''}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
