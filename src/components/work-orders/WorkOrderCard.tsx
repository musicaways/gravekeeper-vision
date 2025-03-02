
import React from 'react';
import { WorkOrder } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  getWorkOrderStatusBadgeClass, 
  getWorkOrderPriorityBadgeClass,
  formatDate,
  truncateText
} from '@/lib/utils';
import * as Icons from 'lucide-react';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onClick?: () => void;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ workOrder, onClick }) => {
  // Dynamically get the icon based on work order type
  const getIcon = (type: string) => {
    switch (type) {
      case 'burial':
        return <Icons.Shovel className="h-5 w-5" />;
      case 'maintenance':
        return <Icons.Wrench className="h-5 w-5" />;
      case 'landscaping':
        return <Icons.Flower className="h-5 w-5" />;
      case 'construction':
        return <Icons.Hammer className="h-5 w-5" />;
      case 'cleaning':
        return <Icons.Spray className="h-5 w-5" />;
      default:
        return <Icons.Clipboard className="h-5 w-5" />;
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow duration-300 hover:border-primary/40 cursor-pointer animate-scale-in"
      onClick={onClick}
    >
      <div className={`h-1 w-full ${getWorkOrderStatusBadgeClass(workOrder.status)}`} />
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              {getIcon(workOrder.order_type)}
            </div>
            <div>
              <h3 className="font-semibold">{workOrder.order_number}</h3>
              <p className="text-sm text-gray-500 capitalize">{workOrder.order_type.replace('_', ' ')}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <Badge className={getWorkOrderStatusBadgeClass(workOrder.status)}>
              {workOrder.status.replace('_', ' ')}
            </Badge>
            <Badge className={getWorkOrderPriorityBadgeClass(workOrder.priority)}>
              {workOrder.priority}
            </Badge>
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-sm">{truncateText(workOrder.description, 100)}</p>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div>
            <p className="font-medium">Requested:</p>
            <p>{formatDate(workOrder.requested_date, 'short')}</p>
          </div>
          <div>
            <p className="font-medium">Scheduled:</p>
            <p>{workOrder.scheduled_date ? formatDate(workOrder.scheduled_date, 'short') : 'Not scheduled'}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 bg-gray-50 dark:bg-gray-800 flex justify-between">
        <Button variant="outline" size="sm" className="text-xs h-8">
          <Icons.ExternalLink className="h-3.5 w-3.5 mr-1" />
          Details
        </Button>
        
        {workOrder.status === 'pending' && (
          <Button size="sm" className="text-xs h-8">
            <Icons.Play className="h-3.5 w-3.5 mr-1" />
            Start Work
          </Button>
        )}
        
        {workOrder.status === 'in_progress' && (
          <Button size="sm" variant="success" className="text-xs h-8 bg-success text-white hover:bg-success/90">
            <Icons.CheckCircle className="h-3.5 w-3.5 mr-1" />
            Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default WorkOrderCard;
