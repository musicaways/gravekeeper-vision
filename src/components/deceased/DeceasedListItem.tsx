
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { UserRound, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border border-border/40">
      <div 
        className={`px-5 py-3 ${textColor}`}
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
            <h3 className="text-xl font-semibold leading-tight">
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
      
      <CardContent className="p-4 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Cimitero</p>
            <p className="font-medium">{deceased.cimitero_nome || 'N/A'}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Ubicazione</p>
            <p className="font-medium">
              {deceased.settore_nome && deceased.blocco_nome ? 
                `${deceased.settore_nome} - ${deceased.blocco_nome}` : 
                (deceased.settore_nome || deceased.blocco_nome || 'N/A')}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Loculo</p>
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
      </CardContent>
    </Card>
  );
};

export default DeceasedListItem;
