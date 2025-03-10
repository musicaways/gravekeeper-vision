
export interface DeceasedRecord {
  id: string;
  nominativo: string;
  data_decesso: string | null;
  cimitero_nome: string | null;
  settore_nome: string | null;
  blocco_nome: string | null;
  loculo_numero: number | null;
  loculo_fila: number | null;
  loculi: {
    id: string;
    numero: number | null;
    fila: number | null;
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
