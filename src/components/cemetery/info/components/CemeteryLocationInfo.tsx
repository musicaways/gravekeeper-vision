
import React from "react";
import { MapPin, Calendar, Map } from "lucide-react";
import { formatDate } from "@/lib/utils";

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
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div>
          <h4 className="font-medium">Indirizzo</h4>
          <p className="text-sm md:text-base">{cemetery.Indirizzo || "Non disponibile"}</p>
          <p className="text-sm md:text-base">
            {cemetery.city && cemetery.postal_code ? `${cemetery.city}, ${cemetery.postal_code}` : ""}
          </p>
          <p className="text-sm md:text-base">
            {cemetery.state && cemetery.country ? `${cemetery.state}, ${cemetery.country}` : ""}
          </p>
        </div>
      </div>

      {cemetery.established_date && (
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium">Data di fondazione</h4>
            <p className="text-sm md:text-base">{formatDate(cemetery.established_date, "long")}</p>
          </div>
        </div>
      )}

      {cemetery.total_area_sqm && (
        <div className="flex items-start gap-3">
          <Map className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium">Area totale</h4>
            <p className="text-sm md:text-base">{cemetery.total_area_sqm} m²</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CemeteryLocationInfo;
