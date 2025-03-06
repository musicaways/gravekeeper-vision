
import React from "react";
import { MapPin, Calendar, Map } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface CemeteryLocationInfoProps {
  cemetery: {
    Indirizzo?: string;
    city?: string;
    postal_code?: string;
    state?: string;
    country?: string;
    established_date?: string;
    total_area_sqm?: number;
  };
}

const CemeteryLocationInfo = ({ cemetery }: CemeteryLocationInfoProps) => {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-base font-medium mb-4 text-foreground">Informazioni sulla posizione</h3>
        <div className="space-y-6">
          <div className="flex items-start gap-4 bg-muted/30 p-4 rounded-md">
            <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
            <div>
              <h4 className="font-medium text-sm mb-1">Indirizzo</h4>
              <p className="text-sm text-muted-foreground">{cemetery.Indirizzo || "Non disponibile"}</p>
              {(cemetery.city || cemetery.postal_code) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {cemetery.city && cemetery.postal_code ? `${cemetery.city}, ${cemetery.postal_code}` : cemetery.city || cemetery.postal_code}
                </p>
              )}
              {(cemetery.state || cemetery.country) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {cemetery.state && cemetery.country ? `${cemetery.state}, ${cemetery.country}` : cemetery.state || cemetery.country}
                </p>
              )}
            </div>
          </div>

          {cemetery.established_date && (
            <div className="flex items-start gap-4 bg-muted/30 p-4 rounded-md">
              <Calendar className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-medium text-sm mb-1">Data di fondazione</h4>
                <p className="text-sm text-muted-foreground">{formatDate(cemetery.established_date, "long")}</p>
              </div>
            </div>
          )}

          {cemetery.total_area_sqm && (
            <div className="flex items-start gap-4 bg-muted/30 p-4 rounded-md">
              <Map className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-medium text-sm mb-1">Area totale</h4>
                <p className="text-sm text-muted-foreground">{cemetery.total_area_sqm.toLocaleString()} m²</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CemeteryLocationInfo;
