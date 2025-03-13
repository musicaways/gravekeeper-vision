
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlockFormData } from "../types/blockFormTypes";

interface UseBlockFormSubmitProps {
  blockId: number;
  onSuccess?: () => void;
}

export const useBlockFormSubmit = ({ blockId, onSuccess }: UseBlockFormSubmitProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitBlockForm = async (data: BlockFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Form data to submit:", data);

      // Ensure all numeric fields are properly converted from strings to numbers (or null)
      const formattedData = {
        ...data,
        NumeroLoculi: data.NumeroLoculi === null || data.NumeroLoculi === undefined || data.NumeroLoculi === "" ? null : 
          typeof data.NumeroLoculi === 'string' ? Number(data.NumeroLoculi) : data.NumeroLoculi,
        NumeroFile: data.NumeroFile === null || data.NumeroFile === undefined || data.NumeroFile === "" ? null : 
          typeof data.NumeroFile === 'string' ? Number(data.NumeroFile) : data.NumeroFile,
        Latitudine: data.Latitudine === null || data.Latitudine === undefined || data.Latitudine === "" ? null : 
          typeof data.Latitudine === 'string' ? Number(data.Latitudine) : data.Latitudine,
        Longitudine: data.Longitudine === null || data.Longitudine === undefined || data.Longitudine === "" ? null : 
          typeof data.Longitudine === 'string' ? Number(data.Longitudine) : data.Longitudine,
      };

      console.log("Formatted data for Supabase:", formattedData);

      const { error } = await supabase
        .from('Blocco')
        .update(formattedData)
        .eq('Id', blockId);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Modifiche salvate",
        description: "Le informazioni del blocco sono state aggiornate con successo",
      });

      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error: any) {
      console.error("Error updating block:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: `Non è stato possibile salvare le modifiche: ${error.message || 'Errore sconosciuto'}`,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitBlockForm,
    isSubmitting
  };
};
