
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DocumentItemType } from "@/components/cemetery/documents/types";

export const useDocumentFetch = (blockId: string) => {
  const [documents, setDocuments] = useState<DocumentItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      
      const numericId = parseInt(blockId, 10);
      
      if (isNaN(numericId)) {
        toast({
          title: "Errore",
          description: "ID blocco non valido",
          variant: "destructive"
        });
        setDocuments([]);
        return;
      }

      const { data, error } = await supabase
        .from('bloccodocumenti')
        .select('*')
        .eq('idblocco', numericId)
        .order('datainserimento', { ascending: false });
        
      if (error) {
        console.error("Errore nel caricamento dei documenti:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento dei documenti",
          variant: "destructive"
        });
        setDocuments([]);
      } else {
        // Transform the data to match our DocumentItem interface
        const formattedDocuments = data.map(doc => {
          // Extract file extension for type
          const fileExtension = doc.tipofile || doc.nomefile.split('.').pop()?.toUpperCase() || 'FILE';
          
          // Format date
          const date = doc.datainserimento 
            ? new Date(doc.datainserimento).toLocaleDateString('it-IT') 
            : 'Data non disponibile';
          
          return {
            id: doc.id,
            name: doc.nomefile,
            description: doc.descrizione || '',
            type: fileExtension,
            // We don't have size information from the database
            size: 'N/A',
            date: date,
            url: doc.url
          };
        });
        
        setDocuments(formattedDocuments);
      }
    } catch (err) {
      console.error("Errore nel caricamento dei documenti:", err);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento dei documenti",
        variant: "destructive"
      });
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [blockId, toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return { documents, loading, refetch: fetchDocuments };
};
