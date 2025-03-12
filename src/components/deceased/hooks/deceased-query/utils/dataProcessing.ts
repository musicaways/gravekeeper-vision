
import { SupabaseClient } from '@supabase/supabase-js';
import { DeceasedRecord } from '../../../types/deceased';
import { applyCemeteryFiltering, applyCemeterySorting } from './dataFiltering';

/**
 * Process data with complete hierarchy information
 */
export const processWithCompleteData = (
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

  // Apply cemetery filtering if needed
  processedData = applyCemeteryFiltering(processedData, selectedCemeteryId, selectedCemetery);
  
  console.log(`After cemetery filtering: ${processedData.length} records remain`);

  // Apply sorting by cemetery if requested
  processedData = applyCemeterySorting(processedData, sortBy);

  return processedData;
};
