
import { supabase } from "@/integrations/supabase/client";
import { getTableMetadata } from "@/utils/debug";

/**
 * Funzione di debug per ottenere informazioni sulle tabelle
 */
export async function getTableInfo(tableName: string) {
  console.log(`Verificando struttura della tabella ${tableName}`);
  return getTableMetadata(tableName);
}
