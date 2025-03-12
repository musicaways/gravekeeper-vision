
import React from "react";
import { Layers } from "lucide-react";
import { Link } from "react-router-dom";

interface LoculoInfoProps {
  loculo_numero: number | null;
  loculo_fila: number | null;
  loculo_link: string;
}

const LoculoInfo: React.FC<LoculoInfoProps> = ({ 
  loculo_numero, 
  loculo_fila,
  loculo_link
}) => {
  console.log("LoculoInfo rendering:", { loculo_numero, loculo_fila, loculo_link });
  
  const hasLoculoInfo = loculo_numero !== null || loculo_fila !== null;
  // Check if the loculo_link is a valid URL that we can navigate to
  const isValidLink = loculo_link && loculo_link !== "#" && loculo_link !== "undefined" && loculo_link !== "null";

  return (
    <div className="p-3 hover:bg-muted/50 transition-colors mt-auto">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Loculo</p>
      {hasLoculoInfo ? (
        <div className="flex items-start gap-1">
          <Layers className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
          {isValidLink ? (
            <Link 
              to={loculo_link} 
              className="text-sm font-medium text-foreground hover:underline truncate block"
            >
              {loculo_numero && loculo_fila 
                ? `Numero ${loculo_numero}, Fila ${loculo_fila}`
                : loculo_numero
                  ? `Numero ${loculo_numero}`
                  : `Fila ${loculo_fila}`
              }
            </Link>
          ) : (
            <span className="text-sm font-medium truncate">
              {loculo_numero && loculo_fila 
                ? `Numero ${loculo_numero}, Fila ${loculo_fila}`
                : loculo_numero
                  ? `Numero ${loculo_numero}`
                  : `Fila ${loculo_fila}`
              }
            </span>
          )}
        </div>
      ) : (
        <p className="text-sm font-medium truncate">N/A</p>
      )}
    </div>
  );
};

export default LoculoInfo;
