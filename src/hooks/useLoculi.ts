
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loculo } from "@/components/block/loculi/types";
import { fetchLoculiData, searchLoculi } from "@/services/loculiService";

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
        
        // Converti l'ID blocco in numero
        const numericBlockId = parseInt(blockId, 10);
        
        if (isNaN(numericBlockId)) {
          throw new Error("ID blocco non valido: deve essere un numero");
        }
        
        console.log("Caricamento loculi per il blocco ID:", numericBlockId);
        
        // Utilizza la funzione appropriata in base alla presenza di searchTerm
        const result = searchTerm 
          ? await searchLoculi(numericBlockId, searchTerm)
          : await fetchLoculiData(numericBlockId);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        console.log(`Caricati ${result.data.length} loculi per il blocco ${numericBlockId}`);
        setLoculi(result.data);
        
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
