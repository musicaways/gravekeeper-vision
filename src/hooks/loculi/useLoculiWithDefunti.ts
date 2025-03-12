
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
      Defunti: defunti.filter(d => 
        d.IdLoculo === loculo.id || d.id_loculo === loculo.id.toString()
      )
    }));
  }, [loculi, defunti]);
}
