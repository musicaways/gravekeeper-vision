
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
  getTableInfo 
} from "@/services/loculiService";
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
        
        // Check table structure for debugging
        const loculiTableInfo = await getTableInfo('loculi');
        console.log("Struttura tabella 'loculi':", loculiTableInfo);
        
        const loculoTableInfo = await getTableInfo('Loculo');
        console.log("Struttura tabella 'Loculo':", loculoTableInfo);
        
        // Prova a recuperare i loculi sia dalla tabella uppercase che lowercase
        const uppercaseResult = await fetchLoculiFromUppercaseTable(numericBlockId);
        console.log("Uppercase table result:", uppercaseResult);
        
        const lowercaseResult = await fetchLoculiFromLowercaseTable(numericBlockId);
        console.log("Lowercase table result:", lowercaseResult);
        
        // Recupera i dati usando la funzione helper
        const result = await fetchLoculiData(numericBlockId);
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        console.log(`Caricati ${result.data.length} loculi per il blocco ${numericBlockId}`);
        
        // Verifica se abbiamo effettivamente dei dati
        if (result.data.length === 0) {
          console.log("Nessun loculo trovato per il blocco", numericBlockId);
          
          // Check if there's data in the tables at all
          const loculiCheck = await supabase.from('loculi').select('*').limit(5);
          console.log("Sample loculi check:", loculiCheck);
          
          const loculoCheck = await supabase.from('Loculo').select('*').limit(5);
          console.log("Sample Loculo check:", loculoCheck);
          
          // Check database for any loculi with this blockId (try different field names)
          console.log("Checking for loculi with block ID using alternative field names...");
          
          const alternativeCheck1 = await supabase.from('loculi').select('*').eq('idblocco', numericBlockId);
          console.log("Check with 'idblocco':", alternativeCheck1);
          
          const alternativeCheck2 = await supabase.from('loculi').select('*').eq('id_blocco', numericBlockId);
          console.log("Check with 'id_blocco':", alternativeCheck2);
        } else {
          console.log("Primo loculo trovato:", result.data[0]);
        }
        
        setLoculi(result.data);
        
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
    return { data: loculoData as Loculo[], error: null };
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
  
  // Convert the data to the proper format if needed
  let formattedData: Loculo[] = [];
  
  if (loculiData && loculiData.length > 0) {
    console.log("Tipo del primo elemento:", typeof loculiData[0], Object.keys(loculiData[0]));
    
    // Check if we need to convert from old database format
    if (loculiData[0] && ('id' in loculiData[0])) {
      // Old format data - convert it
      console.log("Converto i dati dal formato vecchio al formato nuovo");
      formattedData = loculiData.map(loculo => 
        convertDatabaseToLoculo(loculo as unknown as LoculoDatabaseLowercase)
      );
    } else {
      // Already in the right format
      console.log("I dati sono già nel formato corretto");
      formattedData = loculiData as unknown as Loculo[];
    }
    
    console.log("Dati formattati:", formattedData);
  }
  
  return { data: formattedData, error: null };
}
