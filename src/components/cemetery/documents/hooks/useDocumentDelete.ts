
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
    try {
      // Get the document ID to delete
      const documentId = id || (documentToDelete?.id || '');
      
      if (!documentId) {
        console.error("No document ID provided for deletion");
        throw new Error("ID del documento non valido");
      }
      
      console.log("Deleting document with ID:", documentId);
      
      // 1. Delete from database
      const { error: dbError } = await supabase
        .from('CimiteroDocumenti')
        .delete()
        .eq('Id', documentId);
      
      if (dbError) {
        console.error("Error deleting from database:", dbError);
        throw dbError;
      }
      
      console.log("Document deleted from database successfully");
      
      // 2. Try to extract the storage path from the URL if we have the document object
      const docToDelete = documentToDelete || null;
      if (docToDelete && docToDelete.url) {
        console.log("Attempting to delete file from storage:", docToDelete.url);
        try {
          // Parse the URL to extract the path
          const storageUrl = new URL(docToDelete.url);
          const pathname = storageUrl.pathname;
          
          // Extract the bucket name and file path
          // The path is typically in the format: /storage/v1/object/public/{bucketName}/{filePath}
          const parts = pathname.split('/');
          const publicIndex = parts.indexOf('public');
          
          if (publicIndex >= 0 && parts.length > publicIndex + 2) {
            const bucketName = parts[publicIndex + 1];
            const filePath = parts.slice(publicIndex + 2).join('/');
            
            console.log("Extracted bucket:", bucketName, "and path:", filePath);
            
            // Delete the file from storage
            const { error: storageError } = await supabase.storage
              .from(bucketName)
              .remove([filePath]);
            
            if (storageError) {
              console.error("Error deleting from storage:", storageError);
              // Don't throw here, as we've already deleted from database
            } else {
              console.log("File deleted from storage successfully");
            }
          } else {
            console.warn("Could not parse storage path correctly from URL:", docToDelete.url);
          }
        } catch (parseError) {
          console.error("Error parsing URL for storage deletion:", parseError);
        }
      }
      
      toast({
        title: "Documento eliminato",
        description: docToDelete ? `${docToDelete.name} è stato eliminato con successo` : "Documento eliminato con successo",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error during deletion:", error);
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
