
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useDocumentViewer } from "./useDocumentViewer";
import { DocumentViewerProps } from "./types";
import DeleteFileDialog from "./DeleteFileDialog";
import DocumentViewerOverlay from "./DocumentViewerOverlay";
import DocumentViewerContent from "./DocumentViewerContent";

const DocumentViewer = ({ 
  files, 
  open, 
  initialIndex, 
  onClose,
  onDeleteFile
}: DocumentViewerProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const {
    currentIndex,
    showControls,
    currentFile,
    scale,
    parseFileDetails,
    goToPreviousFile,
    goToNextFile,
    toggleControls,
    handleZoomIn,
    handleZoomOut
  } = useDocumentViewer({ files, open, initialIndex, onClose });

  const handleDeleteRequest = () => {
    if (onDeleteFile) {
      setDeleteDialogOpen(true);
    } else {
      toast({
        title: "Operazione non disponibile",
        description: "La funzione di eliminazione non è disponibile per questo documento.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!onDeleteFile || !currentFile?.id) return;
    
    try {
      setIsDeleting(true);
      console.log("Deleting file with ID:", currentFile.id);
      
      await onDeleteFile(currentFile.id);
      
      toast({
        title: "File eliminato",
        description: "Il file è stato eliminato con successo.",
      });
      
      onClose();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del file.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDownload = () => {
    if (currentFile?.url) {
      console.log("Starting download for file:", currentFile.url);
      try {
        const link = document.createElement('a');
        link.href = currentFile.url;
        link.target = '_blank';
        link.download = currentFile.title || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download error:", error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il download del file.",
          variant: "destructive"
        });
      }
    }
  };

  if (files.length === 0 || !open) return null;

  const fileDetails = parseFileDetails();
  
  return (
    <AnimatePresence>
      {open && (
        <DocumentViewerOverlay open={open} onClose={onClose}>
          <DocumentViewerContent
            currentIndex={currentIndex}
            showControls={showControls}
            currentFile={currentFile}
            scale={scale}
            files={files}
            fileDetails={fileDetails}
            onClose={onClose}
            onDeleteRequest={handleDeleteRequest}
            goToPreviousFile={goToPreviousFile}
            goToNextFile={goToNextFile}
            toggleControls={toggleControls}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleDownload={handleDownload}
          />
          
          <DeleteFileDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            fileTitle={fileDetails.title}
          />
        </DocumentViewerOverlay>
      )}
    </AnimatePresence>
  );
};

export default DocumentViewer;
