
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import React from "react";

export interface CemeteryHoursProps {
  cemetery: any;
}

const CemeteryHours: React.FC<CemeteryHoursProps> = ({ cemetery }) => {
  const formatOperatingHours = (hours: Record<string, { open: string; close: string }> | undefined) => {
    if (!hours) return "Orari non disponibili";
    
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const dayNames = {
      "monday": "Lunedì",
      "tuesday": "Martedì",
      "wednesday": "Mercoledì",
      "thursday": "Giovedì",
      "friday": "Venerdì",
      "saturday": "Sabato",
      "sunday": "Domenica"
    };
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        {daysOfWeek.map(day => (
          hours[day] ? (
            <div key={day} className="flex justify-between py-1 border-b border-muted/60 last:border-0">
              <span className="font-medium text-sm md:text-base">{dayNames[day]}:</span>
              <span className="text-sm md:text-base">{hours[day].open} - {hours[day].close}</span>
            </div>
          ) : null
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Clock className="h-5 w-5" />
          Orari di apertura
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        {cemetery?.operating_hours ? 
          formatOperatingHours(cemetery.operating_hours) :
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm md:text-base">Orari non disponibili</p>
          </div>
        }
      </CardContent>
    </Card>
  );
};

export default CemeteryHours;
