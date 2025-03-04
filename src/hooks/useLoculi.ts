
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loculo } from "@/components/block/loculi/types";
import { UseLoculiProps, UseLoculiResult, LoculiDataFetchResult } from "@/models/LoculiTypes";
import { fetchLoculiFromUppercaseTable, fetchLoculiFromLowercaseTable } from "@/services/loculiService";
import { searchDefuntiByName } from "@/utils/defuntiSearchUtils";

/**
 * Custom hook to fetch and manage loculi data
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
        
        // Convert blockId string to number
        const numericBlockId = parseInt(blockId, 10);
        
        if (isNaN(numericBlockId)) {
          throw new Error("ID blocco non valido: deve essere un numero");
        }
        
        console.log("Fetching loculi for block ID:", numericBlockId);
        
        const result = await fetchLoculiData(numericBlockId);
        setLoculi(result.data);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        // If we have a search term, also search for defunti by nominativo
        if (searchTerm) {
          const searchResults = await searchDefuntiByName(numericBlockId, searchTerm, result.data);
          setLoculi(searchResults);
        }
        
      } catch (err: any) {
        console.error("Error fetching loculi:", err);
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

/**
 * Helper function to fetch loculi data from both tables
 */
async function fetchLoculiData(blockId: number): Promise<LoculiDataFetchResult> {
  // Try the uppercase Loculo table first
  const { data: loculoData, error: loculoError } = await fetchLoculiFromUppercaseTable(blockId);
        
  if (!loculoError && loculoData && loculoData.length > 0) {
    console.log("Loculi fetched from 'Loculo' table:", loculoData);
    return { data: loculoData, error: null };
  } 
  
  console.log("Error or no data from 'Loculo' table:", loculoError);
  
  // Try the lowercase loculi table
  const { data: loculiData, error: loculiError } = await fetchLoculiFromLowercaseTable(blockId);
  
  if (loculiError) {
    console.error("Error fetching from 'loculi' table:", loculiError);
    return { 
      data: [], 
      error: "Impossibile caricare i loculi: " + loculiError.message 
    };
  }
  
  console.log("Loculi fetched from 'loculi' table:", loculiData);
  return { data: loculiData || [], error: null };
}
