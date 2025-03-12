
import React from "react";
import { Cross } from "lucide-react";
import { Link } from "react-router-dom";

interface CemeteryInfoProps {
  cimitero_nome: string | null;
  cimiteroId?: number | null;
}

const CemeteryInfo: React.FC<CemeteryInfoProps> = ({ 
  cimitero_nome,
  cimiteroId
}) => {
  return (
    <div className="p-3 hover:bg-muted/50 transition-colors">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Cimitero</p>
      {cimitero_nome ? (
        <div className="flex items-start gap-1">
          <Cross className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
          {cimiteroId ? (
            <Link 
              to={`/cemetery/${cimiteroId}`} 
              className="text-sm font-medium text-foreground hover:underline truncate block"
            >
              {cimitero_nome}
            </Link>
          ) : (
            <span className="text-sm font-medium text-foreground truncate block">
              {cimitero_nome}
            </span>
          )}
        </div>
      ) : (
        <p className="text-sm font-medium truncate">N/A</p>
      )}
    </div>
  );
};

export default CemeteryInfo;
