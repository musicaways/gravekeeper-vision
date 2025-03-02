
import { WorkOrderPriority, WorkOrderStatus, WorkOrderType } from "@/types";
import { Clock, Workflow, Check, Users, Building } from "lucide-react";

// Format work order status (e.g., "in_progress" -> "In Progress")
export function formatStatus(status: WorkOrderStatus): string {
  switch(status) {
    case 'in_progress':
      return 'In Progress';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

// Format work order type (e.g., "maintenance" -> "Maintenance")
export function formatOrderType(type: WorkOrderType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

// Get detailed work order type label
export function getWorkOrderTypeLabel(type: string): string {
  switch (type) {
    case 'maintenance': return 'Maintenance';
    case 'burial': return 'Burial Service';
    case 'landscaping': return 'Landscaping';
    case 'cleaning': return 'Cleaning';
    case 'construction': return 'Construction';
    default: return 'Other Work';
  }
}

// Get status badge class for work orders
export function getWorkOrderStatusBadgeClass(status: WorkOrderStatus): string {
  switch(status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

// Get priority badge class for work orders
export function getWorkOrderPriorityBadgeClass(priority: WorkOrderPriority): string {
  switch(priority) {
    case 'low':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    case 'medium':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'high':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'urgent':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

// Get status color for work orders
export function getWorkOrderStatusColor(status: WorkOrderStatus): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-600';
    case 'in_progress': return 'bg-blue-100 text-blue-600';
    case 'completed': return 'bg-green-100 text-green-600';
    case 'cancelled': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-600';
  }
}

// Get status icon for work orders
export function getWorkOrderStatusIcon(status: WorkOrderStatus) {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'in_progress': return <Workflow className="h-4 w-4" />;
    case 'completed': return <Check className="h-4 w-4" />;
    case 'cancelled': return <Users className="h-4 w-4" />;
    default: return <Building className="h-4 w-4" />;
  }
}
