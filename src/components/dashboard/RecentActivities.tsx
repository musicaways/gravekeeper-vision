
import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  getWorkOrderStatusColor, 
  getWorkOrderStatusIcon, 
  getWorkOrderTypeLabel 
} from "@/lib/work-order-utils";

interface WorkOrder {
  id: string;
  status: string;
  order_type: string;
  description: string;
  created_at: string;
  priority: string;
}

interface RecentActivitiesProps {
  workOrders: WorkOrder[];
}

export function RecentActivities({ workOrders }: RecentActivitiesProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {workOrders.length > 0 ? (
            workOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`mt-0.5 rounded-full p-1.5 ${getWorkOrderStatusColor(order.status as any)}`}>
                      {getWorkOrderStatusIcon(order.status as any)}
                    </div>
                    <div>
                      <p className="font-medium">{getWorkOrderTypeLabel(order.order_type)}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {order.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(order.created_at), "d MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      order.priority === 'high' ? "destructive" : 
                      order.priority === 'medium' ? "outline" : 
                      "secondary"
                    }
                  >
                    {order.priority}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No recent activities
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-3">
        <Link to="/work-orders" className="w-full">
          <Button variant="ghost" size="sm" className="w-full">
            View All Activities
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
