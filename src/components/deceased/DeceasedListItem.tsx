
import { format, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import { User } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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

// Generate a gradient based on the deceased's ID for uniqueness
const getBackgroundGradient = (id: string) => {
  // Extract a number from the ID string to use for color selection
  const num = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10;
  
  // List of gradients to choose from
  const gradients = [
    "linear-gradient(90deg, hsla(16, 100%, 76%, 1) 0%, hsla(49, 100%, 81%, 1) 100%)",
    "linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)",
    "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)",
    "linear-gradient(90deg, hsla(39, 100%, 77%, 1) 0%, hsla(22, 90%, 57%, 1) 100%)",
    "linear-gradient(90deg, hsla(46, 73%, 75%, 1) 0%, hsla(176, 73%, 88%, 1) 100%)",
    "linear-gradient(90deg, hsla(59, 86%, 68%, 1) 0%, hsla(134, 36%, 53%, 1) 100%)",
    "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
    "linear-gradient(to top, #d299c2 0%, #fef9d7 100%)",
    "linear-gradient(to top, #e6b980 0%, #eacda3 100%)",
    "linear-gradient(to right, #ee9ca7, #ffdde1)"
  ];
  
  return gradients[num];
};

// Get contrasting text color (light or dark) based on background lightness
const getContrastColor = (id: string) => {
  // This is a simplified approach - for certain gradients, we'll use dark text
  const num = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10;
  const lightGradients = [0, 1, 4, 6, 7, 8, 9]; // Indices of light gradients that need dark text
  
  return lightGradients.includes(num) ? "text-gray-800" : "text-white";
};

const DeceasedListItem: React.FC<DeceasedItemProps> = ({ deceased }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Data non disponibile";
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: it });
    } catch (error) {
      return "Data non valida";
    }
  };

  const gradientStyle = getBackgroundGradient(deceased.id);
  const textColor = getContrastColor(deceased.id);

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md border border-border/40">
      <div 
        className={`h-16 flex items-center px-4 ${textColor}`}
        style={{ background: gradientStyle }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shrink-0">
            <User className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold leading-tight">
            {deceased.nominativo}
          </h3>
        </div>
      </div>
      
      <CardContent className="p-4">
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
        
        {deceased.data_decesso && (
          <div className="mt-4 pt-3 border-t">
            <p className="text-sm text-muted-foreground flex items-center justify-end">
              Data decesso: <span className="font-medium ml-1">{formatDate(deceased.data_decesso)}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeceasedListItem;
