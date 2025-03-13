
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

      const { error } = await supabase
        .from('Blocco')
        .update(data)
        .eq('Id', blockId);

      if (error) {
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
