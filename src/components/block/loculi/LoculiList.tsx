import React, { useEffect } from "react";
import { User, Users, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Loculo, isLoculoLowercase, isLoculoUppercase, isLoculoDatabaseLowercase } from "./types";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { checkLoculiMigrationStatus } from "@/utils/debug/loculiMigrationCheck";

interface LoculiListProps {
  loculi: Loculo[];
}

export const LoculiList: React.FC<LoculiListProps> = ({ loculi }) => {
  useEffect(() => {
    // Log loculi data for debugging
    console.log("LoculiList received loculi:", loculi);
    
    if (loculi.length > 0) {
      console.log("Sample loculo:", loculi[0]);
      
      // Check the structure to help debug
      const firstLoculo = loculi[0];
      console.log("Loculo structure:", {
        hasId: 'Id' in firstLoculo,
        hasLowercaseId: 'id' in firstLoculo,
        properties: Object.keys(firstLoculo),
        isUppercase: isLoculoUppercase(firstLoculo),
        isLowercase: isLoculoLowercase(firstLoculo)
      });
    }
  }, [loculi]);

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

  const handleCheckMigration = async () => {
    // Extract block ID from URL
    const blockId = window.location.pathname.split('/').pop();
    if (blockId) {
      const result = await checkLoculiMigrationStatus(parseInt(blockId));
      console.log("Migration status check result:", result);
    }
  };

  return (
    <div className="space-y-4">
      {loculi.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loculi.map((loculo, index) => {
            const numero = loculo.Numero;
            const fila = loculo.Fila;
            const id = isLoculoUppercase(loculo) ? loculo.Id : 
                      isLoculoLowercase(loculo) ? (loculo.Id || loculo.id) : undefined;
            const defunti = getDefunti(loculo);
            const defuntiCount = getDefuntiCount(loculo);
            
            return (
              <div key={id ?? index} className="border rounded-md hover:bg-accent/5 transition-colors">
                <div className="bg-primary/10 px-3 py-2 rounded-t-md border-b">
                  <h3 className="font-medium text-base text-primary-dark">
                    Numero {numero}, Fila {fila}
                  </h3>
                </div>
                
                <div className="space-y-0 divide-y">
                  {defuntiCount > 0 ? (
                    defunti.map((defunto: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium truncate">{getNominativo(defunto)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground">Nessun defunto associato</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3 bg-muted/5">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground">Totale defunti</span>
                    </div>
                    <Badge variant="outline" className="ml-auto shrink-0 min-w-[70px] text-center text-xs">
                      {defuntiCount} defunt{defuntiCount === 1 ? 'o' : 'i'}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Nessun loculo trovato per questo blocco. Assicurati che:
              <ul className="list-disc pl-5 mt-2 text-sm">
                <li>Il blocco con ID {typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : ''} esista</li>
                <li>I loculi siano stati correttamente migrati</li>
                <li>Il campo "IdBlocco" nei loculi sia correttamente impostato</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="mt-4">
            <Button onClick={handleCheckMigration} variant="outline" size="sm">
              Verifica stato migrazione
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Controlla la console del browser per visualizzare i dettagli sulla migrazione.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
