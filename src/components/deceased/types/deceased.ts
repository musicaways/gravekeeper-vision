
export interface DeceasedRecord {
  id: string; // UUID (string)
  nominativo: string;
  data_decesso: string | null;
  data_nascita: string | null;
  eta: number | string | null;
  cimitero_nome: string | null;
  settore_nome: string | null;
  blocco_nome: string | null;
  loculo_numero: number | null;
  loculo_fila: number | null;
  annotazioni: string | null;
  sesso: string | null;
  stato_defunto: number | null;
  id_loculo: string | null; // Ora è una stringa che contiene il valore originale numerico
  loculi: {
    id: string | number;
    Numero: number | null;
    Fila: number | null;
    Blocco: {
      Id: number;
      Nome: string | null;
      Settore: {
        Id: number;
        Nome: string | null;
        Cimitero: {
          Id: number;
          Nome: string | null;
        } | null;
      } | null;
    } | null;
  } | null;
}

export interface DeceasedListProps {
  searchTerm: string;
  sortBy: string;
  filterBy: string;
  selectedCemetery?: string | null;
}
