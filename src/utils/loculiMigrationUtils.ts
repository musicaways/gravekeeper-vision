
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
 * Migra i dati dalla tabella loculi_import alla tabella loculi,
 * generando UUID per ciascuna riga
 * 
 * @returns Promise<IdMapping[]> Un array contenente il mapping tra vecchi e nuovi ID
 */
export async function migrateLoculiData(): Promise<IdMapping[]> {
  try {
    // Fetch dei dati dalla tabella loculi_import
    const { data: importData, error: fetchError } = await supabase
      .from('loculi_import')
      .select('*');
    
    if (fetchError) {
      console.error("Errore nel recupero dei dati da loculi_import:", fetchError);
      toast.error("Errore nel recupero dei dati da importare");
      return [];
    }
    
    if (!importData || importData.length === 0) {
      toast.info("Nessun dato da migrare nella tabella loculi_import");
      return [];
    }
    
    console.log(`Trovati ${importData.length} loculi da migrare`);
    toast.info(`Inizio migrazione di ${importData.length} loculi...`);
    
    // Array per tenere traccia del mapping tra vecchi ID (numerici) e nuovi ID (UUID)
    const idMappings: IdMapping[] = [];
    
    // Processa ogni riga e inseriscila nella tabella loculi
    for (const loculo of importData) {
      // Estrai i dati rilevanti per l'inserimento
      const {
        id: oldId,
        numero,
        fila,
        annotazioni,
        idblocco,
        tipotomba,
        alias,
        filadaalto,
        numeropostiresti,
        numeroposti,
        superficie,
        concesso
      } = loculo;
      
      // Inserisci nella tabella loculi (con UUID generato automaticamente)
      const { data: newLoculo, error: insertError } = await supabase
        .from('loculi')
        .insert([
          {
            Numero: numero,
            Fila: fila,
            Annotazioni: annotazioni,
            IdBlocco: idblocco,
            TipoTomba: tipotomba,
            Alias: alias,
            FilaDaAlto: filadaalto,
            NumeroPostiResti: numeropostiresti,
            NumeroPosti: numeroposti,
            Superficie: superficie,
            Concesso: concesso
          }
        ])
        .select('id');
      
      if (insertError) {
        console.error(`Errore nell'inserimento del loculo con ID ${oldId}:`, insertError);
        continue;
      }
      
      if (newLoculo && newLoculo.length > 0) {
        // Aggiungi il mapping tra vecchio ID e nuovo UUID
        idMappings.push({
          oldId: oldId,
          newId: newLoculo[0].id
        });
        
        console.log(`Migrato loculo ${oldId} -> ${newLoculo[0].id}`);
      }
    }
    
    console.log(`Migrazione completata per ${idMappings.length} loculi`);
    toast.success(`Migrazione completata con successo per ${idMappings.length} loculi`);
    
    // Salva il mapping in una tabella o file per riferimento futuro se necessario
    // saveIdMappings(idMappings);
    
    return idMappings;
  } catch (error) {
    console.error("Errore durante la migrazione dei loculi:", error);
    toast.error("Si è verificato un errore durante la migrazione dei loculi");
    return [];
  }
}

/**
 * Migra i defunti associati ai loculi migrati,
 * aggiornando i riferimenti con i nuovi UUID
 * 
 * @param idMappings Array contenente il mapping tra vecchi e nuovi ID
 */
export async function migrateDefuntiReferences(idMappings: IdMapping[]): Promise<void> {
  if (idMappings.length === 0) {
    toast.info("Nessun mapping di ID disponibile per aggiornare i defunti");
    return;
  }
  
  try {
    let aggiornati = 0;
    
    for (const mapping of idMappings) {
      // Trova defunti associati al vecchio ID numerico
      const { data: defunti, error: fetchError } = await supabase
        .from('defunti')
        .select('id')
        .eq('id_loculo', mapping.oldId.toString());
      
      if (fetchError) {
        console.error(`Errore nel recupero dei defunti per il loculo ${mapping.oldId}:`, fetchError);
        continue;
      }
      
      if (!defunti || defunti.length === 0) {
        continue;
      }
      
      // Aggiorna i riferimenti per ciascun defunto
      for (const defunto of defunti) {
        const { error: updateError } = await supabase
          .from('defunti')
          .update({ id_loculo: mapping.newId })
          .eq('id', defunto.id);
        
        if (updateError) {
          console.error(`Errore nell'aggiornamento del defunto ${defunto.id}:`, updateError);
        } else {
          aggiornati++;
        }
      }
    }
    
    if (aggiornati > 0) {
      toast.success(`Aggiornati ${aggiornati} riferimenti di defunti`);
      console.log(`Aggiornati ${aggiornati} riferimenti di defunti con successo`);
    } else {
      toast.info("Nessun defunto trovato da aggiornare");
    }
  } catch (error) {
    console.error("Errore durante l'aggiornamento dei riferimenti dei defunti:", error);
    toast.error("Si è verificato un errore durante l'aggiornamento dei riferimenti dei defunti");
  }
}
