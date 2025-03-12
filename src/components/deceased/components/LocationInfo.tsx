
import React from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { decodeText } from "@/utils/textFormatters";

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
  console.log("LocationInfo rendering:", { settore_nome, blocco_nome, bloccoId });
  
  const decodedSettoreName = decodeText(settore_nome);
  const decodedBloccoName = decodeText(blocco_nome);
  
  // Verificare se l'ID è valido e non è null o undefined
  const hasValidId = Boolean(
    typeof bloccoId === 'number' && 
    !isNaN(bloccoId) && 
    bloccoId > 0
  );
  
  console.log("LocationInfo - Has valid ID:", hasValidId);

  return (
    <div className="p-3 hover:bg-muted/50 transition-colors">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Ubicazione</p>
      <div className="flex items-start gap-1">
        <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
        {decodedSettoreName && decodedBloccoName ? (
          hasValidId ? (
            <Link 
              to={`/block/${bloccoId}`}
              className="text-sm font-medium text-foreground hover:underline truncate block"
            >
              {decodedSettoreName} - {decodedBloccoName}
            </Link>
          ) : (
            <span className="text-sm font-medium truncate">{decodedSettoreName} - {decodedBloccoName}</span>
          )
        ) : decodedSettoreName ? (
          <span className="text-sm font-medium truncate">{decodedSettoreName}</span>
        ) : decodedBloccoName ? (
          <span className="text-sm font-medium truncate">{decodedBloccoName}</span>
        ) : (
          <span className="text-sm font-medium truncate">N/A</span>
        )}
      </div>
    </div>
  );
};

export default LocationInfo;
