
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface CemeteryHoursProps {
  operatingHours: Record<string, { open: string; close: string }> | undefined;
}

const CemeteryHours = ({ operatingHours }: CemeteryHoursProps) => {
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
      <div className="space-y-2">
        {daysOfWeek.map(day => (
          hours[day] ? (
            <div key={day} className="flex justify-between">
              <span className="font-medium">{dayNames[day]}:</span>
              <span>{hours[day].open} - {hours[day].close}</span>
            </div>
          ) : null
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Orari di apertura
        </CardTitle>
      </CardHeader>
      <CardContent>
        {operatingHours ? 
          formatOperatingHours(operatingHours) :
          <p className="text-muted-foreground text-center py-4">Orari non disponibili</p>
        }
      </CardContent>
    </Card>
  );
};

export default CemeteryHours;
