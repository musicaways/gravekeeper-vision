
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
    <div className="w-full py-4">
      <h3 className="text-base font-medium mb-3 text-foreground">Informazioni sulla posizione</h3>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
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
          <div className="flex items-start gap-4">
            <Calendar className="h-5 w-5 text-primary mt-1 shrink-0" />
            <div>
              <h4 className="font-medium text-sm mb-1">Data di fondazione</h4>
              <p className="text-sm text-muted-foreground">{formatDate(cemetery.established_date, "long")}</p>
            </div>
          </div>
        )}

        {cemetery.total_area_sqm && (
          <div className="flex items-start gap-4">
            <Map className="h-5 w-5 text-primary mt-1 shrink-0" />
            <div>
              <h4 className="font-medium text-sm mb-1">Area totale</h4>
              <p className="text-sm text-muted-foreground">{cemetery.total_area_sqm.toLocaleString()} m²</p>
            </div>
          </div>
        )}
      </div>
      <Separator className="mt-4 bg-slate-200" />
    </div>
  );
};

export default CemeteryLocationInfo;
