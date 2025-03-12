
import { useState, useEffect } from "react";
import { fetchDefuntiForLoculi } from "@/services/loculi";
import { DefuntoType } from "@/components/block/loculi/types";

interface UseDefuntiForLoculiProps {
  loculiIds: (string | number)[];
  skip: boolean;
}

interface UseDefuntiForLoculiResult {
  defunti: DefuntoType[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook for fetching defunti (deceased) data for a set of loculi
 */
export function useDefuntiForLoculi({ 
  loculiIds, 
  skip = false 
}: UseDefuntiForLoculiProps): UseDefuntiForLoculiResult {
  const [defunti, setDefunti] = useState<DefuntoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDefunti = async () => {
      // Skip if requested or if there are no loculi IDs
      if (skip || loculiIds.length === 0) {
        return;
      }

      try {
        setLoading(true);
        const defuntiResult = await fetchDefuntiForLoculi(loculiIds);
        
        if (defuntiResult.error) {
          throw new Error(defuntiResult.error);
        }
        
        setDefunti(defuntiResult.data);
      } catch (err: any) {
        console.error("Errore nel caricamento dei defunti:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDefunti();
  }, [loculiIds, skip]);

  return { defunti, loading, error };
}
