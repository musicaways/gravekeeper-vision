
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDocumentViewer } from "./useDocumentViewer";
import { DocumentViewerProps } from "./types";
import ViewerControls from "./ViewerControls";
import ViewerNavigation from "./ViewerNavigation";
import ViewerInfoBar from "./ViewerInfoBar";
import DeleteFileDialog from "./DeleteFileDialog";
import { Button } from "@/components/ui/button";

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
    parseFileDetails,
    goToPreviousFile,
    goToNextFile,
    toggleControls,
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
  
  const renderFilePreview = () => {
    const fileUrl = currentFile?.url || '';
    const fileTypeLower = fileType?.toLowerCase() || '';

    // PDF Preview
    if (fileTypeLower === 'pdf') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black/5 rounded-md overflow-hidden">
          <iframe 
            src={`${fileUrl}#toolbar=0`} 
            className="w-full h-full max-h-[75vh]"
            title={title || "PDF Document"}
          />
        </div>
      );
    }
    
    // Image Preview (jpg, png, gif, bmp, etc.)
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(fileTypeLower)) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={fileUrl} 
            alt={title || "Image"} 
            className="max-h-[75vh] max-w-full object-contain"
            onError={(e) => {
              console.error("Image load error:", e);
              e.currentTarget.src = "/placeholder.svg";
              e.currentTarget.alt = "Errore nel caricamento dell'immagine";
            }}
          />
        </div>
      );
    }
    
    // Generic Document
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-muted/30 rounded-md">
        <FileText className="h-24 w-24 text-primary/80 mb-4" />
        <h3 className="text-lg font-medium mb-2">{title || "Documento"}</h3>
        {fileType && <p className="text-sm text-muted-foreground mb-6 uppercase">{fileType}</p>}
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Scarica file
        </Button>
      </div>
    );
  };
  
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
          <button 
            className="absolute right-4 top-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
            onClick={onClose}
            aria-label="Chiudi visualizzatore"
          >
            <X className="h-6 w-6" />
          </button>
          
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
              />
              
              {/* Navigation buttons */}
              <ViewerNavigation 
                showControls={showControls}
                goToPreviousFile={goToPreviousFile}
                goToNextFile={goToNextFile}
              />
              
              {/* File Content */}
              <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 h-full flex items-center">
                {renderFilePreview()}
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
