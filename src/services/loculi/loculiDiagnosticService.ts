
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function checkBloccoRelationship(blockId: number) {
  console.log(`Verifica relazione per il blocco ${blockId}`);
  
  try {
    // Controlla info blocco
    const bloccoResponse = await supabase
      .from('Blocco')
      .select('Id, Nome, Codice, NumeroLoculi')
      .eq('Id', blockId)
      .single();
      
    // Conta loculi per questo blocco
    const loculiCountResponse = await supabase
      .from('Loculo')
      .select('id', { count: 'exact' })
      .eq('IdBlocco', blockId);
      
    // Recupera un esempio di loculo
    const loculoEsempioResponse = await supabase
      .from('Loculo')
      .select('*')
      .eq('IdBlocco', blockId)
      .limit(1);
      
    return {
      blocco: bloccoResponse.data,
      loculiCount: loculiCountResponse.count,
      loculoEsempio: loculoEsempioResponse.data?.[0]
    };
  } catch (err: any) {
    console.error("Errore durante la verifica della relazione:", err);
    toast.error("Errore durante la verifica della relazione blocco-loculi");
    return { error: err.message };
  }
}

