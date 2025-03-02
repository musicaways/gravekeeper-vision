
import React from "react";
import { WorkOrder } from "@/types";
import { format } from "date-fns";
import { formatOrderType } from "@/lib/work-order-utils";
import { WorkOrderPriorityBadge } from "./WorkOrderPriorityBadge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface WorkOrderCardProps {
  order: WorkOrder;
}

export function WorkOrderCard({ order }: WorkOrderCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{formatOrderType(order.order_type)}</CardTitle>
          <WorkOrderPriorityBadge priority={order.priority} />
        </div>
        <CardDescription className="text-xs">{order.order_number}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2">
        <p className="text-sm line-clamp-2">{order.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
        {order.requested_date && 
          <div>Requested: {format(new Date(order.requested_date), 'MMM dd, yyyy')}</div>
        }
      </CardFooter>
    </Card>
  );
}
