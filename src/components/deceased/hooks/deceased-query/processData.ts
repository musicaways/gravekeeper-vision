
import { SupabaseClient } from '@supabase/supabase-js';
import { DeceasedRecord } from '../../types/deceased';
import {
  mapDeceasedWithoutLoculi,
  processWithPartialData,
  processWithCompleteData,
  fetchLoculiData,
  fetchBlockData,
  fetchSectorData,
  fetchCemeteryData
} from './utils';

/**
 * Process deceased data by fetching loculo information and joining it with deceased data
 */
export const processDeceasedData = async (
  supabase: SupabaseClient,
  defuntiData: any[],
  selectedCemetery: string | null,
  selectedCemeteryId: number | null = null,
  filterBy: string,
  sortBy: string
) => {
  console.log(`processDeceasedData - Starting with ${defuntiData.length} records`, 
              { selectedCemetery, selectedCemeteryId, filterBy });
  
  // If no data, return empty array
  if (!defuntiData || defuntiData.length === 0) {
    console.log("processDeceasedData - No input data, returning empty array");
    return [];
  }
  
  // Collect all loculo IDs for a batch query
  const loculiIds = defuntiData
    .map(d => d.id_loculo)
    .filter(Boolean)
    .map(id => typeof id === 'string' ? parseInt(id, 10) : id)
    .filter(id => !isNaN(id));
  
  // If no valid loculo IDs, return data without loculo info
  if (loculiIds.length === 0) {
    console.log("processDeceasedData - No valid loculo IDs found, mapping without loculo data");
    return mapDeceasedWithoutLoculi(defuntiData);
  }
  
  console.log("processDeceasedData - Valid loculo IDs to process:", loculiIds);
  
  try {
    // Fetch loculo data - using separate queries to avoid schema cache error
    const { data: loculiData, error: loculiError } = await fetchLoculiData(supabase, loculiIds);
    
    if (loculiError) {
      console.error("Error fetching loculi:", loculiError);
      return mapDeceasedWithoutLoculi(defuntiData);
    }

    // Fetch block data for the loculi
    const blockIds = loculiData
      ?.map(l => l.IdBlocco)
      .filter(Boolean) || [];
    
    const { data: blockData, error: blockError } = await fetchBlockData(supabase, blockIds);
    
    if (blockError) {
      console.error("Error fetching blocks:", blockError);
      return processWithPartialData(defuntiData, loculiData, null, null);
    }

    // Fetch sector data for the blocks
    const sectorIds = blockData
      ?.map(b => b.IdSettore)
      .filter(Boolean) || [];
    
    const { data: sectorData, error: sectorError } = await fetchSectorData(supabase, sectorIds);
    
    if (sectorError) {
      console.error("Error fetching sectors:", sectorError);
      return processWithPartialData(defuntiData, loculiData, blockData, null);
    }

    // Fetch cemetery data for the sectors
    const cemeteryIds = sectorData
      ?.map(s => s.IdCimitero)
      .filter(Boolean) || [];
    
    const { data: cemeteryData, error: cemeteryError } = await fetchCemeteryData(supabase, cemeteryIds);
    
    if (cemeteryError) {
      console.error("Error fetching cemeteries:", cemeteryError);
      return processWithPartialData(defuntiData, loculiData, blockData, sectorData);
    }

    console.log("Successfully fetched related data:", {
      loculi: loculiData?.length || 0,
      blocks: blockData?.length || 0,
      sectors: sectorData?.length || 0,
      cemeteries: cemeteryData?.length || 0
    });

    // Process data with all the fetched information
    let processedData = processWithCompleteData(
      defuntiData, 
      loculiData || [], 
      blockData || [], 
      sectorData || [], 
      cemeteryData || [],
      selectedCemetery,
      selectedCemeteryId,
      filterBy,
      sortBy
    );
    
    return processedData;
  } catch (error) {
    console.error("Unexpected error in processDeceasedData:", error);
    return mapDeceasedWithoutLoculi(defuntiData);
  }
};
