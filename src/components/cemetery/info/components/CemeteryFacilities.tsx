
import React from "react";
import { Check, X, Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CemeteryFacilitiesProps {
  cemetery: {
    ricevimento_salme?: boolean | null;
    chiesa?: boolean | null;
    camera_mortuaria?: boolean | null;
    cavalletti?: boolean | null;
    impalcatura?: boolean | null;
  };
}

const CemeteryFacilities = ({ cemetery }: CemeteryFacilitiesProps) => {
  const renderBooleanField = (label: string, value: boolean | null | undefined) => {
    if (value === null || value === undefined) return null;
    
    return (
      <div className="flex items-center gap-3 py-2">
        {value ? 
          <Check className="h-5 w-5 text-success shrink-0" /> : 
          <X className="h-5 w-5 text-destructive shrink-0" />
        }
        <div className="flex-1">
          <p className="text-sm">{label}</p>
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {value ? 'Disponibile' : 'Non disponibile'}
        </span>
      </div>
    );
  };

  const hasFacilities = cemetery.ricevimento_salme !== null || 
                       cemetery.chiesa !== null || 
                       cemetery.camera_mortuaria !== null || 
                       cemetery.cavalletti !== null || 
                       cemetery.impalcatura !== null;

  if (!hasFacilities) return null;

  return (
    <div className="w-full py-4">
      <h3 className="text-base font-medium mb-3 flex items-center gap-2 text-foreground">
        <Building2 className="h-5 w-5 text-primary" />
        Strutture e servizi
      </h3>
      <div className="space-y-1 divide-y divide-slate-200">
        {renderBooleanField("Ricevimento salme", cemetery.ricevimento_salme)}
        {renderBooleanField("Chiesa", cemetery.chiesa)}
        {renderBooleanField("Camera mortuaria", cemetery.camera_mortuaria)}
        {renderBooleanField("Cavalletti", cemetery.cavalletti)}
        {renderBooleanField("Impalcatura", cemetery.impalcatura)}
      </div>
      <Separator className="mt-4 bg-slate-200" />
    </div>
  );
};

export default CemeteryFacilities;
