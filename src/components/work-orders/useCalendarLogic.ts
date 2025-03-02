
import { useMemo } from "react";
import { WorkOrder, WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "@/types";
import { isSameDay } from "date-fns";

export function useCalendarLogic(workOrders: WorkOrder[] = []) {
  // Get all unique work order types
  const orderTypes = useMemo(() => {
    const types = new Set<WorkOrderType>();
    workOrders.forEach(order => types.add(order.order_type));
    return Array.from(types);
  }, [workOrders]);
  
  // Get all unique work order statuses
  const orderStatuses = useMemo(() => {
    const statuses = new Set<WorkOrderStatus>();
    workOrders.forEach(order => statuses.add(order.status));
    return Array.from(statuses);
  }, [workOrders]);
  
  // Get all unique work order priorities
  const orderPriorities = useMemo(() => {
    const priorities = new Set<WorkOrderPriority>();
    workOrders.forEach(order => priorities.add(order.priority));
    return Array.from(priorities);
  }, [workOrders]);
  
  // Helper to filter work orders based on filters
  const filterWorkOrders = (
    orders: WorkOrder[],
    typeFilter: WorkOrderType[],
    statusFilter: WorkOrderStatus[],
    priorityFilter: WorkOrderPriority[]
  ) => {
    return orders.filter(order => {
      const matchesType = typeFilter.length === 0 || typeFilter.includes(order.order_type);
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(order.status);
      const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(order.priority);
      return matchesType && matchesStatus && matchesPriority;
    });
  };
  
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
    orderTypes,
    orderStatuses,
    orderPriorities,
    filterWorkOrders,
    getWorkOrderDates,
    getOrdersForDate
  };
}
