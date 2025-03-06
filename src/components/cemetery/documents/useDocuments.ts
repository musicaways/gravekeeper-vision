
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DocumentItemType, FileUploadFormValues } from "./types";

export const useDocuments = (cemeteryId: string) => {
  const [documents, setDocuments] = useState<DocumentItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentItemType | null>(null);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      const numericId = parseInt(cemeteryId, 10);
      
      if (isNaN(numericId)) {
        toast({
          title: "Errore",
          description: "ID cimitero non valido",
          variant: "destructive"
        });
        setDocuments([]);
        return;
      }

      const { data, error } = await supabase
        .from('CimiteroDocumenti')
        .select('*')
        .eq('IdCimitero', numericId)
        .order('DataInserimento', { ascending: false });
        
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
          const fileExtension = doc.TipoFile || doc.NomeFile.split('.').pop()?.toUpperCase() || 'FILE';
          
          // Format date
          const date = doc.DataInserimento 
            ? new Date(doc.DataInserimento).toLocaleDateString('it-IT') 
            : 'Data non disponibile';
          
          return {
            id: doc.Id,
            name: doc.NomeFile,
            description: doc.Descrizione || '',
            type: fileExtension,
            // We don't have size information from the database
            size: 'N/A',
            date: date,
            url: doc.Url
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
  };

  useEffect(() => {
    fetchDocuments();
  }, [cemeteryId]);

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
      fetchDocuments();
      
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

  const handleDownload = (document: DocumentItemType) => {
    window.open(document.url, '_blank');
  };

  const openDeleteDialog = (document: DocumentItemType) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async (id?: string) => {
    const docToDelete = id 
      ? documents.find(doc => doc.id === id) 
      : documentToDelete;
    
    if (!docToDelete) return;
    
    try {
      // 1. Delete from database
      const { error: dbError } = await supabase
        .from('CimiteroDocumenti')
        .delete()
        .eq('Id', docToDelete.id);
      
      if (dbError) {
        console.error("Errore durante l'eliminazione dal database:", dbError);
        throw dbError;
      }
      
      // 2. Try to extract the storage path from the URL
      try {
        const url = new URL(docToDelete.url);
        const pathParts = url.pathname.split('/');
        // Find the relevant part after the bucket name
        const objectPathIndex = pathParts.findIndex(part => part === 'object') + 2;
        if (objectPathIndex > 1 && objectPathIndex < pathParts.length) {
          const bucketIndex = pathParts.findIndex(part => part === 'public') + 1;
          if (bucketIndex > 0 && bucketIndex < pathParts.length) {
            const bucket = pathParts[bucketIndex];
            const objectPath = pathParts.slice(objectPathIndex).join('/');
            
            // 3. Delete from storage
            const { error: storageError } = await supabase.storage
              .from(bucket)
              .remove([objectPath]);
            
            if (storageError) {
              console.warn("File might not have been removed from storage:", storageError);
            }
          }
        }
      } catch (parseError) {
        console.warn("Couldn't parse file URL to delete from storage:", parseError);
      }
      
      toast({
        title: "Documento eliminato",
        description: `${docToDelete.name} è stato eliminato con successo`,
      });
      
      fetchDocuments();
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del documento",
        variant: "destructive"
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  return {
    documents,
    loading,
    isUploading,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    documentToDelete,
    handleUpload,
    handleDownload,
    openDeleteDialog,
    handleDelete
  };
};
