
import { DeceasedRecord } from '../../../types/deceased';

/**
 * Map deceased records without loculo data
 * Used as a fallback when loculo queries fail
 */
export const mapDeceasedWithoutLoculi = (defuntiData: any[]): DeceasedRecord[] => {
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
  }));
};

/**
 * Process data with partial hierarchy information
 * Used when some related data queries fail
 */
export const processWithPartialData = (
  defuntiData: any[],
  loculiData: any[] | null,
  blockData: any[] | null,
  sectorData: any[] | null
): DeceasedRecord[] => {
  // Create maps for fast lookups
  const loculiMap = loculiData ? new Map(loculiData.map(l => [l.id, l])) : new Map();
  const blockMap = blockData ? new Map(blockData.map(b => [b.Id, b])) : new Map();
  const sectorMap = sectorData ? new Map(sectorData.map(s => [s.Id, s])) : new Map();
  
  // Map the deceased records with available location information
  return defuntiData.map(defunto => {
    const loculoId = typeof defunto.id_loculo === 'string' 
      ? parseInt(defunto.id_loculo, 10) 
      : defunto.id_loculo;
    
    const loculo = loculiMap.get(loculoId);
    
    // Get block if available
    let block = null;
    if (loculo && blockMap.size > 0) {
      block = blockMap.get(loculo.IdBlocco);
    }
    
    // Get sector if available
    let sector = null;
    if (block && sectorMap.size > 0) {
      sector = sectorMap.get(block.IdSettore);
    }
    
    // Create the deceased record
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
      cimitero_nome: null, // We don't have cemetery data here
      cimitero_id: null,
      settore_nome: sector?.Nome || null,
      blocco_nome: block?.Nome || null,
      loculi: {
        ...loculo,
        Blocco: block ? {
          ...block,
          Settore: sector
        } : null
      }
    } as DeceasedRecord;
  });
};
