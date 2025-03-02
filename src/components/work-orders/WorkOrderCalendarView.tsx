
import React, { useState, useMemo } from "react";
import { WorkOrder, WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "@/types";
import { startOfMonth } from "date-fns";
import { WorkOrderDetailDialog } from "./WorkOrderDetailDialog";
import { WorkOrderFilterPanel } from "./WorkOrderFilterPanel";
import { CalendarSection } from "./CalendarSection";
import { OrdersDisplaySection } from "./OrdersDisplaySection";
import { WorkOrderLoadingState } from "./WorkOrderLoadingState";
import { ActiveFiltersDisplay } from "./ActiveFiltersDisplay";
import { useCalendarLogic } from "./useCalendarLogic";

interface WorkOrderCalendarViewProps {
  workOrders?: WorkOrder[];
  isLoading?: boolean;
}

export function WorkOrderCalendarView({ workOrders = [], isLoading = false }: WorkOrderCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [typeFilter, setTypeFilter] = useState<WorkOrderType[]>([]);
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const {
    orderTypes,
    orderStatuses,
    orderPriorities,
    filterWorkOrders,
    getWorkOrderDates,
    getOrdersForDate
  } = useCalendarLogic(workOrders);
  
  // Filter work orders based on selected filters
  const filteredWorkOrders = useMemo(() => {
    return filterWorkOrders(workOrders, typeFilter, statusFilter, priorityFilter);
  }, [workOrders, typeFilter, statusFilter, priorityFilter, filterWorkOrders]);
  
  // Get all dates that have work orders
  const workOrderDates = useMemo(() => {
    return getWorkOrderDates(filteredWorkOrders);
  }, [filteredWorkOrders, getWorkOrderDates]);
  
  // Get work orders for the selected date
  const ordersForSelectedDate = useMemo(() => {
    return getOrdersForDate(filteredWorkOrders, selectedDate);
  }, [selectedDate, filteredWorkOrders, getOrdersForDate]);
  
  // Toggle type filter
  const toggleTypeFilter = (type: WorkOrderType) => {
    setTypeFilter(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };
  
  // Toggle status filter
  const toggleStatusFilter = (status: WorkOrderStatus) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };
  
  // Toggle priority filter
  const togglePriorityFilter = (priority: WorkOrderPriority) => {
    setPriorityFilter(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority) 
        : [...prev, priority]
    );
  };
  
  // Remove a single type filter
  const removeTypeFilter = (type: WorkOrderType) => {
    setTypeFilter(prev => prev.filter(t => t !== type));
  };
  
  // Remove a single status filter
  const removeStatusFilter = (status: WorkOrderStatus) => {
    setStatusFilter(prev => prev.filter(s => s !== status));
  };
  
  // Remove a single priority filter
  const removePriorityFilter = (priority: WorkOrderPriority) => {
    setPriorityFilter(prev => prev.filter(p => p !== priority));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setTypeFilter([]);
    setStatusFilter([]);
    setPriorityFilter([]);
  };
  
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
