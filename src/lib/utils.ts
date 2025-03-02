
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  Plot, NicheInfo
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

export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function generateId(prefix: string = ""): string {
  const timestamp = new Date().getTime().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomChars}`;
}
