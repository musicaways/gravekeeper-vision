
import React from "react";
import { MapPin, Calendar, Map } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
    <div className="w-full">
      <div className="flex items-center mb-3">
        <MapPin className="h-5 w-5 text-primary mr-2.5" />
        <h3 className="text-base font-medium text-foreground">Informazioni sulla posizione</h3>
      </div>
      
      <div className="pl-7 pr-1 space-y-4 mb-4">
        <div>
          <h4 className="font-medium text-sm mb-1.5">Indirizzo</h4>
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

        {cemetery.established_date && (
          <div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-1.5" />
              <h4 className="font-medium text-sm mb-0">Data di fondazione</h4>
            </div>
            <p className="text-sm text-muted-foreground mt-1 pl-5.5">{formatDate(cemetery.established_date, "long")}</p>
          </div>
        )}

        {cemetery.total_area_sqm && (
          <div>
            <div className="flex items-center">
              <Map className="h-4 w-4 text-muted-foreground mr-1.5" />
              <h4 className="font-medium text-sm mb-0">Area totale</h4>
            </div>
            <p className="text-sm text-muted-foreground mt-1 pl-5.5">{cemetery.total_area_sqm.toLocaleString()} m²</p>
          </div>
        )}
      </div>
      
      <Separator className="mb-4" />
    </div>
  );
};

export default CemeteryLocationInfo;
