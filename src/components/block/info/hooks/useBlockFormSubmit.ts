
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

      // Assicuriamoci che i valori numerici siano corretti per Supabase
      const formattedData = {
        ...data,
        NumeroLoculi: data.NumeroLoculi === null ? null : Number(data.NumeroLoculi),
        NumeroFile: data.NumeroFile === null ? null : Number(data.NumeroFile),
        Latitudine: data.Latitudine === null ? null : Number(data.Latitudine),
        Longitudine: data.Longitudine === null ? null : Number(data.Longitudine),
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
