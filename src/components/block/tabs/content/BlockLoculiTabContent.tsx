
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LoculiList } from "../../loculi/LoculiList";

interface BlockLoculiTabContentProps {
  blockId: string;
  searchTerm?: string;
}

const BlockLoculiTabContent: React.FC<BlockLoculiTabContentProps> = ({ blockId, searchTerm = "" }) => {
  const [loculi, setLoculi] = useState([]);
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
        
        let query = supabase
          .from('Loculo')
          .select(`
            *,
            Defunti:Defunto(*)
          `)
          .eq('IdBlocco', numericBlockId);
        
        // Apply search filter if provided
        if (searchTerm) {
          // Search for matching loculi by number or fila
          query = query.or(`Numero.ilike.%${searchTerm}%,Fila.ilike.%${searchTerm}%`);
        }
        
        const { data, error: loculiError } = await query;
        
        if (loculiError) {
          console.error("Error fetching loculi:", loculiError);
          throw loculiError;
        }
        
        console.log("Loculi fetched:", data);
        
        // If we have a search term, also search for defunti by nominativo
        let additionalLoculi = [];
        if (searchTerm) {
          const { data: defuntiData, error: defuntiError } = await supabase
            .from('Defunto')
            .select(`
              *,
              Loculo:Loculo!inner(*)
            `)
            .eq('Loculo.IdBlocco', numericBlockId)
            .ilike('Nominativo', `%${searchTerm}%`);
          
          if (defuntiError) throw defuntiError;
          
          // Extract unique loculi from defunti search results
          if (defuntiData && defuntiData.length > 0) {
            const loculiFromDefunti = defuntiData.map(d => d.Loculo);
            // Only include loculi that aren't already in the main results
            additionalLoculi = loculiFromDefunti.filter(
              l => !data.some(existingLoculo => existingLoculo.Id === l.Id)
            );
          }
        }
        
        // Combine and set the results
        const combinedResults = [...(data || []), ...additionalLoculi];
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
