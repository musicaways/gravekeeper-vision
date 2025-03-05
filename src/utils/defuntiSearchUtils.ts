
import { toast } from "sonner";
import { Loculo } from "@/components/block/loculi/types";
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
    additionalLoculi = filterUniqueLoculi(loculiFromDefunti, currentLoculi);
  } else {
    // Try lowercase table
    const { data: defuntiData, error: defuntiError } = 
      await searchDefuntiInLowercaseTable(blockId, searchTerm);
    
    if (!defuntiError && defuntiData && defuntiData.length > 0) {
      console.log("Defunti found in 'defunti' table:", defuntiData);
      
      // Extract unique loculi from defunti search results
      const loculiFromDefunti = defuntiData
        .filter(d => d.loculi) // Ensure loculi is defined
        .map(d => d.loculi);
      
      // Only include loculi that aren't already in the main results
      additionalLoculi = filterUniqueLoculi(loculiFromDefunti, currentLoculi);
    }
  }
  
  // Combine the results
  const combinedResults = [...currentLoculi, ...additionalLoculi];
  
  if (combinedResults.length === 0) {
    console.log("No loculi found for the specified search criteria");
    toast.info("Nessun loculo trovato con questi criteri di ricerca");
  }
  
  return combinedResults;
}
