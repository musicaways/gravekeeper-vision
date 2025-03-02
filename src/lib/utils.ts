
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  Plot, NicheInfo, WorkOrderStatus, 
  WorkOrderPriority, WorkOrderType 
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | undefined, format: string = "long"): string {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  if (format === "long") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } else if (format === "short") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } else if (format === "iso") {
    return date.toISOString().split("T")[0];
  }
  
  return date.toLocaleDateString();
}

export function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return "";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

export function getPlotStatusClass(status: Plot["status"]): string {
  switch (status) {
    case "available":
      return "status-available";
    case "reserved":
      return "status-reserved";
    case "occupied":
      return "status-occupied";
    case "maintenance":
      return "status-maintenance";
    default:
      return "";
  }
}

export function getNicheColorFromStatus(status: NicheInfo["status"]): string {
  switch (status) {
    case "available":
      return "#10b981"; // success
    case "reserved":
      return "#f59e0b"; // warning
    case "occupied":
      return "#3b82f6"; // info
    case "maintenance":
      return "#ef4444"; // error
    default:
      return "#94a3b8"; // gray
  }
}

export function getWorkOrderStatusBadgeClass(status: WorkOrderStatus): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

export function getWorkOrderPriorityBadgeClass(priority: WorkOrderPriority): string {
  switch (priority) {
    case "low":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    case "medium":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "high":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "urgent":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

export function getWorkOrderTypeIcon(type: WorkOrderType): string {
  switch (type) {
    case "burial":
      return "shovel";
    case "maintenance":
      return "wrench";
    case "landscaping":
      return "flower";
    case "construction":
      return "hammer";
    case "cleaning":
      return "spray-can";
    default:
      return "clipboard-list";
  }
}

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function generateId(prefix: string = ""): string {
  const timestamp = new Date().getTime().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomChars}`;
}
