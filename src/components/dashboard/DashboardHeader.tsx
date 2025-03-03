
import React from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { it } from "date-fns/locale";

export function DashboardHeader() {
  return (
    <div className="flex justify-end items-center mb-6">
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {format(new Date(), "EEEE d MMMM yyyy", { locale: it })}
        </Badge>
      </div>
    </div>
  );
}
