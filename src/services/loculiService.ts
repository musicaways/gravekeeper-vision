
import { 
  fetchLoculiFromUppercaseTable, 
  searchDefuntiInUppercaseTable 
} from './loculi/uppercaseTableService';

import { 
  fetchLoculiFromLowercaseTable, 
  searchDefuntiInLowercaseTable 
} from './loculi/lowercaseTableService';

import { getTableInfo } from './loculi/tableInfoService';
import { filterUniqueLoculi, fetchLoculiCombined } from './loculi/loculiUtils';
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
  const { data: loculiData, error } = await fetchLoculiCombined(
    fetchLoculiFromUppercaseTable,
    fetchLoculiFromLowercaseTable,
    blockId
  );
  
  if (error) {
    return { data: [], error };
  }
  
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
