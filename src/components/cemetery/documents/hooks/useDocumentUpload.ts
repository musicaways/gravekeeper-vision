
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileUploadFormValues } from "../types";

export const useDocumentUpload = (cemeteryId: string, onSuccess: () => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (values: FileUploadFormValues, selectedFile: File) => {
    console.log("Starting upload process for file:", selectedFile.name);
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const numericId = parseInt(cemeteryId, 10);
      
      if (isNaN(numericId)) {
        console.error("Invalid cemetery ID:", cemeteryId);
        throw new Error("ID cimitero non valido");
      }
      
      // 1. Generate a unique filename to prevent collisions
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase() || '';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${cemeteryId}/${fileName}`;
      
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
      
      // 2. Upload the file to Supabase Storage with progress tracking
      // Create an upload controller to track progress
      const uploadController = new AbortController();
      
      // Setup progress listener
      const progressListener = (progress: { uploadedBytes: number; totalBytes: number; }) => {
        if (progress.totalBytes > 0) {
          const calculatedProgress = (progress.uploadedBytes / progress.totalBytes) * 60;
          setUploadProgress(30 + calculatedProgress);
        }
      };
      
      // Perform the upload
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cemetery-documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: contentType,
          signal: uploadController.signal,
        });
      
      if (uploadError) {
        console.error("File upload failed:", uploadError);
        throw new Error(`Errore durante il caricamento del file: ${uploadError.message}`);
      }
      
      console.log("File uploaded successfully, getting public URL...");
      setUploadProgress(90);
      
      // 3. Get the URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('cemetery-documents')
        .getPublicUrl(filePath);
      
      const fileUrl = publicUrlData.publicUrl;
      
      console.log("Public URL obtained:", fileUrl);
      
      // 4. Save metadata to the database
      console.log("Saving metadata to database...");
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
      throw error; // Re-throw to be caught by the form
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
