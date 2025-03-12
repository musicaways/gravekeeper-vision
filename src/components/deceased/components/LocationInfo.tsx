
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
  const decodedSettoreName = decodeText(settore_nome);
  const decodedBloccoName = decodeText(blocco_nome);

  return (
    <div className="p-3 hover:bg-muted/50 transition-colors">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Ubicazione</p>
      <div className="flex items-start gap-1">
        <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
        {decodedSettoreName && decodedBloccoName ? (
          <Link 
            to={bloccoId ? `/block/${bloccoId}` : "#"}
            className="text-sm font-medium text-foreground hover:underline truncate block"
          >
            {decodedSettoreName} - {decodedBloccoName}
          </Link>
        ) : decodedSettoreName ? (
          <p className="text-sm font-medium truncate">{decodedSettoreName}</p>
        ) : decodedBloccoName ? (
          <p className="text-sm font-medium truncate">{decodedBloccoName}</p>
        ) : (
          <p className="text-sm font-medium truncate">N/A</p>
        )}
      </div>
    </div>
  );
};

export default LocationInfo;
