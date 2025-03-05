
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LoculiList } from "../../loculi/LoculiList";
import { toast } from "sonner";

interface BlockLoculiTabContentProps {
  blockId: string;
  searchTerm?: string;
}

// Define interfaces for our different table structures
interface LoculoLowercase {
  id: string;
  numero: number;
  fila: number;
  annotazioni?: string;
  id_blocco: number;
  tipo_tomba?: number;
  created_at?: string;
  updated_at?: string;
  defunti?: any[];
}

interface LoculoUppercase {
  Id: number;
  Numero: number;
  Fila: number;
  Annotazioni?: string;
  IdBlocco: number;
  TipoTomba?: number;
  Defunti?: any[];
}

// Union type to handle both structures
type Loculo = LoculoLowercase | LoculoUppercase;

// Type guard functions to check which type we're dealing with
function isLoculoLowercase(loculo: any): loculo is LoculoLowercase {
  return loculo && ('id' in loculo || 'numero' in loculo || 'fila' in loculo);
}

function isLoculoUppercase(loculo: any): loculo is LoculoUppercase {
  return loculo && ('Id' in loculo || 'Numero' in loculo || 'Fila' in loculo);
}

// Helper function to safely get the ID regardless of case
function getLoculoId(loculo: Loculo): string | number | undefined {
  if (isLoculoLowercase(loculo)) {
    return loculo.id;
  } else if (isLoculoUppercase(loculo)) {
    return loculo.Id;
  }
  return undefined;
}

const BlockLoculiTabContent: React.FC<BlockLoculiTabContentProps> = ({ blockId, searchTerm = "" }) => {
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
              .map(d => d.Loculo as LoculoUppercase); // Explicitly cast to correct type
            
            // Only include loculi that aren't already in the main results
            additionalLoculi = loculiFromDefunti.filter(
              newLoculo => !loculi.some(existingLoculo => {
                const existingId = isLoculoLowercase(existingLoculo) 
                  ? existingLoculo.id 
                  : isLoculoUppercase(existingLoculo) 
                    ? existingLoculo.Id 
                    : undefined;
                
                const newId = isLoculoUppercase(newLoculo) 
                  ? newLoculo.Id 
                  : undefined;
                
                return existingId === newId;
              })
            );
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
              
              // Extract unique loculi from defunti search results and ensure they're properly typed
              const loculiFromDefunti = defuntiData
                .filter(d => d.loculi) // Ensure loculi is defined
                .map(d => d.loculi as LoculoLowercase); // Explicitly cast to correct type
              
              // Only include loculi that aren't already in the main results
              additionalLoculi = loculiFromDefunti.filter(
                newLoculo => !loculi.some(existingLoculo => {
                  const existingId = isLoculoLowercase(existingLoculo) 
                    ? existingLoculo.id 
                    : isLoculoUppercase(existingLoculo) 
                      ? existingLoculo.Id 
                      : undefined;
                  
                  const newId = isLoculoLowercase(newLoculo) 
                    ? newLoculo.id 
                    : undefined;
                  
                  return existingId === newId;
                })
              );
            }
          }
        }
        
        // Combine and set the results
        const combinedResults = [...loculi, ...additionalLoculi];
        
        if (combinedResults.length === 0) {
          console.log("No loculi found for the specified block ID");
          toast.info("Nessun loculo trovato per questo blocco");
        }
        
        setLoculi(combinedResults);
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

  return (
    <Card className="shadow-sm overflow-hidden">
      <LoculiList 
        loculi={loculi} 
        loading={loading} 
        error={error} 
      />
    </Card>
  );
};

export default BlockLoculiTabContent;
