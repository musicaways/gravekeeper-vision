
import React from "react";
import { format } from "date-fns";
import { WorkOrder } from "@/types";
import { WorkOrderDayCard } from "./WorkOrderDayCard";
import { WorkOrderEmptyState } from "./WorkOrderEmptyState";

interface OrdersDisplaySectionProps {
  selectedDate: Date | undefined;
  ordersForSelectedDate: WorkOrder[];
  onOrderClick: (order: WorkOrder) => void;
}

export function OrdersDisplaySection({
  selectedDate,
  ordersForSelectedDate,
  onOrderClick,
}: OrdersDisplaySectionProps) {
  return (
    <div className="md:col-span-2">
      <h2 className="text-xl font-semibold mb-4">
        {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
      </h2>

      {ordersForSelectedDate.length === 0 ? (
        <WorkOrderEmptyState />
      ) : (
        <div className="space-y-4">
          {ordersForSelectedDate.map((order) => (
            <WorkOrderDayCard
              key={order.id}
              order={order}
              onClick={() => onOrderClick(order)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
