
import React from "react";
import { Check, X } from "lucide-react";

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
      <div className="flex items-start gap-3">
        {value ? 
          <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" /> : 
          <X className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
        }
        <div>
          <h4 className="font-medium">{label}</h4>
          <p className="text-sm md:text-base">{value ? 'Sì' : 'No'}</p>
        </div>
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
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Strutture e servizi</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {renderBooleanField("Ricevimento salme", cemetery.ricevimento_salme)}
        {renderBooleanField("Chiesa", cemetery.chiesa)}
        {renderBooleanField("Camera mortuaria", cemetery.camera_mortuaria)}
        {renderBooleanField("Cavalletti", cemetery.cavalletti)}
        {renderBooleanField("Impalcatura", cemetery.impalcatura)}
      </div>
    </div>
  );
};

export default CemeteryFacilities;
