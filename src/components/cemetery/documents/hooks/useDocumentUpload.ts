
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileUploadFormValues } from "../types";

export const useDocumentUpload = (cemeteryId: string, onSuccess: () => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (values: FileUploadFormValues, selectedFile: File) => {
    setIsUploading(true);

    try {
      const numericId = parseInt(cemeteryId, 10);
      
      if (isNaN(numericId)) {
        throw new Error("ID cimitero non valido");
      }
      
      // 1. Upload the file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${cemeteryId}/${fileName}`;
      
      console.log("Starting file upload...");
      
      // Set proper content type for the upload
      let contentType = 'application/octet-stream'; // default
      if (fileExt === 'pdf') contentType = 'application/pdf';
      else if (['jpg', 'jpeg'].includes(fileExt)) contentType = 'image/jpeg';
      else if (fileExt === 'png') contentType = 'image/png';
      else if (fileExt === 'gif') contentType = 'image/gif';
      else if (fileExt === 'bmp') contentType = 'image/bmp';
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cemetery-documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: contentType
        });
      
      if (uploadError) {
        console.error("Errore durante il caricamento del file:", uploadError);
        throw new Error(`Errore durante il caricamento del file: ${uploadError.message}`);
      }
      
      console.log("File uploaded successfully, getting public URL...");
      
      // 2. Get the URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('cemetery-documents')
        .getPublicUrl(filePath);
      
      const fileUrl = publicUrlData.publicUrl;
      
      console.log("Public URL obtained:", fileUrl);
      
      // 3. Save metadata to the database
      const { error: dbError } = await supabase
        .from('CimiteroDocumenti')
        .insert({
          IdCimitero: numericId,
          NomeFile: values.filename,
          Descrizione: values.description,
          TipoFile: fileExt?.toUpperCase() || 'FILE',
          Url: fileUrl,
          DataInserimento: new Date().toISOString()
        });
      
      if (dbError) {
        console.error("Errore durante il salvataggio dei metadati:", dbError);
        throw dbError;
      }
      
      toast({
        title: "File caricato",
        description: `${values.filename} è stato caricato con successo`,
      });
      
      setIsUploadDialogOpen(false);
      
      // Refresh the document list
      onSuccess();
      
    } catch (error) {
      console.error("Errore durante il caricamento:", error);
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante il caricamento",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    handleUpload
  };
};
