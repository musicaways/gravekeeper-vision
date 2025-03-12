
import { SupabaseClient } from '@supabase/supabase-js';
import { DeceasedRecord } from '../../types/deceased';

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
    const { data: loculiData, error: loculiError } = await supabase
      .from('Loculo')
      .select(`
        id,
        Numero,
        Fila,
        IdBlocco
      `)
      .in('id', loculiIds);
    
    if (loculiError) {
      console.error("Error fetching loculi:", loculiError);
      return mapDeceasedWithoutLoculi(defuntiData);
    }

    // Fetch block data for the loculi
    const blockIds = loculiData
      ?.map(l => l.IdBlocco)
      .filter(Boolean) || [];
    
    const { data: blockData, error: blockError } = await supabase
      .from('Blocco')
      .select(`
        Id,
        Nome,
        IdSettore
      `)
      .in('Id', blockIds);
    
    if (blockError) {
      console.error("Error fetching blocks:", blockError);
      return processWithPartialData(defuntiData, loculiData, null, null);
    }

    // Fetch sector data for the blocks
    const sectorIds = blockData
      ?.map(b => b.IdSettore)
      .filter(Boolean) || [];
    
    const { data: sectorData, error: sectorError } = await supabase
      .from('Settore')
      .select(`
        Id,
        Nome,
        IdCimitero
      `)
      .in('Id', sectorIds);
    
    if (sectorError) {
      console.error("Error fetching sectors:", sectorError);
      return processWithPartialData(defuntiData, loculiData, blockData, null);
    }

    // Fetch cemetery data for the sectors
    const cemeteryIds = sectorData
      ?.map(s => s.IdCimitero)
      .filter(Boolean) || [];
    
    const { data: cemeteryData, error: cemeteryError } = await supabase
      .from('Cimitero')
      .select(`
        Id,
        Nome
      `)
      .in('Id', cemeteryIds);
    
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

/**
 * Process data with complete hierarchy information
 */
const processWithCompleteData = (
  defuntiData: any[],
  loculiData: any[],
  blockData: any[],
  sectorData: any[],
  cemeteryData: any[],
  selectedCemetery: string | null,
  selectedCemeteryId: number | null,
  filterBy: string,
  sortBy: string
): DeceasedRecord[] => {
  // Create maps for fast lookups
  const loculiMap = new Map(loculiData.map(l => [l.id, l]));
  const blockMap = new Map(blockData.map(b => [b.Id, b]));
  const sectorMap = new Map(sectorData.map(s => [s.Id, s]));
  const cemeteryMap = new Map(cemeteryData.map(c => [c.Id, c]));

  // Log the cemeteries found for debugging
  const cemeteriesInData = Array.from(cemeteryMap.values()).map(c => `${c.Nome} (ID: ${c.Id})`);
  console.log("Cemeteries found in data:", cemeteriesInData);

  // Map the deceased records with all location information
  let processedData = defuntiData.map(defunto => {
    // Get the loculo
    const loculoId = typeof defunto.id_loculo === 'string' 
      ? parseInt(defunto.id_loculo, 10) 
      : defunto.id_loculo;
    
    const loculo = loculiMap.get(loculoId);
    
    // Get the block if loculo exists
    const block = loculo ? blockMap.get(loculo.IdBlocco) : null;
    
    // Get the sector if block exists
    const sector = block ? sectorMap.get(block.IdSettore) : null;
    
    // Get the cemetery if sector exists
    const cemetery = sector ? cemeteryMap.get(sector.IdCimitero) : null;
    
    return {
      id: defunto.id,
      nominativo: defunto.nominativo,
      data_nascita: defunto.data_nascita,
      data_decesso: defunto.data_decesso,
      eta: defunto.eta,
      sesso: defunto.sesso,
      annotazioni: defunto.annotazioni,
      stato_defunto: defunto.stato_defunto,
      id_loculo: defunto.id_loculo,
      loculo_numero: loculo?.Numero || null,
      loculo_fila: loculo?.Fila || null,
      cimitero_nome: cemetery?.Nome || null,
      cimitero_id: cemetery?.Id || null,
      settore_nome: sector?.Nome || null,
      blocco_nome: block?.Nome || null,
      loculi: loculo
    } as DeceasedRecord;
  });

  // Apply cemetery filtering if specified
  if (selectedCemeteryId) {
    console.log(`Filtering by cemetery ID: ${selectedCemeteryId}`);
    processedData = processedData.filter(defunto => defunto.cimitero_id === selectedCemeteryId);
  } else if (selectedCemetery) {
    console.log(`Filtering by cemetery name: "${selectedCemetery}"`);
    // Flexible cemetery name matching
    processedData = processedData.filter(defunto => {
      if (!defunto.cimitero_nome) return false;
      
      const selectedName = selectedCemetery.toLowerCase().trim();
      const cemeteryName = defunto.cimitero_nome.toLowerCase().trim();
      
      return cemeteryName.includes(selectedName) || 
             selectedName.includes(cemeteryName) ||
             levenshteinDistance(cemeteryName, selectedName) <= 3; // Allow for minor typos
    });
  }

  console.log(`After cemetery filtering: ${processedData.length} records remain`);

  // Apply sorting by cemetery if requested
  if (sortBy === 'cemetery-asc') {
    processedData.sort((a, b) => (a.cimitero_nome || '').localeCompare(b.cimitero_nome || ''));
  } else if (sortBy === 'cemetery-desc') {
    processedData.sort((a, b) => (b.cimitero_nome || '').localeCompare(a.cimitero_nome || ''));
  }

  return processedData;
};

/**
 * Process with partial data when some queries failed
 */
const processWithPartialData = (
  defuntiData: any[],
  loculiData: any[] | null,
  blockData: any[] | null,
  sectorData: any[] | null
): DeceasedRecord[] => {
  return defuntiData.map(defunto => {
    // Get the loculo if available
    const loculoId = typeof defunto.id_loculo === 'string' 
      ? parseInt(defunto.id_loculo, 10) 
      : defunto.id_loculo;
    
    const loculo = loculiData?.find(l => l.id === loculoId) || null;
    
    return {
      id: defunto.id,
      nominativo: defunto.nominativo,
      data_nascita: defunto.data_nascita,
      data_decesso: defunto.data_decesso,
      eta: defunto.eta,
      sesso: defunto.sesso,
      annotazioni: defunto.annotazioni,
      stato_defunto: defunto.stato_defunto,
      id_loculo: defunto.id_loculo,
      loculo_numero: loculo?.Numero || null,
      loculo_fila: loculo?.Fila || null,
      cimitero_nome: null,
      cimitero_id: null,
      settore_nome: null,
      blocco_nome: null,
      loculi: loculo
    } as DeceasedRecord;
  });
};

/**
 * Map deceased without loculo information
 */
const mapDeceasedWithoutLoculi = (defuntiData: any[]): DeceasedRecord[] => {
  return defuntiData.map(defunto => ({
    id: defunto.id,
    nominativo: defunto.nominativo,
    data_nascita: defunto.data_nascita,
    data_decesso: defunto.data_decesso,
    eta: defunto.eta,
    sesso: defunto.sesso,
    annotazioni: defunto.annotazioni,
    stato_defunto: defunto.stato_defunto,
    id_loculo: defunto.id_loculo,
    loculo_numero: null,
    loculo_fila: null,
    cimitero_nome: null,
    cimitero_id: null,
    settore_nome: null,
    blocco_nome: null,
    loculi: null
  })) as DeceasedRecord[];
};

/**
 * Calculate Levenshtein distance for fuzzy string matching
 */
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
};
