
import React from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export function DashboardHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-2 mt-2 md:mt-0">
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {format(new Date(), "EEEE d MMMM yyyy", { locale: it })}
        </Badge>
      </div>
    </div>
  );
}
