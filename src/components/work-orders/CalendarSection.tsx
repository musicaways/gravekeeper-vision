
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDayContent } from "./CalendarDayContent";
import { WorkOrder } from "@/types";
import { isSameDay, parseISO } from "date-fns";

interface CalendarSectionProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  workOrderDates: Date[];
  filteredWorkOrders: WorkOrder[];
  setCurrentMonth: (date: Date) => void;
}

export function CalendarSection({
  selectedDate,
  setSelectedDate,
  workOrderDates,
  filteredWorkOrders,
  setCurrentMonth,
}: CalendarSectionProps) {
  // Get work orders for a specific day
  const getOrdersForDay = (day: Date) => {
    return filteredWorkOrders.filter(
      (order) =>
        (order.requested_date && isSameDay(parseISO(order.requested_date), day)) ||
        (order.scheduled_date && isSameDay(parseISO(order.scheduled_date), day))
    );
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Work Order Calendar</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            workOrder: (date) => workOrderDates.some((d) => isSameDay(d, date)),
          }}
          modifiersClassNames={{
            workOrder: "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
          }}
          onMonthChange={setCurrentMonth}
          components={{
            DayContent: ({ date, ...props }) => {
              const orders = getOrdersForDay(date);
              return (
                <CalendarDayContent
                  date={date}
                  orderCount={orders.length}
                  orders={orders}
                >
                  {date.getDate()}
                </CalendarDayContent>
              );
            },
          }}
        />
      </CardContent>
    </Card>
  );
}
