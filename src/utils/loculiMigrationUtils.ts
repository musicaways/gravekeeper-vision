
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Interfaccia per il mapping tra ID vecchi (numerici) e nuovi (UUID)
 */
export interface IdMapping {
  oldId: number;
  newId: string;
}

/**
 * NOTA: Funzionalità temporaneamente disabilitata fino all'aggiornamento delle tabelle
 */
export async function migrateLoculiData(): Promise<IdMapping[]> {
  toast.error("Funzionalità di migrazione temporaneamente disabilitata");
  console.error("Funzionalità di migrazione temporaneamente disabilitata");
  return [];
}

/**
 * NOTA: Funzionalità temporaneamente disabilitata fino all'aggiornamento delle tabelle
 */
export async function migrateDefuntiReferences(idMappings: IdMapping[]): Promise<void> {
  toast.error("Funzionalità di migrazione temporaneamente disabilitata");
  console.error("Funzionalità di migrazione temporaneamente disabilitata");
}
