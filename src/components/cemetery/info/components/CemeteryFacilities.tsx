
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
      <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
        <div className="flex items-center">
          {value ? 
            <Check className="h-5 w-5 text-success mr-3 shrink-0" /> : 
            <X className="h-5 w-5 text-destructive mr-3 shrink-0" />
          }
          <p className="text-sm">{label}</p>
        </div>
        <span className="text-sm text-muted-foreground">
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
    <div className="w-full">
      <div className="flex items-center mb-3">
        <Building2 className="h-5 w-5 text-primary mr-2.5" />
        <h3 className="text-base font-medium text-foreground">Strutture e servizi</h3>
      </div>
      
      <div className="bg-muted/10 rounded-md mb-4">
        {renderBooleanField("Ricevimento salme", cemetery.ricevimento_salme)}
        {renderBooleanField("Chiesa", cemetery.chiesa)}
        {renderBooleanField("Camera mortuaria", cemetery.camera_mortuaria)}
        {renderBooleanField("Cavalletti", cemetery.cavalletti)}
        {renderBooleanField("Impalcatura", cemetery.impalcatura)}
      </div>
      
      <Separator className="mb-4" />
    </div>
  );
};

export default CemeteryFacilities;
