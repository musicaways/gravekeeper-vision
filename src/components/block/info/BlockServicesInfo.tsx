
import React from "react";
import { Check, X, Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BlockServicesInfoProps {
  block: {
    Servizi?: {
      manutenzione?: boolean;
      pulizia_ordinaria?: boolean;
      illuminazione?: boolean;
      [key: string]: boolean | undefined;
    } | null;
  };
}

const BlockServicesInfo: React.FC<BlockServicesInfoProps> = ({ block }) => {
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

  const servizi = block.Servizi || {};
  const hasServizi = Object.keys(servizi).length > 0;

  if (!hasServizi) return null;

  return (
    <div className="w-full">
      <div className="flex items-center mb-3">
        <Building2 className="h-5 w-5 text-primary mr-2.5" />
        <h3 className="text-base font-medium text-foreground">Servizi del blocco</h3>
      </div>
      
      <div className="bg-muted/10 rounded-md mb-4">
        {renderBooleanField("Manutenzione", servizi.manutenzione)}
        {renderBooleanField("Pulizia ordinaria", servizi.pulizia_ordinaria)}
        {renderBooleanField("Illuminazione", servizi.illuminazione)}
        {Object.entries(servizi)
          .filter(([key]) => !['manutenzione', 'pulizia_ordinaria', 'illuminazione'].includes(key))
          .map(([key, value]) => renderBooleanField(key.replace(/_/g, ' '), value))}
      </div>
      
      <Separator className="mb-4" />
    </div>
  );
};

export default BlockServicesInfo;
