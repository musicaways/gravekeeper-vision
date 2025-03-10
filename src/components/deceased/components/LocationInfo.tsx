
import React from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface LocationInfoProps {
  settore_nome: string | null;
  blocco_nome: string | null;
  bloccoId?: number | null;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ 
  settore_nome, 
  blocco_nome,
  bloccoId
}) => {
  return (
    <div className="p-3 hover:bg-muted/50 transition-colors">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Ubicazione</p>
      <div className="flex items-start gap-1">
        <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
        {settore_nome && blocco_nome ? (
          <Link 
            to={bloccoId ? `/block/${bloccoId}` : "#"}
            className="text-sm font-medium text-foreground hover:underline truncate block"
          >
            {settore_nome} - {blocco_nome}
          </Link>
        ) : settore_nome ? (
          <p className="text-sm font-medium truncate">{settore_nome}</p>
        ) : blocco_nome ? (
          <p className="text-sm font-medium truncate">{blocco_nome}</p>
        ) : (
          <p className="text-sm font-medium truncate">N/A</p>
        )}
      </div>
    </div>
  );
};

export default LocationInfo;
