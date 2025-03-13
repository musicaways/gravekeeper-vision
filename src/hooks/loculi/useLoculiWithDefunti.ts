
import { useMemo } from "react";
import { Loculo } from "@/components/block/loculi/types";

interface UseLoculiWithDefuntiProps {
  loculi: Loculo[];
  defunti: any[];
}

/**
 * Hook for combining loculi with their respective defunti
 */
export function useLoculiWithDefunti({ 
  loculi, 
  defunti 
}: UseLoculiWithDefuntiProps): Loculo[] {
  return useMemo(() => {
    if (!defunti || defunti.length === 0) {
      console.log("No defunti data to process");
      return loculi;
    }
    
    if (!loculi || loculi.length === 0) {
      console.log("No loculi data to process");
      return [];
    }
    
    console.log(`Processing ${defunti.length} defunti records for ${loculi.length} loculi`);
    
    return loculi.map(loculo => {
      // Find all defunti records that belong to this loculo
      const loculoDefunti = defunti.filter(defunto => {
        // Handle different ID formats (string or number)
        const defuntoLoculoId = defunto.IdLoculo || defunto.id_loculo;
        const loculoId = loculo.id;
        
        // For debugging
        if (defuntoLoculoId && (defuntoLoculoId == loculoId || 
            (typeof defuntoLoculoId === 'string' && defuntoLoculoId === loculoId.toString()))) {
          console.log(`Found defunto ${defunto.Nominativo || defunto.nominativo} for loculo ${loculoId}`);
        }
        
        // Check different ways the ID might match
        return defuntoLoculoId == loculoId || // Use == for type coercion
               (typeof defuntoLoculoId === 'string' && defuntoLoculoId === loculoId.toString()) ||
               (typeof loculoId === 'string' && loculoId === defuntoLoculoId.toString());
      });
      
      // Return loculo with associated defunti
      return {
        ...loculo,
        Defunti: loculoDefunti
      };
    });
  }, [loculi, defunti]);
}
