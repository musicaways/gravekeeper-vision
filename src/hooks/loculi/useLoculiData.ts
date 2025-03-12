
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loculo } from "@/components/block/loculi/types";
import { fetchLoculiData, searchLoculi } from "@/services/loculi";

interface UseLoculiDataProps {
  blockId: string;
  searchTerm?: string;
}

interface UseLoculiDataResult {
  loculi: Loculo[];
  loading: boolean;
  error: string | null;
  loculiIds: (string | number)[];
}

/**
 * Hook for fetching basic loculi data
 */
export function useLoculiData({ blockId, searchTerm = "" }: UseLoculiDataProps): UseLoculiDataResult {
  const [loculi, setLoculi] = useState<Loculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loculiIds, setLoculiIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    const fetchLoculi = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const numericBlockId = parseInt(blockId, 10);
        
        if (isNaN(numericBlockId)) {
          throw new Error("ID blocco non valido: deve essere un numero");
        }
        
        const loculiResult = searchTerm 
          ? await searchLoculi(numericBlockId, searchTerm)
          : await fetchLoculiData(numericBlockId);
        
        if (loculiResult.error) {
          throw new Error(loculiResult.error);
        }

        const ids = loculiResult.data.map(l => l.id);
        setLoculiIds(ids);
        setLoculi(loculiResult.data);
        
      } catch (err: any) {
        console.error("Errore nel caricamento dei loculi:", err);
        setError("Impossibile caricare i loculi. Riprova più tardi.");
        toast.error("Errore nel caricamento dei loculi: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoculi();
  }, [blockId, searchTerm]);

  return { loculi, loading, error, loculiIds };
}
