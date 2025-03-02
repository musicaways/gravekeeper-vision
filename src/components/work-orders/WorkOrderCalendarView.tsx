
import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { WorkOrder } from "@/types";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkOrderStatusBadge } from "./WorkOrderStatusBadge";
import { formatOrderType } from "@/lib/work-order-utils";

interface WorkOrderCalendarViewProps {
  workOrders?: WorkOrder[];
  isLoading?: boolean;
}

export function WorkOrderCalendarView({ workOrders = [], isLoading = false }: WorkOrderCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get all dates that have work orders
  const workOrderDates = workOrders.reduce((dates: Date[], order) => {
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
  
  // Get work orders for the selected date
  const ordersForSelectedDate = selectedDate 
    ? workOrders.filter(order => 
        (order.requested_date && isSameDay(new Date(order.requested_date), selectedDate)) || 
        (order.scheduled_date && isSameDay(new Date(order.scheduled_date), selectedDate))
      )
    : [];
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
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
              workOrder: "bg-primary/10 font-bold text-primary"
            }}
          />
        </CardContent>
      </Card>
      
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">
          {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
        </h2>
        
        {ordersForSelectedDate.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No work orders</h3>
            <p className="mt-1 text-sm text-gray-500">
              No work orders scheduled or requested for this date.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {ordersForSelectedDate.map(order => (
              <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{formatOrderType(order.order_type)}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{order.order_number}</p>
                      <p className="text-sm">{order.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <WorkOrderStatusBadge status={order.status} />
                      
                      {order.requested_date && (
                        <Badge variant="outline" className="text-xs">
                          Requested: {format(new Date(order.requested_date), 'MMM dd')}
                        </Badge>
                      )}
                      
                      {order.scheduled_date && (
                        <Badge variant="secondary" className="text-xs">
                          Scheduled: {format(new Date(order.scheduled_date), 'MMM dd')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
