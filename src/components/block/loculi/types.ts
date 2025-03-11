
// Type definitions for loculi data structures

// Loculo structure from the database
export interface LoculoType {
  id: number;
  Numero: number;
  Fila: number;
  Annotazioni?: string;
  IdBlocco: number;
  TipoTomba?: number;
  Alias?: string;
  FilaDaAlto?: number;
  NumeroPostiResti?: number;
  NumeroPosti?: number;
  Superficie?: number;
  Concesso?: boolean;
  Defunti?: DefuntoType[];
}

export interface DefuntoType {
  Id?: number;
  id?: number;
  Nominativo?: string;
  nominativo?: string;
  DataNascita?: string | Date;
  data_nascita?: string | Date;
  DataDecesso?: string | Date;
  data_decesso?: string | Date;
  Sesso?: string;
  sesso?: string;
  annotazioni?: string;
}

// Union type to handle all structures (for backward compatibility)
export type Loculo = LoculoType;
export type Defunto = DefuntoType;

// Helper function to safely get the ID
export function getLoculoId(loculo: Loculo): number | undefined {
  return loculo.id;
}

// Helper function to get defunti count
export function getDefuntiCount(loculo: Loculo): number {
  return (loculo.Defunti?.length || 0);
}

// Helper function to get defunti array
export function getDefunti(loculo: Loculo): DefuntoType[] {
  return loculo.Defunti || [];
}

// Helper function to get nominativo
export function getNominativo(defunto: DefuntoType): string {
  return defunto.Nominativo || defunto.nominativo || "Nome non disponibile";
}
