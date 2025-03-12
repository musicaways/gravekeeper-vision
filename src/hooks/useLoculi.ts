import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loculo } from "@/components/block/loculi/types";
import { fetchLoculiData, searchLoculi, fetchDefuntiForLoculi } from "@/services/loculi";

interface UseLoculiProps {
  blockId: string;
  searchTerm?: string;
}

interface UseLoculiResult {
  loculi: Loculo[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook per gestire i loculi
 */
export function useLoculi({ blockId, searchTerm = "" }: UseLoculiProps): UseLoculiResult {
  const [loculi, setLoculi] = useState<Loculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const loculiIds = loculiResult.data.map(l => l.id);
        const defuntiResult = await fetchDefuntiForLoculi(loculiIds);

        const loculiWithDefunti = loculiResult.data.map(loculo => ({
          ...loculo,
          Defunti: defuntiResult.data.filter(d => 
            d.IdLoculo === loculo.id || d.id_loculo === loculo.id.toString()
          )
        }));
        
        setLoculi(loculiWithDefunti);
        
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

  return { loculi, loading, error };
}
