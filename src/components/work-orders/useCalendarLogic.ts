
import { useMemo } from "react";
import { WorkOrder } from "@/types";
import { isSameDay } from "date-fns";

export function useCalendarLogic(workOrders: WorkOrder[] = []) {
  // Helper to get dates with work orders
  const getWorkOrderDates = (filteredOrders: WorkOrder[]) => {
    return filteredOrders.reduce((dates: Date[], order) => {
      if (order.requested_date) {
        const date = new Date(order.requested_date);
        if (!dates.some(d => isSameDay(d, date))) {
          dates.push(date);
        }
      }
      
      if (order.scheduled_date) {
        const date = new Date(order.scheduled_date);
        if (!dates.some(d => isSameDay(d, date))) {
          dates.push(date);
        }
      }
      
      return dates;
    }, []);
  };
  
  // Helper to get orders for a selected date
  const getOrdersForDate = (filteredOrders: WorkOrder[], selectedDate: Date | undefined) => {
    return selectedDate 
      ? filteredOrders.filter(order => 
          (order.requested_date && isSameDay(new Date(order.requested_date), selectedDate)) || 
          (order.scheduled_date && isSameDay(new Date(order.scheduled_date), selectedDate))
        )
      : [];
  };
  
  return {
    getWorkOrderDates,
    getOrdersForDate
  };
}
