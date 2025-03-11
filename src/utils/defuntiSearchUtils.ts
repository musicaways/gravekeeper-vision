
import { toast } from "sonner";
import { 
  Loculo, 
  LoculoDatabaseLowercase,
  convertDatabaseToLoculo 
} from "@/components/block/loculi/types";
import { 
  searchDefuntiInUppercaseTable, 
  searchDefuntiInLowercaseTable, 
  filterUniqueLoculi 
} from "@/services/loculiService";

/**
 * Searches for defunti by name and retrieves their associated loculi
 */
export async function searchDefuntiByName(
  blockId: number,
  searchTerm: string,
  currentLoculi: Loculo[]
): Promise<Loculo[]> {
  let additionalLoculi: Loculo[] = [];
  
  try {
    // Try uppercase table first
    const { data: defuntoData, error: defuntoError } = 
      await searchDefuntiInUppercaseTable(blockId, searchTerm);
    
    if (!defuntoError && defuntoData && defuntoData.length > 0) {
      console.log("Defunti found in 'Defunto' table:", defuntoData);
      
      // Extract unique loculi from defunti search results
      const loculiFromDefunti = defuntoData
        .filter(d => d.Loculo) // Ensure Loculo is defined
        .map(d => d.Loculo);
      
      // Only include loculi that aren't already in the main results
      const uniqueLoculi = filterUniqueLoculi(loculiFromDefunti, currentLoculi);
      additionalLoculi = uniqueLoculi;
    } else {
      console.log("No results from 'Defunto' table or error occurred, trying lowercase table");
      
      // Try lowercase table
      const { data: defuntiData, error: defuntiError } = 
        await searchDefuntiInLowercaseTable(blockId, searchTerm);
      
      if (!defuntiError && defuntiData && defuntiData.length > 0) {
        console.log("Defunti found in 'defunti' table:", defuntiData);
        
        // Only include loculi that aren't already in the main results
        const uniqueLoculi = filterUniqueLoculi(defuntiData, currentLoculi);
        additionalLoculi = uniqueLoculi;
      } else {
        console.log("No results from 'defunti' table or error occurred:", defuntiError);
      }
    }
  } catch (err) {
    console.error("Error in searchDefuntiByName:", err);
  }
  
  // Combine the results
  const combinedResults = [...currentLoculi, ...additionalLoculi];
  
  if (combinedResults.length === 0) {
    console.log("No loculi found for the specified search criteria");
    toast.info("Nessun loculo trovato con questi criteri di ricerca");
  }
  
  return combinedResults;
}
