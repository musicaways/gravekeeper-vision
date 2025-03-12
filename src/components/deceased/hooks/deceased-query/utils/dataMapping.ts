
import { DeceasedRecord } from '../../../types/deceased';

/**
 * Map deceased without loculo information
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
  })) as DeceasedRecord[];
};

/**
 * Process with partial data when some queries failed
 */
export const processWithPartialData = (
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
