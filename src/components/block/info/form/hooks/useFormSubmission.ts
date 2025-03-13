
import { useState } from "react";
import { BlockFormData } from "../../types/blockFormTypes";
import { useBlockFormSubmit } from "../../hooks/useBlockFormSubmit";
import { useToast } from "@/hooks/use-toast";

interface UseFormSubmissionProps {
  block: any;
  onSuccess: (data: BlockFormData) => void;
}

export const useFormSubmission = ({ block, onSuccess }: UseFormSubmissionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { submitBlockForm, isSubmitting } = useBlockFormSubmit({ 
    blockId: block.Id,
    onSuccess: () => {} // We handle success in the onSubmit callback
  });
  const { toast } = useToast();

  const handleSubmit = async (data: BlockFormData) => {
    setIsUploading(true);
    try {
      console.log("Form data submitted:", data);
      
      // Check if there's a new cover image to upload
      let coverImageUrl = block.FotoCopertina;
      
      if (data.coverImage instanceof File) {
        try {
          const { uploadBlockCoverImage } = await import("../../utils/coverImageUtils");
          const newImageUrl = await uploadBlockCoverImage(block.Id, data.coverImage);
          if (newImageUrl) {
            coverImageUrl = newImageUrl;
          } else {
            toast({
              variant: "destructive",
              title: "Errore",
              description: "Impossibile caricare l'immagine di copertina. Le altre informazioni verranno aggiornate."
            });
          }
        } catch (error) {
          console.error("Error uploading cover image:", error);
          toast({
            variant: "destructive",
            title: "Errore",
            description: "Impossibile caricare l'immagine di copertina. Le altre informazioni verranno aggiornate."
          });
        }
      }
      
      // Add the cover image URL to the form data
      const dataToSave = {
        ...data,
        FotoCopertina: coverImageUrl,
        // Assicurati che la data sia null se è vuota
        DataCreazione: data.DataCreazione ? data.DataCreazione : null
      };
      
      // Remove the File object as it can't be sent to the API
      delete dataToSave.coverImage;
      
      console.log("Form data to submit:", dataToSave);
      
      const success = await submitBlockForm(dataToSave);
      if (success) {
        onSuccess(dataToSave);
      }
    } catch (error: any) {
      console.error("Error saving block data:", error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: `Non è stato possibile salvare le modifiche: ${error.message || 'Riprova più tardi'}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    isUploading
  };
};
