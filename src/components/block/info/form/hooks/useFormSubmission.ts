
import { useState } from "react";
import { BlockFormData } from "../../types/blockFormTypes";
import { useBlockFormSubmit } from "../../hooks/useBlockFormSubmit";
import { useToast } from "@/hooks/use-toast";
import { uploadBlockCoverImage } from "../../utils/coverImageUtils";

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
        console.log("New cover image detected, starting upload...");
        const newImageUrl = await uploadBlockCoverImage(block.Id, data.coverImage);
        
        if (newImageUrl) {
          console.log("Cover image uploaded successfully:", newImageUrl);
          coverImageUrl = newImageUrl;
        } else {
          console.error("Failed to upload cover image");
          toast({
            variant: "destructive",
            title: "Errore",
            description: "Impossibile caricare l'immagine di copertina. Le altre informazioni verranno aggiornate."
          });
        }
      } else {
        console.log("No new cover image to upload, keeping existing image:", coverImageUrl);
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
        console.log("Form data saved successfully");
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
