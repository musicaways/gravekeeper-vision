
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
          <div className="hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">{deceased.nominativo}</h3>
              <div className="ml-auto text-sm text-muted-foreground">
                {deceased.data_decesso && formatDate(deceased.data_decesso)}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
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
              
              <div className="flex items-center gap-1">
                <span className="font-medium">Loculo:</span>
                <span>
                  {deceased.loculo_numero ? 
                    `#${deceased.loculo_numero}${deceased.loculo_fila ? ` (Fila ${deceased.loculo_fila})` : ''}` : 
                    'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeceasedListItem;
