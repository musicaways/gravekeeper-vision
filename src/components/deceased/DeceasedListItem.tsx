
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { UserRound, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface DeceasedItemProps {
  deceased: {
    id: string;
    nominativo: string;
    data_decesso: string | null;
    cimitero_nome: string | null;
    settore_nome: string | null;
    blocco_nome: string | null;
    loculo_numero: number | null;
    loculo_fila: number | null;
    loculi?: {
      id: string;
      numero: number | null;
      fila: number | null;
      Blocco?: {
        Id: number;
        Nome: string | null;
        Settore?: {
          Id: number;
          Nome: string | null;
          Cimitero?: {
            Id: number;
            Nome: string | null;
          } | null;
        } | null;
      } | null;
    } | null;
  };
}

// Determine if the deceased is likely male or female based on name
const isFemale = (name: string): boolean => {
  const lowercaseName = name.toLowerCase();
  // Common Italian female name endings
  const femaleEndings = ['a', 'na', 'lla', 'etta', 'ina'];
  
  // Check for common Italian female name endings
  return femaleEndings.some(ending => {
    const nameOnly = lowercaseName.split(' ')[0]; // Get first name
    return nameOnly.endsWith(ending);
  });
};

const DeceasedListItem: React.FC<DeceasedItemProps> = ({ deceased }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Data non disponibile";
    try {
      return format(parseISO(dateString), "d MMM yyyy", { locale: it });
    } catch (error) {
      return "Data non valida";
    }
  };

  // Use a consistent color for all cards
  const backgroundColor = "#6E59A5"; // Dark purple
  const textColor = "text-white";

  return (
    <div className="border rounded-md hover:bg-accent/5 transition-colors">
      <div 
        className={`px-3 py-2 rounded-t-md border-b ${textColor}`}
        style={{ background: backgroundColor }}
      >
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shrink-0">
              {isFemale(deceased.nominativo) ? (
                <UserRound className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <h3 className="font-medium text-base text-primary-dark">
              {deceased.nominativo}
            </h3>
          </div>
          
          {deceased.data_decesso && (
            <p className="pl-13 ml-13 text-sm text-white/90">
              Dec. {formatDate(deceased.data_decesso)}
            </p>
          )}
        </div>
      </div>
      
      <div className="space-y-0 divide-y">
        <div className="p-3 hover:bg-muted/50 transition-colors">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Cimitero</p>
          {deceased.cimitero_nome ? (
            <Link 
              to={`/cemetery/${deceased.loculi?.Blocco?.Settore?.Cimitero?.Id}`} 
              className="text-sm font-medium text-primary hover:underline truncate block"
            >
              {deceased.cimitero_nome}
            </Link>
          ) : (
            <p className="text-sm font-medium truncate">N/A</p>
          )}
        </div>
        
        <div className="p-3 hover:bg-muted/50 transition-colors">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Ubicazione</p>
          {deceased.settore_nome && deceased.blocco_nome ? (
            <Link 
              to={`/block/${deceased.loculi?.Blocco?.Id}`}
              className="text-sm font-medium text-primary hover:underline truncate block"
            >
              {deceased.settore_nome} - {deceased.blocco_nome}
            </Link>
          ) : deceased.settore_nome ? (
            <p className="text-sm font-medium truncate">{deceased.settore_nome}</p>
          ) : deceased.blocco_nome ? (
            <p className="text-sm font-medium truncate">{deceased.blocco_nome}</p>
          ) : (
            <p className="text-sm font-medium truncate">N/A</p>
          )}
        </div>
        
        <div className="p-3 hover:bg-muted/50 transition-colors">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Loculo</p>
          <div className="flex flex-wrap gap-2">
            {deceased.loculo_numero && (
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                Numero {deceased.loculo_numero}
              </span>
            )}
            {deceased.loculo_fila && (
              <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-muted-foreground/20">
                Fila {deceased.loculo_fila}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeceasedListItem;
