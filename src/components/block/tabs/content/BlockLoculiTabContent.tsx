
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LoculiList } from "../../loculi/LoculiList";

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
function isLoculoLowercase(loculo: Loculo): loculo is LoculoLowercase {
  return 'id' in loculo;
}

function isLoculoUppercase(loculo: Loculo): loculo is LoculoUppercase {
  return 'Id' in loculo;
}

// Helper function to get the ID regardless of case
function getLoculoId(loculo: Loculo): string | number {
  if (isLoculoLowercase(loculo)) {
    return loculo.id;
  } else {
    return loculo.Id;
  }
}

const BlockLoculiTabContent: React.FC<BlockLoculiTabContentProps> = ({ blockId, searchTerm = "" }) => {
  const [loculi, setLoculi] = useState<Loculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoculi = async () => {
      try {
        setLoading(true);
        
        // Convert blockId string to number
        const numericBlockId = parseInt(blockId, 10);
        
        if (isNaN(numericBlockId)) {
          throw new Error("ID blocco non valido: deve essere un numero");
        }
        
        console.log("Fetching loculi for block ID:", numericBlockId);
        
        // Try fetching from both tables to see which one has data
        let query = supabase
          .from('loculi')
          .select(`
            *,
            defunti(*)
          `)
          .eq('id_blocco', numericBlockId);
        
        // Apply search filter if provided
        if (searchTerm) {
          // Search for matching loculi by number or fila
          query = query.or(`numero.ilike.%${searchTerm}%,fila.ilike.%${searchTerm}%`);
        }
        
        const { data: loculiData, error: loculiError } = await query;
        
        if (loculiError) {
          console.error("Error fetching from 'loculi' table:", loculiError);
          
          // Try the uppercase table as fallback
          const { data: loculoData, error: loculoError } = await supabase
            .from('Loculo')
            .select(`
              *,
              Defunti:Defunto(*)
            `)
            .eq('IdBlocco', numericBlockId);
            
          if (loculoError) {
            console.error("Error also fetching from 'Loculo' table:", loculoError);
            throw new Error("Impossibile caricare i loculi da entrambe le tabelle");
          }
          
          console.log("Loculi fetched from 'Loculo' table:", loculoData);
          setLoculi(loculoData || []);
        } else {
          console.log("Loculi fetched from 'loculi' table:", loculiData);
          
          // If no data in lowercase table but we have uppercase table data, try that
          if ((!loculiData || loculiData.length === 0)) {
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
              setLoculi(loculiData || []);
            }
          } else {
            setLoculi(loculiData || []);
          }
        }
        
        // If we have a search term, also search for defunti by nominativo
        let additionalLoculi: Loculo[] = [];
        if (searchTerm) {
          // Try with lowercase table first
          const { data: defuntiData, error: defuntiError } = await supabase
            .from('defunti')
            .select(`
              *,
              loculi!inner(*)
            `)
            .eq('loculi.id_blocco', numericBlockId)
            .ilike('nominativo', `%${searchTerm}%`);
          
          if (!defuntiError && defuntiData && defuntiData.length > 0) {
            // Extract unique loculi from defunti search results
            const loculiFromDefunti = defuntiData.map(d => d.loculi);
            // Only include loculi that aren't already in the main results
            additionalLoculi = loculiFromDefunti.filter(
              l => !loculi.some(existingLoculo => {
                const existingId = getLoculoId(existingLoculo);
                const newId = isLoculoLowercase(l) ? l.id : (l as LoculoUppercase).Id;
                return existingId === newId;
              })
            );
          } else {
            // Try uppercase table
            const { data: defuntoData, error: defuntoError } = await supabase
              .from('Defunto')
              .select(`
                *,
                Loculo!inner(*)
              `)
              .eq('Loculo.IdBlocco', numericBlockId)
              .ilike('Nominativo', `%${searchTerm}%`);
            
            if (!defuntoError && defuntoData && defuntoData.length > 0) {
              // Extract unique loculi from defunti search results
              const loculiFromDefunti = defuntoData.map(d => d.Loculo);
              // Only include loculi that aren't already in the main results
              additionalLoculi = loculiFromDefunti.filter(
                l => !loculi.some(existingLoculo => {
                  const existingId = getLoculoId(existingLoculo);
                  const newId = isLoculoUppercase(l) ? l.Id : (l as LoculoLowercase).id;
                  return existingId === newId;
                })
              );
            }
          }
        }
        
        // Combine and set the results
        const combinedResults = [...(loculi || []), ...additionalLoculi];
        setLoculi(combinedResults);
        setError(null);
      } catch (err) {
        console.error("Error fetching loculi:", err);
        setError("Impossibile caricare i loculi. Riprova più tardi.");
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
