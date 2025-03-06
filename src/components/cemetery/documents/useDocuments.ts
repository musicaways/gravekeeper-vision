
import { useState } from "react";
import { DocumentItemType } from "./types";
import { 
  useDocumentFetch, 
  useDocumentUpload, 
  useDocumentDelete, 
  useDocumentDownload 
} from "./hooks";

export const useDocuments = (cemeteryId: string) => {
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  
  // Use our modular hooks
  const { documents, loading, fetchDocuments } = useDocumentFetch(cemeteryId);
  const { isUploading, isUploadDialogOpen, setIsUploadDialogOpen, handleUpload } = 
    useDocumentUpload(cemeteryId, fetchDocuments);
  const { isDeleteDialogOpen, setIsDeleteDialogOpen, documentToDelete, openDeleteDialog, handleDelete } = 
    useDocumentDelete(fetchDocuments);
  const { handleDownload, isDownloading } = useDocumentDownload();

  // Document viewer handling
  const handleDocumentClick = (index: number) => {
    setSelectedDocIndex(index);
    setViewerOpen(true);
  };

  return {
    // Document state
    documents,
    loading,
    
    // Document viewer state
    viewerOpen,
    setViewerOpen,
    selectedDocIndex,
    
    // Upload related
    isUploading,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
    
    // Delete related
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    documentToDelete,
    
    // Download related
    isDownloading,
    
    // Actions
    handleUpload,
    handleDownload,
    openDeleteDialog,
    handleDelete,
    handleDocumentClick
  };
};
