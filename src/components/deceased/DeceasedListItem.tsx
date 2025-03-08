
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { User } from "lucide-react";

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
  };
}

const DeceasedListItem: React.FC<DeceasedItemProps> = ({ deceased }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Data non disponibile";
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: it });
    } catch (error) {
      return "Data non valida";
    }
  };

  return (
    <div className="bg-card border rounded-md overflow-hidden hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold truncate">
            {deceased.nominativo}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <span className="font-medium">Cimitero:</span>
              <span>{deceased.cimitero_nome || 'N/A'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="font-medium">Settore:</span>
              <span>{deceased.settore_nome || 'N/A'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="font-medium">Blocco:</span>
              <span>{deceased.blocco_nome || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center ml-4">
          <div className="text-sm font-medium whitespace-nowrap">
            {deceased.loculo_numero && 
              `Loculo ${deceased.loculo_numero}${deceased.loculo_fila ? ` (Fila ${deceased.loculo_fila})` : ''}`
            }
          </div>
          <div className="text-xs text-muted-foreground">
            {deceased.data_decesso && formatDate(deceased.data_decesso)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeceasedListItem;
