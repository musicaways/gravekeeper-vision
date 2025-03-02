
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { NicheInfo } from '@/types';

export const useNiches = (blockId: string | null) => {
  const [niches, setNiches] = useState<NicheInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [rows, setRows] = useState<number>(8);
  const [columns, setColumns] = useState<number>(12);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!blockId) {
      setIsLoading(false);
      return;
    }
    
    const fetchNiches = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get the number of rows and columns for the selected block
        const { data: blockData, error: blockError } = await supabase
          .from('Blocco')
          .select('NumeroFile, NumeroLoculi')
          .eq('Id', parseInt(blockId, 10))
          .single();
          
        if (blockError) throw blockError;
        
        if (blockData) {
          setRows(blockData.NumeroFile || 8);
          setColumns(blockData.NumeroLoculi || 12);
        }
        
        // Get the loculo data
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
        const nicheData: NicheInfo[] = (loculiData || []).map((loculo: any) => {
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
        setError(err instanceof Error ? err : new Error('Failed to load niche data'));
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load niche data"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNiches();
  }, [blockId, toast]);
  
  return { niches, isLoading, error, rows, columns };
};
