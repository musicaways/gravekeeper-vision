
import { supabase } from "@/integrations/supabase/client";

// Formatta i dati per l'aggiornamento in Supabase
export const formatBlockData = (data: any) => {
  return {
    Nome: data.Nome,
    Codice: data.Codice,
    Descrizione: data.Descrizione,
    Note: data.Note,
    Indirizzo: data.Indirizzo,
    Latitudine: data.Latitudine,
    Longitudine: data.Longitudine,
    NumeroLoculi: data.NumeroLoculi,
    NumeroFile: data.NumeroFile,
    DataCreazione: data.DataCreazione || null,
  };
};

// Aggiorna le informazioni del blocco nel database
export const updateBlockInfo = async (blockId: number, updateData: any) => {
  console.log("Updating block with ID:", blockId, "Data:", updateData);

  if (!blockId) {
    throw new Error("ID blocco non valido");
  }

  const { data, error } = await supabase
    .from('Blocco')
    .update(updateData)
    .eq('Id', blockId)
    .select()
    .single();

  if (error) {
    console.error("Error updating block:", error);
    throw error;
  }

  console.log("Block updated successfully:", data);
  return data;
};
