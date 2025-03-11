
import { supabase } from "@/integrations/supabase/client";

export const fetchDeceasedByCemeteryId = async (cemeteryId: string, searchTerm: string = "") => {
  try {
    const query = supabase
      .from('Defunto')
      .select(`
        Id,
        Nominativo,
        DataDecesso,
        DataNascita,
        Eta,
        IdLoculo
      `)
      .order('Nominativo');

    // Apply cemetery filter through loculi relationship if needed
    // Left out for now until the relation is properly set up

    const { data, error } = await query;

    if (error) throw error;

    return data?.map(record => ({
      id: record.Id,
      name: record.Nominativo,
      deathDate: record.DataDecesso,
      birthDate: record.DataNascita,
      age: record.Eta
    })) || [];
  } catch (error) {
    console.error("Error fetching deceased:", error);
    return [];
  }
};

export const fetchPlotsByCemeteryId = async (cemeteryId: string) => {
  try {
    const { data, error } = await supabase
      .from('Loculo')
      .select(`
        id,
        Numero,
        Fila,
        IdBlocco
      `);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching plots:", error);
    return [];
  }
};
