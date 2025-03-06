
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useDocumentViewer } from "./useDocumentViewer";
import { DocumentViewerProps } from "./types";
import ViewerControls from "./ViewerControls";
import ViewerNavigation from "./ViewerNavigation";
import ViewerInfoBar from "./ViewerInfoBar";
import DeleteFileDialog from "./DeleteFileDialog";
import CloseButton from "./CloseButton";
import FilePreview from "./FilePreview";

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
      window.open(currentFile.url, '_blank');
    }
  };

  if (files.length === 0 || !open) return null;

  const { title, description, dateInfo, fileType } = parseFileDetails();
  
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/95 touch-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-modal="true"
          role="dialog"
          aria-label="Visualizzatore documenti"
          aria-describedby="document-viewer-description"
        >
          <span id="document-viewer-description" className="sr-only">Visualizzatore documenti a schermo intero</span>
          
          {/* Close button - always visible */}
          <CloseButton onClose={onClose} />
          
          <div className="w-full h-full flex flex-col overflow-hidden touch-none">
            <div 
              className="relative w-full h-full flex items-center justify-center touch-none"
              onClick={toggleControls}
            >
              {/* Top controls bar */}
              <ViewerControls 
                showControls={showControls}
                currentIndex={currentIndex}
                filesLength={files.length}
                onDeleteRequest={handleDeleteRequest}
                onDownload={handleDownload}
                fileType={fileType}
                scale={scale}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
              />
              
              {/* Navigation buttons */}
              <ViewerNavigation 
                showControls={showControls}
                goToPreviousFile={goToPreviousFile}
                goToNextFile={goToNextFile}
              />
              
              {/* File Content */}
              <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 h-full flex items-center overflow-hidden">
                <FilePreview 
                  currentFile={currentFile}
                  fileType={fileType}
                  title={title}
                  scale={scale}
                  handleDownload={handleDownload}
                  handleZoomIn={handleZoomIn}
                  toggleControls={toggleControls}
                />
              </div>
              
              {/* Bottom info bar */}
              <ViewerInfoBar 
                showControls={showControls}
                title={title}
                description={description}
                dateInfo={dateInfo}
                fileType={fileType}
              />
            </div>
          </div>
          
          <DeleteFileDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDeleteConfirm}
            fileTitle={title}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DocumentViewer;
