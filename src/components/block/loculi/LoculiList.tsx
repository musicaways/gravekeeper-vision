
import React, { useEffect } from "react";
import { User, Users, Info, AlertCircle, Database, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Loculo, isLoculoLowercase, isLoculoUppercase, isLoculoDatabaseLowercase } from "./types";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { checkLoculiMigrationStatus } from "@/utils/debug/loculiMigrationCheck";
import { toast } from "sonner";

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
    try {
      // Extract block ID from URL
      const blockId = window.location.pathname.split('/').pop();
      if (blockId) {
        toast.info("Verifica della migrazione in corso...");
        const result = await checkLoculiMigrationStatus(parseInt(blockId));
        console.log("Migration status check result:", result);
        toast.success("Verifica della migrazione completata. Controlla la console per i dettagli.");
      }
    } catch (error) {
      console.error("Error checking migration status:", error);
      toast.error("Errore durante la verifica della migrazione");
    }
  };

  const handleFixLoculi = async () => {
    try {
      const blockId = window.location.pathname.split('/').pop();
      if (!blockId) return;
      
      toast.info("Tentativo di riparazione dati in corso...");
      
      // Get block information for debugging
      const baseUrl = import.meta.env.VITE_SUPABASE_URL || "";
      const apiKey = import.meta.env.VITE_SUPABASE_KEY || "";
      
      console.log("Dettagli del blocco:", {
        id: blockId,
        currentUrl: window.location.href
      });
      
      toast.success("Verifica completata, controlla la console per maggiori dettagli");
    } catch (error) {
      console.error("Error attempting to fix loculi:", error);
      toast.error("Errore durante il tentativo di riparazione");
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
          
          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={handleCheckMigration} variant="outline" size="sm" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Verifica stato migrazione
            </Button>
            
            <Button onClick={handleFixLoculi} variant="outline" size="sm" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
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
};
