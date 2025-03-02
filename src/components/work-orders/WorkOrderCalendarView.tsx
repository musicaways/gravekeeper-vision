
import React, { useState, useMemo } from "react";
import { WorkOrder } from "@/types";
import { startOfMonth } from "date-fns";
import { WorkOrderDetailDialog } from "./WorkOrderDetailDialog";
import { WorkOrderFilterPanel } from "./WorkOrderFilterPanel";
import { CalendarSection } from "./CalendarSection";
import { OrdersDisplaySection } from "./OrdersDisplaySection";
import { WorkOrderLoadingState } from "./WorkOrderLoadingState";
import { ActiveFiltersDisplay } from "./ActiveFiltersDisplay";
import { useCalendarLogic } from "./useCalendarLogic";
import { useWorkOrderFilters } from "./useWorkOrderFilters";

interface WorkOrderCalendarViewProps {
  workOrders?: WorkOrder[];
  isLoading?: boolean;
}

export function WorkOrderCalendarView({ workOrders = [], isLoading = false }: WorkOrderCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Use our custom filter hook
  const {
    typeFilter,
    statusFilter,
    priorityFilter,
    orderTypes,
    orderStatuses,
    orderPriorities,
    toggleTypeFilter,
    toggleStatusFilter,
    togglePriorityFilter,
    removeTypeFilter,
    removeStatusFilter,
    removePriorityFilter,
    clearFilters,
    filteredWorkOrders
  } = useWorkOrderFilters(workOrders);

  const {
    getWorkOrderDates,
    getOrdersForDate
  } = useCalendarLogic(workOrders);
  
  // Get all dates that have work orders
  const workOrderDates = useMemo(() => {
    return getWorkOrderDates(filteredWorkOrders);
  }, [filteredWorkOrders, getWorkOrderDates]);
  
  // Get work orders for the selected date
  const ordersForSelectedDate = useMemo(() => {
    return getOrdersForDate(filteredWorkOrders, selectedDate);
  }, [selectedDate, filteredWorkOrders, getOrdersForDate]);
  
  // Toggle filter panel visibility
  const toggleFilterPanel = () => {
    setShowFilters(prev => !prev);
  };
  
  if (isLoading) {
    return <WorkOrderLoadingState />;
  }
  
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Filter Panel */}
      <WorkOrderFilterPanel
        isOpen={showFilters}
        onToggle={toggleFilterPanel}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        orderTypes={orderTypes}
        orderStatuses={orderStatuses}
        orderPriorities={orderPriorities}
        toggleTypeFilter={toggleTypeFilter}
        toggleStatusFilter={toggleStatusFilter}
        togglePriorityFilter={togglePriorityFilter}
        clearFilters={clearFilters}
      />
      
      {/* Active Filters Display */}
      <ActiveFiltersDisplay
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        removeTypeFilter={removeTypeFilter}
        removeStatusFilter={removeStatusFilter}
        removePriorityFilter={removePriorityFilter}
        clearFilters={clearFilters}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CalendarSection
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          workOrderDates={workOrderDates}
          filteredWorkOrders={filteredWorkOrders}
          setCurrentMonth={setCurrentMonth}
        />
        
        <OrdersDisplaySection
          selectedDate={selectedDate}
          ordersForSelectedDate={ordersForSelectedDate}
          onOrderClick={setSelectedOrder}
        />

        <WorkOrderDetailDialog 
          workOrder={selectedOrder} 
          open={selectedOrder !== null} 
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      </div>
    </div>
  );
}
