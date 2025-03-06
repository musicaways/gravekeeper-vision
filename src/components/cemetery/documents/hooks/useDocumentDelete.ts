
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DocumentItemType } from "../types";

interface UseDocumentDeleteOptions {
  cemeteryId: string;
  onSuccess: () => void;
}

export const useDocumentDelete = ({ cemeteryId, onSuccess }: UseDocumentDeleteOptions) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentItemType | null>(null);
  const { toast } = useToast();

  const openDeleteDialog = (document: DocumentItemType) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async (id?: string) => {
    const docToDelete = id 
      ? null // We'll load it from documents later
      : documentToDelete;
    
    if (!docToDelete && !id) return;
    
    try {
      // 1. Delete from database
      const { error: dbError } = await supabase
        .from('CimiteroDocumenti')
        .delete()
        .eq('Id', id || docToDelete?.id);
      
      if (dbError) {
        console.error("Errore durante l'eliminazione dal database:", dbError);
        throw dbError;
      }
      
      // 2. Try to extract the storage path from the URL
      if (docToDelete) {
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
      }
      
      toast({
        title: "Documento eliminato",
        description: docToDelete ? `${docToDelete.name} è stato eliminato con successo` : "Documento eliminato con successo",
      });
      
      onSuccess();
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
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    documentToDelete,
    openDeleteDialog,
    handleDelete
  };
};
