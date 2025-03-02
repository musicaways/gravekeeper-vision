
import React from "react";
import { WorkOrder } from "@/types";
import { format } from "date-fns";
import { formatOrderType } from "@/lib/work-order-utils";
import { WorkOrderStatusBadge } from "./WorkOrderStatusBadge";
import { WorkOrderPriorityBadge } from "./WorkOrderPriorityBadge";
import { Clock, Users, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface WorkOrderDayCardProps {
  order: WorkOrder;
  onClick: () => void;
}

export function WorkOrderDayCard({ order, onClick }: WorkOrderDayCardProps) {
  return (
    <Card 
      key={order.id} 
      className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
      style={{ 
        borderLeftColor: order.status === 'pending' 
          ? '#FFC107' 
          : order.status === 'in_progress' 
          ? '#3B82F6'
          : order.status === 'completed'
          ? '#10B981'
          : '#EF4444'
      }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{formatOrderType(order.order_type)}</h3>
              <WorkOrderPriorityBadge priority={order.priority} />
            </div>
            <p className="text-sm text-muted-foreground">{order.order_number}</p>
            <p className="text-sm">{order.description}</p>
            
            <div className="pt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {order.scheduled_date 
                    ? format(new Date(order.scheduled_date), 'h:mm a') 
                    : 'Not scheduled'}
                </span>
              </div>
              {order.assigned_crew_id && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Crew #{order.assigned_crew_id}</span>
                </div>
              )}
              {order.related_entity_id && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{order.related_entity_type}: {order.related_entity_id}</span>
                </div>
              )}
            </div>
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
            
            <div className="text-muted-foreground flex items-center mt-1">
              <span className="text-xs mr-1">Details</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
