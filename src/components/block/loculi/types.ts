
// Type definitions for loculi data structures

// Lowercase schema interfaces (from the 'loculi' table)
export interface LoculoLowercase {
  id: string;
  numero: number;
  fila: number;
  annotazioni?: string;
  id_blocco: number;
  tipo_tomba?: number;
  created_at?: string;
  updated_at?: string;
  defunti?: DefuntoLowercase[];
}

export interface DefuntoLowercase {
  id: string | number;
  nominativo: string;
  data_nascita?: string | Date;
  data_decesso?: string | Date;
  sesso?: string;
  annotazioni?: string;
}

// Uppercase schema interfaces (from the 'Loculo' table)
export interface LoculoUppercase {
  Id: number;
  Numero: number;
  Fila: number;
  Annotazioni?: string;
  IdBlocco: number;
  TipoTomba?: number;
  Defunti?: DefuntoUppercase[];
}

export interface DefuntoUppercase {
  Id: number;
  Nominativo: string;
  DataNascita?: string;
  DataDecesso?: string;
  Sesso?: string;
}

// Union type to handle both structures
export type Loculo = LoculoLowercase | LoculoUppercase;
export type Defunto = DefuntoLowercase | DefuntoUppercase;

// Type guard functions to check which type we're dealing with
export function isLoculoLowercase(loculo: any): loculo is LoculoLowercase {
  return loculo && ('id' in loculo || 'numero' in loculo || 'fila' in loculo);
}

export function isLoculoUppercase(loculo: any): loculo is LoculoUppercase {
  return loculo && ('Id' in loculo || 'Numero' in loculo || 'Fila' in loculo);
}

// Helper function to safely get the ID regardless of case
export function getLoculoId(loculo: Loculo): string | number | undefined {
  if (isLoculoLowercase(loculo)) {
    return loculo.id;
  } else if (isLoculoUppercase(loculo)) {
    return loculo.Id;
  }
  return undefined;
}
