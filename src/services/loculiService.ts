
import { 
  fetchLoculiFromUppercaseTable, 
  searchDefuntiInUppercaseTable 
} from './loculi/uppercaseTableService';

import { 
  fetchLoculiFromLowercaseTable, 
  searchDefuntiInLowercaseTable 
} from './loculi/lowercaseTableService';

import { getTableInfo } from './loculi/tableInfoService';
import { filterUniqueLoculi } from './loculi/loculiUtils';
import { Loculo, LoculoDatabaseLowercase, convertDatabaseToLoculo } from "@/components/block/loculi/types";
import { LoculiDataFetchResult } from "@/models/LoculiTypes";

// Re-export everything from the module files
export { 
  fetchLoculiFromUppercaseTable, 
  searchDefuntiInUppercaseTable,
  fetchLoculiFromLowercaseTable,
  searchDefuntiInLowercaseTable,
  getTableInfo,
  filterUniqueLoculi
};

/**
 * Helper function to fetch loculi data from both tables
 */
export async function fetchLoculiData(blockId: number): Promise<LoculiDataFetchResult> {
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
      error: "Impossibile caricare i loculi: " + (loculiError as any).message 
    };
  }
  
  console.log("Loculi fetched from 'loculi' table:", loculiData);
  
  // Convert data to the correct format if needed
  let formattedData: Loculo[] = [];
  
  if (loculiData && loculiData.length > 0) {
    // Simplify conversion logic to avoid type problems
    try {
      // Use type assertions to work with dynamic data
      const firstItem = loculiData[0] as any;
      if (firstItem && 'id' in firstItem) {
        console.log("Converting data from old format to new format");
        formattedData = loculiData.map(loculo => {
          return convertDatabaseToLoculo(loculo as any);
        });
      } else {
        console.log("Data is already in the correct format");
        formattedData = loculiData as any;
      }
    } catch (err) {
      console.error("Error converting data:", err);
      formattedData = loculiData as any;
    }
    
    console.log("Formatted data:", formattedData);
  }
  
  return { data: formattedData, error: null };
}
