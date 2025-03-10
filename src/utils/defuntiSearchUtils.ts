
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
      
      // Extract unique loculi from defunti search results using type assertion
      const loculiFromDefunti = defuntoData
        .filter(d => d.Loculo) // Ensure Loculo is defined
        .map(d => d.Loculo);
      
      // Only include loculi that aren't already in the main results
      const uniqueLoculi = filterUniqueLoculi(loculiFromDefunti, currentLoculi);
      additionalLoculi = uniqueLoculi as Loculo[];
    } else {
      console.log("No results from 'Defunto' table or error occurred, trying lowercase table");
      
      // Try lowercase table
      const { data: defuntiData, error: defuntiError } = 
        await searchDefuntiInLowercaseTable(blockId, searchTerm);
      
      if (!defuntiError && defuntiData && defuntiData.length > 0) {
        console.log("Defunti found in 'defunti' table:", defuntiData);
        
        // Extract unique loculi from defunti search results
        let loculiFromDefunti = defuntiData;
        
        console.log("Extracted loculi from defunti:", loculiFromDefunti);
        
        // Convert if needed (from old database format) using type assertion
        if (loculiFromDefunti.length > 0 && 'id' in (loculiFromDefunti[0] as any)) {
          console.log("Converting loculi from database format");
          // Convert each loculo from database format to proper format
          const convertedLoculi = loculiFromDefunti.map(loculo => {
            // Type assertion to ensure we're working with the right structure
            try {
              return convertDatabaseToLoculo(loculo as unknown as LoculoDatabaseLowercase);
            } catch (err) {
              console.error("Error converting loculo:", err, loculo);
              return loculo as unknown as Loculo;
            }
          });
          
          // Use type assertion to specify that these are now valid Loculo objects
          additionalLoculi = convertedLoculi;
        } else {
          // Only include loculi that aren't already in the main results
          const uniqueLoculi = filterUniqueLoculi(loculiFromDefunti, currentLoculi);
          additionalLoculi = uniqueLoculi as Loculo[];
        }
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
