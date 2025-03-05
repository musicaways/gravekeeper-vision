
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loculo } from "@/components/block/loculi/types";

interface UseLoculiProps {
  blockId: string;
  searchTerm?: string;
}

interface UseLoculiResult {
  loculi: Loculo[];
  loading: boolean;
  error: string | null;
}

export function useLoculi({ blockId, searchTerm = "" }: UseLoculiProps): UseLoculiResult {
  const [loculi, setLoculi] = useState<Loculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoculi = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Convert blockId string to number
        const numericBlockId = parseInt(blockId, 10);
        
        if (isNaN(numericBlockId)) {
          throw new Error("ID blocco non valido: deve essere un numero");
        }
        
        console.log("Fetching loculi for block ID:", numericBlockId);
        
        // Try the uppercase Loculo table first
        const { data: loculoData, error: loculoError } = await supabase
          .from('Loculo')
          .select(`
            *,
            Defunti:Defunto(*)
          `)
          .eq('IdBlocco', numericBlockId);
            
        if (!loculoError && loculoData && loculoData.length > 0) {
          console.log("Loculi fetched from 'Loculo' table:", loculoData);
          setLoculi(loculoData);
        } else {
          console.log("Error or no data from 'Loculo' table:", loculoError);
          
          // Try the lowercase loculi table
          const { data: loculiData, error: loculiError } = await supabase
            .from('loculi')
            .select(`
              *,
              defunti(*)
            `)
            .eq('id_blocco', numericBlockId);
          
          if (loculiError) {
            console.error("Error fetching from 'loculi' table:", loculiError);
            throw new Error("Impossibile caricare i loculi: " + loculiError.message);
          }
          
          console.log("Loculi fetched from 'loculi' table:", loculiData);
          setLoculi(loculiData || []);
        }
        
        // If we have a search term, also search for defunti by nominativo
        let additionalLoculi: Loculo[] = [];
        if (searchTerm) {
          await fetchDefuntiBySearchTerm(numericBlockId, searchTerm, setLoculi, loculi);
        }
        
      } catch (err: any) {
        console.error("Error fetching loculi:", err);
        setError("Impossibile caricare i loculi. Riprova più tardi.");
        toast.error("Errore nel caricamento dei loculi: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoculi();
  }, [blockId, searchTerm]);

  return { loculi, loading, error };
}

// Helper function to search for defunti by name and extract their loculi
async function fetchDefuntiBySearchTerm(
  numericBlockId: number, 
  searchTerm: string,
  setLoculi: React.Dispatch<React.SetStateAction<Loculo[]>>,
  currentLoculi: Loculo[]
) {
  let additionalLoculi: Loculo[] = [];
  
  // Try to search in Defunto (uppercase) first
  const { data: defuntoData, error: defuntoError } = await supabase
    .from('Defunto')
    .select(`
      *,
      Loculo!inner(*)
    `)
    .eq('Loculo.IdBlocco', numericBlockId)
    .ilike('Nominativo', `%${searchTerm}%`);
  
  if (!defuntoError && defuntoData && defuntoData.length > 0) {
    console.log("Defunti found in 'Defunto' table:", defuntoData);
    
    // Extract unique loculi from defunti search results and ensure they're properly typed
    const loculiFromDefunti = defuntoData
      .filter(d => d.Loculo) // Ensure Loculo is defined
      .map(d => d.Loculo);
    
    // Only include loculi that aren't already in the main results
    additionalLoculi = filterUniqueLoculi(loculiFromDefunti, currentLoculi);
  } else {
    // Try lowercase defunti table
    const { data: defuntiData, error: defuntiError } = await supabase
      .from('defunti')
      .select(`
        *,
        loculi!inner(*)
      `)
      .eq('loculi.id_blocco', numericBlockId)
      .ilike('nominativo', `%${searchTerm}%`);
    
    if (!defuntiError && defuntiData && defuntiData.length > 0) {
      console.log("Defunti found in 'defunti' table:", defuntiData);
      
      // Extract unique loculi from defunti search results
      const loculiFromDefunti = defuntiData
        .filter(d => d.loculi) // Ensure loculi is defined
        .map(d => d.loculi);
      
      // Only include loculi that aren't already in the main results
      additionalLoculi = filterUniqueLoculi(loculiFromDefunti, currentLoculi);
    }
  }
  
  // Combine and set the results
  const combinedResults = [...currentLoculi, ...additionalLoculi];
  
  if (combinedResults.length === 0) {
    console.log("No loculi found for the specified block ID");
    toast.info("Nessun loculo trovato per questo blocco");
  }
  
  setLoculi(combinedResults);
}

// Helper function to filter out loculi that are already in the current results
function filterUniqueLoculi(newLoculi: any[], currentLoculi: Loculo[]): Loculo[] {
  return newLoculi.filter(
    newLoculo => !currentLoculi.some(existingLoculo => {
      // Get ID from existing loculo based on its type
      const existingId = existingLoculo && 'id' in existingLoculo 
        ? existingLoculo.id 
        : existingLoculo && 'Id' in existingLoculo 
          ? existingLoculo.Id 
          : undefined;
      
      // Get ID from new loculo based on its type
      const newId = newLoculo && 'id' in newLoculo 
        ? newLoculo.id 
        : newLoculo && 'Id' in newLoculo 
          ? newLoculo.Id 
          : undefined;
      
      return existingId === newId;
    })
  );
}
