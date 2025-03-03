
export interface Section {
  Id: number;
  Codice: string;
  Descrizione: string;
  area_sqm: number;
  section_type: string;
  max_capacity: number;
  current_occupancy: number;
  blocchi?: Block[];
}

export interface Block {
  Id: number;
  Codice: string;
  Descrizione: string;
  NumeroLoculi: number;
  available_plots: number;
  total_plots: number;
}

export interface CemeterySectionsTabProps {
  cemeteryId: string;
  searchTerm?: string;
}
