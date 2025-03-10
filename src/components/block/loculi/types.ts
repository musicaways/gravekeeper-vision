
// Type definitions for loculi data structures

// Lowercase schema interfaces (from the database with lowercase column names)
export interface LoculoDatabaseLowercase {
  id: string | number;
  Numero: number;
  Fila: number;
  Annotazioni?: string;
  IdBlocco: number;
  TipoTomba?: number;
  created_at?: string;
  updated_at?: string;
  defunti?: DefuntoDatabaseLowercase[];
  Alias?: string;
  FilaDaAlto?: number;
  NumeroPostiResti?: number;
  NumeroPosti?: number;
  Superficie?: number;
  Concesso?: boolean;
}

export interface DefuntoDatabaseLowercase {
  id: string | number;
  nominativo: string;
  data_nascita?: string | Date;
  data_decesso?: string | Date;
  sesso?: string;
  annotazioni?: string;
}

// Lowercase schema interfaces (using new column names with capital letters)
export interface LoculoLowercase {
  Id: number;
  id?: string | number; // Optional id field to fix type compatibility
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

// Type guard for database lowercase schema (old format)
export function isLoculoDatabaseLowercase(loculo: any): loculo is LoculoDatabaseLowercase {
  return loculo && ('id' in loculo && 'Numero' in loculo && 'Fila' in loculo);
}

// Helper function to safely get the ID regardless of case
export function getLoculoId(loculo: Loculo | LoculoDatabaseLowercase): number | string | undefined {
  if (isLoculoDatabaseLowercase(loculo)) {
    return loculo.id;
  }
  // Only access Id for LoculoUppercase, or Id/id for LoculoLowercase
  if (isLoculoUppercase(loculo)) {
    return loculo.Id;
  }
  // For LoculoLowercase, try both Id and id
  return loculo.Id || loculo.id;
}

// Helper function to convert database lowercase to proper Loculo type
export function convertDatabaseToLoculo(dbLoculo: LoculoDatabaseLowercase): LoculoLowercase {
  return {
    Id: typeof dbLoculo.id === 'string' ? parseInt(dbLoculo.id) : dbLoculo.id as number,
    id: dbLoculo.id, // Add the id field to maintain compatibility
    Numero: dbLoculo.Numero,
    Fila: dbLoculo.Fila,
    Annotazioni: dbLoculo.Annotazioni,
    IdBlocco: dbLoculo.IdBlocco,
    TipoTomba: dbLoculo.TipoTomba,
    created_at: dbLoculo.created_at,
    updated_at: dbLoculo.updated_at,
    Alias: dbLoculo.Alias,
    FilaDaAlto: dbLoculo.FilaDaAlto,
    NumeroPostiResti: dbLoculo.NumeroPostiResti,
    NumeroPosti: dbLoculo.NumeroPosti,
    Superficie: dbLoculo.Superficie,
    Concesso: dbLoculo.Concesso,
    defunti: dbLoculo.defunti
  };
}
