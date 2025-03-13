
import React, { useEffect } from "react";
import { User, Users, AlertCircle, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Loculo, getDefuntiCount, getDefunti, getNominativo } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkBloccoRelationship } from "@/services/loculi";

interface LoculiListProps {
  loculi: Loculo[];
}

export const LoculiList: React.FC<LoculiListProps> = ({ loculi }) => {
  useEffect(() => {
    // Log loculi data for debugging
    console.log("LoculiList received loculi:", loculi);
    
    if (loculi.length > 0) {
      console.log("Example loculo:", loculi[0]);
      
      // Check structure for debugging
      const firstLoculo = loculi[0];
      console.log("Loculo structure:", {
        id: firstLoculo.id,
        properties: Object.keys(firstLoculo),
        defunti: firstLoculo.Defunti || 'No Defunti array',
        defuntiCount: getDefuntiCount(firstLoculo)
      });
    }
  }, [loculi]);

  const handleCheckMigration = async () => {
    try {
      // Extract block ID from URL
      const blockId = window.location.pathname.split('/').pop();
      if (blockId) {
        toast.info("Verifica della struttura dati in corso...");
        const numericBlockId = parseInt(blockId);
        
        // Now use checkBloccoRelationship from service
        const result = await checkBloccoRelationship(numericBlockId);
        console.log("Block-loculi relationship check result:", result);
        
        if (result.error) {
          toast.error("Errore durante la verifica: " + result.error);
        } else if (result.loculiCount === 0) {
          toast.warning(`Nessun loculo trovato per il blocco ${blockId}`);
        } else {
          toast.success(`Trovati ${result.loculiCount} loculi per il blocco ${blockId}`);
        }
      }
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error("Errore durante la verifica della struttura dati");
    }
  };

  return (
    <div className="space-y-4">
      {loculi.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {loculi.map((loculo, index) => {
            const numero = loculo.Numero;
            const fila = loculo.Fila;
            const id = loculo.id;
            const defunti = getDefunti(loculo);
            const defuntiCount = getDefuntiCount(loculo);
            
            return (
              <div key={id ?? index} className="border rounded-md hover:bg-accent/5 transition-colors shadow-sm">
                <div className="bg-primary/10 px-3 py-2 rounded-t-md border-b">
                  <h3 className="font-medium text-base text-primary-dark">
                    Numero {numero}, Fila {fila}
                  </h3>
                </div>
                
                <div className="space-y-0 divide-y">
                  {defuntiCount > 0 ? (
                    defunti.map((defunto, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium truncate">{getNominativo(defunto)}</span>
                        </div>
                        {(defunto.data_decesso || defunto.DataDecesso) && (
                          <span className="text-xs text-muted-foreground">
                            {(defunto.data_decesso || defunto.DataDecesso).toString().split('T')[0]}
                          </span>
                        )}
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
                <li>I loculi siano stati correttamente associati a questo blocco</li>
                <li>Il campo "IdBlocco" nei loculi sia correttamente impostato</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={handleCheckMigration} variant="outline" size="sm" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Verifica relazioni blocco-loculi
            </Button>
            
            <p className="text-xs text-muted-foreground mt-2">
              Controlla la console del browser per visualizzare i dettagli diagnostici.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
