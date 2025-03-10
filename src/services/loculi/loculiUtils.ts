
import { Loculo } from "@/components/block/loculi/types";

/**
 * Filters unique loculi that don't already exist in the current results
 */
export function filterUniqueLoculi(newLoculi: any[], currentLoculi: Loculo[]): any[] {
  return newLoculi.filter(
    newLoculo => !currentLoculi.some(existingLoculo => {
      // Handle both uppercase and lowercase ID fields
      const existingId = typeof existingLoculo.Id === 'number' 
        ? existingLoculo.Id 
        : typeof existingLoculo.Id === 'string'
          ? parseInt(existingLoculo.Id)
          : -1;
        
      const newId = typeof newLoculo.Id === 'number' 
        ? newLoculo.Id 
        : typeof newLoculo.Id === 'string'
          ? parseInt(newLoculo.Id)
          : typeof newLoculo.id === 'number'
            ? newLoculo.id
            : typeof newLoculo.id === 'string'
              ? parseInt(newLoculo.id)
              : -2;
        
      return existingId === newId;
    })
  );
}

/**
 * Helper function to fetch loculi data from both tables
 */
export async function fetchLoculiCombined(
  fetchUppercase: (blockId: number) => Promise<{data: any, error: any}>,
  fetchLowercase: (blockId: number) => Promise<{data: any, error: any}>,
  blockId: number
) {
  // Try the uppercase Loculo table first
  const { data: loculoData, error: loculoError } = await fetchUppercase(blockId);
        
  if (!loculoError && loculoData && loculoData.length > 0) {
    console.log("Loculi fetched from 'Loculo' table:", loculoData);
    return { data: loculoData, error: null };
  } 
  
  console.log("Error or no data from 'Loculo' table:", loculoError);
  
  // Try the lowercase loculi table
  const { data: loculiData, error: loculiError } = await fetchLowercase(blockId);
  
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
