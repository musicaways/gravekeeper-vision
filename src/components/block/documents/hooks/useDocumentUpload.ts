
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileUploadFormValues } from "@/components/cemetery/documents/types";

export const useDocumentUpload = (blockId: string, onSuccess: () => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (values: FileUploadFormValues, selectedFile: File) => {
    console.log("Starting upload process for file:", selectedFile.name);
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const numericId = parseInt(blockId, 10);
      
      if (isNaN(numericId)) {
        console.error("Invalid block ID:", blockId);
        throw new Error("ID blocco non valido");
      }
      
      // 1. Generate a unique filename to prevent collisions
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${blockId}/${fileName}`;
      
      console.log("Generated file path:", filePath);
      setUploadProgress(20);
      
      // Set proper content type for the upload
      let contentType = 'application/octet-stream'; // default
      if (fileExt === 'pdf') contentType = 'application/pdf';
      else if (['jpg', 'jpeg'].includes(fileExt)) contentType = 'image/jpeg';
      else if (fileExt === 'png') contentType = 'image/png';
      else if (fileExt === 'gif') contentType = 'image/gif';
      else if (fileExt === 'bmp') contentType = 'image/bmp';
      
      console.log("Using content type:", contentType);
      console.log("Starting file upload to storage bucket...");
      setUploadProgress(30);
      
      // 2. Upload the file to Supabase Storage
      // Track progress manually
      let lastProgress = 0;
      
      // Periodically update progress while uploading (simulate progress since we can't track it directly)
      const progressInterval = setInterval(() => {
        if (lastProgress < 80) {
          lastProgress += 5;
          setUploadProgress(30 + lastProgress * 0.6);
        }
      }, 500);
      
      // Perform the upload - using the correct 'documents' bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: contentType
        });
      
      // Clear the progress interval
      clearInterval(progressInterval);
      
      if (uploadError) {
        console.error("File upload failed:", uploadError);
        throw new Error(`Errore durante il caricamento del file: ${uploadError.message}`);
      }
      
      console.log("File uploaded successfully, getting public URL...");
      setUploadProgress(90);
      
      // 3. Get the URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      const fileUrl = publicUrlData.publicUrl;
      
      console.log("Public URL obtained:", fileUrl);
      
      // 4. Save metadata to the database - using the correct lowercase column names
      console.log("Saving metadata to database...");
      const { error: dbError } = await supabase
        .from('bloccodocumenti')
        .insert({
          idblocco: numericId,
          nomefile: values.filename,
          descrizione: values.description,
          tipofile: fileExt?.toUpperCase() || 'FILE',
          url: fileUrl,
          datainserimento: new Date().toISOString()
        });
      
      if (dbError) {
        console.error("Database insert failed:", dbError);
        throw dbError;
      }
      
      console.log("Upload process completed successfully");
      setUploadProgress(100);
      
      toast({
        title: "File caricato",
        description: `${values.filename} è stato caricato con successo`,
      });
      
      setIsUploadDialogOpen(false);
      
      // Refresh the document list
      onSuccess();
      
    } catch (error) {
      console.error("Complete upload error:", error);
      toast({
        title: "Errore",
        description: error instanceof Error ? error.message : "Si è verificato un errore durante il caricamento",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  return {
    isUploading,
    uploadProgress,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    handleUpload
  };
};
