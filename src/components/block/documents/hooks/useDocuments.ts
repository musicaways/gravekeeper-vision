
import { useState } from "react";
import { useDocumentFetch } from "./useDocumentFetch";
import { useDocumentDownload } from "./useDocumentDownload";
import { useDocumentDelete } from "./useDocumentDelete";
import { useDocumentUpload } from "./useDocumentUpload";
import { DocumentItemType } from "@/components/cemetery/documents/types"; 

export const useDocuments = (blockId: string) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentItemType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch documents
  const { documents, loading, refetch } = useDocumentFetch(blockId);
  
  // Handle document download
  const { isDownloading, handleDownload } = useDocumentDownload();
  
  // Handle document delete
  const { handleDelete } = useDocumentDelete({
    blockId,
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
  } = useDocumentUpload(blockId, refetch);
  
  // Open the document delete confirmation dialog
  const openDeleteDialog = (document: DocumentItemType) => {
    setDocumentToDelete(document);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle document click to open the viewer
  const handleDocumentClick = (document: DocumentItemType) => {
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
