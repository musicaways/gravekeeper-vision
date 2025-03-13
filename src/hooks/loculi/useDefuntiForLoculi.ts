
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
        console.log("Skipping defunti fetch due to skip flag or empty loculiIds");
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching defunti for ${loculiIds.length} loculi`);
        
        const defuntiResult = await fetchDefuntiForLoculi(loculiIds);
        
        if (defuntiResult.error) {
          throw new Error(defuntiResult.error);
        }
        
        console.log(`Fetched ${defuntiResult.data.length} defunti records`);
        
        // Ensure the data conforms to DefuntoType
        const normalizedDefunti: DefuntoType[] = defuntiResult.data.map((defunto: any) => {
          return {
            Id: defunto.Id,
            id: defunto.id,
            Nominativo: defunto.Nominativo,
            nominativo: defunto.nominativo,
            DataNascita: defunto.DataNascita,
            data_nascita: defunto.data_nascita,
            DataDecesso: defunto.DataDecesso,
            data_decesso: defunto.data_decesso,
            Sesso: defunto.Sesso,
            sesso: defunto.sesso,
            annotazioni: defunto.annotazioni,
            stato_defunto: defunto.stato_defunto || defunto.StatoDefunto,
            IdLoculo: defunto.IdLoculo,
            id_loculo: defunto.id_loculo
          };
        });
        
        console.log("Normalized defunti data:", normalizedDefunti);
        setDefunti(normalizedDefunti);
      } catch (err: any) {
        console.error("Error loading defunti:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDefunti();
  }, [loculiIds, skip]);

  return { defunti, loading, error };
}
