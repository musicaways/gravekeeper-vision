
import React from "react";
import { format } from "date-fns";
import { Clock, Workflow, Check, Users, Building } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
                    <div className={`mt-0.5 rounded-full p-1.5 ${getWorkOrderStatusColor(order.status)}`}>
                      {getWorkOrderStatusIcon(order.status)}
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

// Helper functions for work order displays
function getWorkOrderStatusColor(status: string) {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-600';
    case 'in_progress': return 'bg-blue-100 text-blue-600';
    case 'completed': return 'bg-green-100 text-green-600';
    case 'cancelled': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
}

function getWorkOrderStatusIcon(status: string) {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'in_progress': return <Workflow className="h-4 w-4" />;
    case 'completed': return <Check className="h-4 w-4" />;
    case 'cancelled': return <Users className="h-4 w-4" />;
    default: return <Building className="h-4 w-4" />;
  }
}

function getWorkOrderTypeLabel(type: string) {
  switch (type) {
    case 'maintenance': return 'Maintenance';
    case 'burial': return 'Burial Service';
    case 'landscaping': return 'Landscaping';
    case 'cleaning': return 'Cleaning';
    case 'construction': return 'Construction';
    default: return 'Other Work';
  }
}
