
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Loculo, 
  LoculoDatabaseLowercase, 
  convertDatabaseToLoculo 
} from "@/components/block/loculi/types";
import { UseLoculiProps, UseLoculiResult, LoculiDataFetchResult } from "@/models/LoculiTypes";
import { 
  fetchLoculiFromUppercaseTable, 
  fetchLoculiFromLowercaseTable,
  getTableInfo,
  fetchLoculiData
} from "@/services/loculiService";
import { searchDefuntiByName } from "@/utils/defuntiSearchUtils";
import { supabase } from "@/integrations/supabase/client";

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
        
        // Check table structure for debugging
        const loculiTableInfo = await getTableInfo('loculi');
        console.log("Struttura tabella 'loculi':", loculiTableInfo);
        
        const loculoTableInfo = await getTableInfo('Loculo');
        console.log("Struttura tabella 'Loculo':", loculoTableInfo);
        
        // Use type assertions to avoid recursion
        const uppercaseResult = await fetchLoculiFromUppercaseTable(numericBlockId);
        console.log("Uppercase table result:", uppercaseResult);
        
        const lowercaseResult = await fetchLoculiFromLowercaseTable(numericBlockId);
        console.log("Lowercase table result:", lowercaseResult);
        
        // Retrieve data using the helper function - treat as simple data object to avoid type recursion
        const result = await fetchLoculiData(numericBlockId);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        console.log(`Caricati ${result.data.length} loculi per il blocco ${numericBlockId}`);
        
        // Verify if we actually have data
        if (result.data.length === 0) {
          console.log("Nessun loculo trovato per il blocco", numericBlockId);
          
          // Simple check for data presence in tables
          try {
            // Use simple queries with explicit column selection to avoid type recursion
            const loculiCheck = await supabase
              .from('loculi')
              .select('id, Numero, Fila')
              .limit(5);
            console.log("Sample loculi check:", loculiCheck);
            
            const loculoCheck = await supabase
              .from('Loculo')
              .select('Id, Numero, Fila')
              .limit(5);
            console.log("Sample Loculo check:", loculoCheck);
            
            // Try alternative column names too
            console.log("Checking for loculi with block ID using alternative field names...");
            
            const alternativeCheck1 = await supabase
              .from('loculi')
              .select('id, Numero, Fila')
              .eq('idblocco', numericBlockId);
            console.log("Check with 'idblocco':", alternativeCheck1);
            
            const alternativeCheck2 = await supabase
              .from('loculi')
              .select('id, Numero, Fila')
              .eq('id_blocco', numericBlockId);
            console.log("Check with 'id_blocco':", alternativeCheck2);
          } catch (err) {
            console.error("Error in check queries:", err);
          }
        } else {
          console.log("Primo loculo trovato:", result.data[0]);
        }
        
        // Use type assertion to avoid recursion
        setLoculi(result.data as Loculo[]);
        
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
