
import { useState } from "react";
import { useDocumentFetch } from "./hooks/useDocumentFetch";
import { useDocumentDownload } from "./hooks/useDocumentDownload";
import { useDocumentDelete } from "./hooks/useDocumentDelete";
import { useDocumentUpload } from "./hooks/useDocumentUpload";
import { Document } from "./types"; 

export const useDocuments = (cemeteryId: string) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch documents
  const { documents, loading, refetch } = useDocumentFetch(cemeteryId);
  
  // Handle document download
  const { isDownloading, handleDownload } = useDocumentDownload();
  
  // Handle document delete
  const { handleDelete } = useDocumentDelete({
    cemeteryId,
    onSuccess: () => {
      refetch();
      setIsDeleteDialogOpen(false);
    }
  });
  
  // Handle document upload
  const { 
    isUploading, 
    uploadProgress,
    isUploadDialogOpen, 
    setIsUploadDialogOpen, 
    handleUpload 
  } = useDocumentUpload(cemeteryId, refetch);
  
  // Open the document delete confirmation dialog
  const openDeleteDialog = (document: Document) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle document click to open the viewer
  const handleDocumentClick = (document: Document) => {
    const index = documents.findIndex(doc => doc.id === document.id);
    if (index !== -1) {
      setSelectedDocIndex(index);
      setViewerOpen(true);
    }
  };
  
  return {
    documents,
    loading,
    viewerOpen,
    setViewerOpen,
    selectedDocIndex,
    isUploading,
    uploadProgress,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    isDeleteDialogOpen, 
    setIsDeleteDialogOpen,
    documentToDelete,
    isDownloading,
    handleUpload,
    handleDownload,
    openDeleteDialog,
    handleDelete,
    handleDocumentClick
  };
};
