
// Type definitions for loculi data structures

// Lowercase schema interfaces (from the 'loculi' table with new column names)
export interface LoculoLowercase {
  Id: number;
  Numero: number;
  Fila: number;
  Annotazioni?: string;
  IdBlocco: number;
  TipoTomba?: number;
  created_at?: string;
  updated_at?: string;
  Alias?: string;
  FilaDaAlto?: number;
  NumeroPostiResti?: number;
  NumeroPosti?: number;
  Superficie?: number;
  Concesso?: boolean;
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
  return loculo && ('defunti' in loculo || loculo.defunti !== undefined);
}

export function isLoculoUppercase(loculo: any): loculo is LoculoUppercase {
  return loculo && ('Defunti' in loculo || loculo.Defunti !== undefined);
}

// Helper function to safely get the ID regardless of case
export function getLoculoId(loculo: Loculo): number | undefined {
  return loculo.Id;
}
