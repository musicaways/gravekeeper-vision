import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Fetch deceased records with optional cemetery filtering
 */
export async function fetchDeceasedRecords(cemeteryId?: string | number) {
  try {
    console.log("Fetching deceased records", cemeteryId ? `for cemetery ${cemeteryId}` : "for all cemeteries");
    
    let query = supabase
      .from('Defunto')
      .select(`
        Id,
        Nominativo,
        DataDecesso,
        DataNascita,
        Eta,
        IdLoculo
      `)
      .order('Nominativo', { ascending: true });
      
    // Apply cemetery filter if provided
    if (cemeteryId) {
      // This would require joining multiple tables, but for now we're keeping it simple
      // In the future, we may need to implement proper joins to filter by cemetery
      console.log("Cemetery filtering not implemented yet - returning all records");
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Transform the data to use consistent property names
    const transformedData = data.map(item => ({
      id: item.Id,
      nominativo: item.Nominativo || 'No name',
      data_decesso: item.DataDecesso,
      data_nascita: item.DataNascita,
      eta: item.Eta,
      loculo_id: item.IdLoculo,
      cimitero_nome: "Info non disponibile", // We don't have this info in the simple query
      settore_nome: "Info non disponibile",
      blocco_nome: "Info non disponibile",
      loculo_numero: null,
      loculo_fila: null
    }));
    
    console.log(`Fetched ${transformedData.length} deceased records`);
    return { data: transformedData, error: null };
  } catch (error: any) {
    console.error("Error fetching deceased records:", error);
    toast.error("Impossibile caricare i dati dei defunti");
    return { data: [], error: error.message };
  }
}
