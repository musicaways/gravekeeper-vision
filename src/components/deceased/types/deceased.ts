export interface DeceasedRecord {
  id: string;
  nominativo: string;
  data_nascita: Date | null;
  data_decesso: Date | null;
  eta: number | null;
  sesso: string | null;
  annotazioni: string | null;
  stato_defunto: number | null;
  id_loculo: string | number | null;
  loculo_numero: number | null;
  loculo_fila: number | null;
  cimitero_nome: string | null;
  cimitero_id?: number | null;
  settore_nome: string | null;
  blocco_nome: string | null;
  loculi: any | null;
}
