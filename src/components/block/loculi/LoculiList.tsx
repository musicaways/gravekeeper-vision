
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Support both uppercase and lowercase field names
interface LoculoLowercase {
  id?: string;
  numero?: number;
  fila?: number;
  annotazioni?: string;
  id_blocco?: number;
  tipo_tomba?: number;
  defunti?: any[];
}

interface LoculoUppercase {
  Id?: number;
  Numero?: number;
  Fila?: number;
  Annotazioni?: string;
  IdBlocco?: number;
  TipoTomba?: number;
  Defunti?: any[];
}

type Loculo = LoculoLowercase | LoculoUppercase;

interface LoculiListProps {
  loculi: Loculo[];
  loading: boolean;
  error: string | null;
}

// Type guard functions to check which type we're dealing with
function isLoculoLowercase(loculo: Loculo): loculo is LoculoLowercase {
  return loculo && ('id' in loculo || 'numero' in loculo || 'fila' in loculo);
}

function isLoculoUppercase(loculo: Loculo): loculo is LoculoUppercase {
  return loculo && ('Id' in loculo || 'Numero' in loculo || 'Fila' in loculo);
}

export const LoculiList: React.FC<LoculiListProps> = ({ loculi, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-md p-4">
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!loculi || loculi.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Nessun loculo trovato</p>
      </div>
    );
  }

  const getNominativo = (defunto: any) => {
    return defunto.Nominativo || defunto.nominativo || "Nome non disponibile";
  };

  const getDefuntiCount = (loculo: Loculo) => {
    if (isLoculoUppercase(loculo) && loculo.Defunti && loculo.Defunti.length > 0) 
      return loculo.Defunti.length;
    if (isLoculoLowercase(loculo) && loculo.defunti && loculo.defunti.length > 0) 
      return loculo.defunti.length;
    return 0;
  };

  const getDefunti = (loculo: Loculo) => {
    if (isLoculoUppercase(loculo)) return loculo.Defunti || [];
    if (isLoculoLowercase(loculo)) return loculo.defunti || [];
    return [];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {loculi.map((loculo, index) => {
        const numero = isLoculoUppercase(loculo) ? loculo.Numero : loculo.numero;
        const fila = isLoculoUppercase(loculo) ? loculo.Fila : loculo.fila;
        const id = isLoculoUppercase(loculo) ? loculo.Id : loculo.id;
        const defunti = getDefunti(loculo);
        const defuntiCount = getDefuntiCount(loculo);
        
        return (
          <div key={id ?? index} className="border rounded-md hover:bg-accent/5 transition-colors">
            <div className="bg-primary/10 px-3 py-2 rounded-t-md border-b">
              <h3 className="font-medium text-base text-primary-dark">
                Numero {numero}, Fila {fila}
              </h3>
            </div>
            
            <div className="p-3">
              {defuntiCount > 0 ? (
                <div className="space-y-2">
                  {defunti.map((defunto: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{getNominativo(defunto)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Nessun defunto associato</p>
              )}
              
              <div className="mt-3 flex justify-end">
                <Badge variant="outline" className="ml-auto">
                  {defuntiCount} defunt{defuntiCount === 1 ? 'o' : 'i'}
                </Badge>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
