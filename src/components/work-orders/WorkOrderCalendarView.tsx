
import React, { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { WorkOrder, WorkOrderStatus, WorkOrderType } from "@/types";
import { format, isSameDay, parseISO, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkOrderDayCard } from "./WorkOrderDayCard";
import { WorkOrderDetailDialog } from "./WorkOrderDetailDialog";
import { WorkOrderEmptyState } from "./WorkOrderEmptyState";
import { CalendarDayContent } from "./CalendarDayContent";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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
  
  // Filter work orders based on selected filters
  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter(order => {
      const matchesType = typeFilter.length === 0 || typeFilter.includes(order.order_type);
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(order.status);
      return matchesType && matchesStatus;
    });
  }, [workOrders, typeFilter, statusFilter]);
  
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
  
  // Get all dates that have work orders
  const workOrderDates = useMemo(() => {
    return filteredWorkOrders.reduce((dates: Date[], order) => {
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
  }, [filteredWorkOrders]);
  
  // Get work orders for the selected date
  const ordersForSelectedDate = useMemo(() => {
    return selectedDate 
      ? filteredWorkOrders.filter(order => 
          (order.requested_date && isSameDay(new Date(order.requested_date), selectedDate)) || 
          (order.scheduled_date && isSameDay(new Date(order.scheduled_date), selectedDate))
        )
      : [];
  }, [selectedDate, filteredWorkOrders]);

  // Get work orders for a specific day
  const getOrdersForDay = (day: Date) => {
    return filteredWorkOrders.filter(order => 
      (order.requested_date && isSameDay(parseISO(order.requested_date), day)) || 
      (order.scheduled_date && isSameDay(parseISO(order.scheduled_date), day))
    );
  };
  
  // Get the count of orders for each day in the current month
  const getDayOrderCount = (day: Date) => {
    return filteredWorkOrders.filter(order => 
      (order.requested_date && isSameDay(parseISO(order.requested_date), day)) || 
      (order.scheduled_date && isSameDay(parseISO(order.scheduled_date), day))
    ).length;
  };
  
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
  
  // Clear all filters
  const clearFilters = () => {
    setTypeFilter([]);
    setStatusFilter([]);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading work orders...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Filter by Type:</h3>
          <div className="flex flex-wrap gap-2">
            {orderTypes.map(type => (
              <Badge 
                key={type}
                variant={typeFilter.includes(type) ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => toggleTypeFilter(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Filter by Status:</h3>
          <div className="flex flex-wrap gap-2">
            {orderStatuses.map(status => (
              <Badge 
                key={status}
                variant={statusFilter.includes(status) ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => toggleStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
              </Badge>
            ))}
          </div>
        </div>
        
        {(typeFilter.length > 0 || statusFilter.length > 0) && (
          <div>
            <button 
              onClick={clearFilters}
              className="text-sm text-muted-foreground flex items-center hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" /> Clear filters
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                workOrder: (date) => 
                  workOrderDates.some(d => isSameDay(d, date))
              }}
              modifiersClassNames={{
                workOrder: "ring-2 ring-primary/50 ring-offset-2 ring-offset-background"
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
                }
              }}
            />
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </h2>
          
          {ordersForSelectedDate.length === 0 ? (
            <WorkOrderEmptyState />
          ) : (
            <div className="space-y-4">
              {ordersForSelectedDate.map(order => (
                <WorkOrderDayCard 
                  key={order.id} 
                  order={order} 
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          )}
        </div>

        <WorkOrderDetailDialog 
          workOrder={selectedOrder} 
          open={selectedOrder !== null} 
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      </div>
    </div>
  );
}
