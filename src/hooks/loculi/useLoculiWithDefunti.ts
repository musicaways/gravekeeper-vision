
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
    if (defunti.length === 0) {
      return loculi;
    }
    
    return loculi.map(loculo => ({
      ...loculo,
      Defunti: defunti.filter(d => {
        // Handle both old and new ID formats
        const defuntoLoculoId = d.IdLoculo || d.id_loculo;
        const loculoId = loculo.id;
        
        return defuntoLoculoId == loculoId || // Use == for type coercion
               (typeof defuntoLoculoId === 'string' && defuntoLoculoId === loculoId.toString());
      })
    }));
  }, [loculi, defunti]);
}
