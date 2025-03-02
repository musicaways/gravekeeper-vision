
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NicheInfo } from "@/types";

export function useNiches(blockId: string | null) {
  const [niches, setNiches] = useState<NicheInfo[]>([]);
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!blockId) {
      setIsLoading(false);
      setNiches([]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get block information
        const { data: blockData, error: blockError } = await supabase
          .from('Blocco')
          .select('NumeroFile, NumeroLoculi')
          .eq('Id', parseInt(blockId, 10))
          .single();
          
        if (blockError) throw blockError;
        
        if (blockData) {
          setRows(blockData.NumeroFile || 0);
          setColumns(blockData.NumeroLoculi || 0);
        }
        
        // Get loculo data with deceased information
        const { data: loculiData, error: loculiError } = await supabase
          .from('Loculo')
          .select(`
            Id,
            Numero,
            Fila,
            TipoTomba,
            Annotazioni,
            Defunto (
              Id,
              Nominativo,
              DataDecesso
            )
          `)
          .eq('IdBlocco', parseInt(blockId, 10));
          
        if (loculiError) throw loculiError;
        
        // Transform data to match NicheInfo type
        const nicheData: NicheInfo[] = (loculiData || []).map((loculo) => {
          return {
            id: loculo.Id.toString(),
            row: loculo.Fila || 0,
            column: loculo.Numero || 0,
            status: loculo.Defunto ? "occupied" : "available",
            deceasedName: loculo.Defunto ? loculo.Defunto.Nominativo : undefined,
            expirationDate: undefined
          };
        });
        
        setNiches(nicheData);
      } catch (err) {
        console.error('Error fetching niches:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load niche data"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [blockId, toast]);

  return {
    niches,
    rows,
    columns,
    isLoading,
    error,
    refetch: () => {
      // Re-trigger the effect
      setIsLoading(true);
    }
  };
}
