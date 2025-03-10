
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
  
  // Converti i dati al formato corretto se necessario
  let formattedData: Loculo[] = [];
  
  if (loculiData && loculiData.length > 0) {
    // Semplificazione della logica di conversione per evitare problemi di tipo
    try {
      if (loculiData[0] && 'id' in loculiData[0]) {
        console.log("Converto i dati dal formato vecchio al formato nuovo");
        formattedData = loculiData.map(loculo => {
          return convertDatabaseToLoculo(loculo as any);
        });
      } else {
        console.log("I dati sono già nel formato corretto");
        formattedData = loculiData as any;
      }
    } catch (err) {
      console.error("Errore nella conversione dei dati:", err);
      formattedData = loculiData as any;
    }
    
    console.log("Dati formattati:", formattedData);
  }
  
  return { data: formattedData, error: null };
}
